// COMPLETE message.controller.js

import {
  getReceiverSocketId,
  io,
} from "../config/socketio.js";

import Message from "../models/message.model.js";
import User from "../models/user.model.js";

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/* ======================================== */
/* GET CONTACTS DATA */
/* ======================================== */

export const getContactsData =
  async (req, res) => {
    try {
      const userId =
        req.user._id;

      const allUsers =
        await User.find({
          _id: {
            $ne: userId,
          },
        }).select("-password");

      // latest messages aggregation
      const latestMessages =
        await Message.aggregate([
          {
            $match: {
              $or: [
                {
                  senderId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),
                },
                {
                  receiverId:
                    new mongoose.Types.ObjectId(
                      userId
                    ),
                },
              ],
            },
          },

          {
            $sort: {
              createdAt: -1,
            },
          },

          {
            $group: {
              _id: {
                $cond: [
                  {
                    $eq: [
                      "$senderId",
                      new mongoose.Types.ObjectId(
                        userId
                      ),
                    ],
                  },

                  "$receiverId",

                  "$senderId",
                ],
              },

              latestMessage: {
                $first:
                  "$$ROOT",
              },
            },
          },
        ]);

      const latestMap = {};

      latestMessages.forEach(
        (item) => {
          latestMap[
            item._id.toString()
          ] =
            item.latestMessage.createdAt;
        }
      );

      const usersWithTime =
        allUsers.map((user) => ({
          ...user.toObject(),

          lastMessageTime:
            latestMap[
              user._id.toString()
            ] || null,
        }));

      // latest chat first
      usersWithTime.sort(
        (a, b) => {
          if (
            !a.lastMessageTime
          )
            return 1;

          if (
            !b.lastMessageTime
          )
            return -1;

          return (
            new Date(
              b.lastMessageTime
            ) -
            new Date(
              a.lastMessageTime
            )
          );
        }
      );

      const chatPartners =
        usersWithTime.filter(
          (u) =>
            u.lastMessageTime
        );

      const newContacts =
        usersWithTime.filter(
          (u) =>
            !u.lastMessageTime
        );

      res.status(200).json({
        allUsers:
          usersWithTime,

        chatPartners,

        newContacts,
      });
    } catch (error) {
      console.log(
        "getContactsData error:",
        error
      );

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ======================================== */
/* GET MESSAGES */
/* ======================================== */

export const getMessages =
  async (req, res) => {
    try {
      const myId =
        req.user._id;

      const {
        userId:
          userToChatId,
      } = req.params;

      const messages =
        await Message.find({
          $or: [
            {
              senderId:
                myId,

              receiverId:
                userToChatId,
            },

            {
              senderId:
                userToChatId,

              receiverId:
                myId,
            },
          ],
        })
          .sort({
            createdAt: 1,
          })

          .populate({
            path: "replyTo",

            select:
              "content image senderId",

            populate: {
              path: "senderId",

              select: "name",
            },
          })

          .lean();

      const normalized =
        messages.map(
          (msg) => ({
            ...msg,

            senderId:
              msg.senderId?.toString(),

            receiverId:
              msg.receiverId?.toString(),

            replyTo:
              msg.replyTo
                ? {
                    ...msg.replyTo,

                    senderName:
                      msg.replyTo
                        .senderId
                        ?.name,
                  }
                : null,
          })
        );

      res.status(200).json({
        messages:
          normalized,
      });
    } catch (error) {
      console.log(
        "getMessages error:",
        error
      );

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ======================================== */
/* SEND MESSAGE */
/* ======================================== */

export const sendMessage =
  async (req, res) => {
    try {
      const senderId =
        req.user._id;

      const {
        content,
        receiverId,
        replyTo,
      } = req.body;

      let image = "";
      let video = "";
      let document = "";

      if (req.file) {
        const fileUrl =
          req.file.path;

        const mime =
          req.file.mimetype;

        if (
          mime.startsWith(
            "image/"
          )
        ) {
          image = fileUrl;
        } else if (
          mime.startsWith(
            "video/"
          )
        ) {
          video = fileUrl;
        } else {
          document =
            fileUrl;
        }
      }

      const created =
        await Message.create({
          senderId,

          receiverId,

          content,

          image,

          video,

          document,

          replyTo:
            replyTo ||
            null,
        });

      const populated =
        await Message.findById(
          created._id
        )
          .populate({
            path: "replyTo",

            select:
              "content image senderId",

            populate: {
              path: "senderId",

              select: "name",
            },
          })

          .lean();

      const newMessage = {
        ...populated,

        senderId:
          populated.senderId.toString(),

        receiverId:
          populated.receiverId.toString(),

        replyTo:
          populated.replyTo
            ? {
                ...populated.replyTo,

                senderName:
                  populated
                    .replyTo
                    .senderId
                    ?.name,
              }
            : null,
      };

      const receiverSocketId =
        getReceiverSocketId(
          receiverId
        );

      if (receiverSocketId) {
        io.to(
          receiverSocketId
        ).emit(
          "newMessage",
          newMessage
        );
      }

      res.status(201).json(
        newMessage
      );
    } catch (error) {
      console.log(
        "sendMessage error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Failed to send message",
      });
    }
  };

/* ======================================== */
/* EDIT MESSAGE */
/* ======================================== */

export const editMessage =
  async (req, res) => {
    try {
      const {
        content,
      } = req.body;

      const message =
        await Message.findById(
          req.params
            .messageId
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      // only sender can edit
      if (
        message.senderId.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Unauthorized",
          });
      }

      message.content =
        content;

      message.edited = true;

      await message.save();

      res.status(200).json(
        message
      );
    } catch (error) {
      console.log(
        "editMessage error:",
        error
      );

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ======================================== */
/* DELETE MESSAGE */
/* ======================================== */

export const deleteMessage =
  async (req, res) => {
    try {
      const message =
        await Message.findById(
          req.params
            .messageId
        );

      if (!message) {
        return res
          .status(404)
          .json({
            message:
              "Message not found",
          });
      }

      // only sender can delete
      if (
        message.senderId.toString() !==
        req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({
            message:
              "Unauthorized",
          });
      }

      await message.deleteOne();

      res.status(200).json({
        success: true,

        message:
          "Message deleted",
      });
    } catch (error) {
      console.log(
        "deleteMessage error:",
        error
      );

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  };

/* ======================================== */
/* CLEAR CHAT */
/* ======================================== */

export const clearChat =
  async (req, res) => {
    try {
      const userToDelete =
        req.params.id;

      const myId =
        req.user._id;

      await Message.deleteMany({
        $or: [
          {
            senderId:
              myId,

            receiverId:
              userToDelete,
          },

          {
            senderId:
              userToDelete,

            receiverId:
              myId,
          },
        ],
      });

      res.status(200).json({
        success: true,

        message:
          "Chat cleared",
      });
    } catch (error) {
      console.log(
        "clearChat error:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Server Error",
      });
    }
  };

/* ======================================== */
/* GET UNREAD COUNT */
/* ======================================== */

export const getUnreadCount =
  async (req, res) => {
    try {
      const userId =
        req.user._id;

      const count =
        await Message.countDocuments(
          {
            receiverId:
              userId,

            seen: false,
          }
        );

      res.status(200).json({
        unreadCount:
          count,
      });
    } catch (error) {
      console.log(
        "getUnreadCount error:",
        error
      );

      res.status(500).json({
        error:
          "Internal Server Error",
      });
    }
  };

/* ======================================== */
/* GET UNREAD CHATS */
/* ======================================== */

export const getUnreadChats =
  async (req, res) => {
    try {
      const userId =
        req.user._id;

      const unread =
        await Message.aggregate([
          {
            $match: {
              receiverId:
                userId,

              seen: false,
            },
          },

          {
            $group: {
              _id:
                "$senderId",

              count: {
                $sum: 1,
              },
            },
          },
        ]);

      res.status(200).json(
        unread
      );
    } catch (error) {
      console.log(
        "getUnreadChats error:",
        error
      );

      res.status(500).json({
        error:
          "Internal Server Error",
      });
    }
  };

/* ======================================== */
/* MARK AS READ */
/* ======================================== */

export const markMessagesAsRead =
  async (req, res) => {
    try {
      const {
        senderId,
      } = req.params;

      const receiverId =
        req.user._id;

      await Message.updateMany(
        {
          senderId,

          receiverId,

          seen: false,
        },

        {
          $set: {
            seen: true,

            readAt:
              new Date(),
          },
        }
      );

      res.status(200).json({
        message:
          "Messages marked as read",
      });
    } catch (error) {
      console.log(
        "markMessagesAsRead error:",
        error
      );

      res.status(500).json({
        error:
          "Internal Server Error",
      });
    }
  };