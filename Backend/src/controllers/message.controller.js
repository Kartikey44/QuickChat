import { getReceiverSocketId, io } from "../config/socketio.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const getContactsData = async (req, res) => {
  try {
    const userId = req.user._id;

    const allUsers = await User.find({
      _id: { $ne: userId },
    }).select("-password");

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    }).select("senderId receiverId");

    const partnerIds = new Set();

    messages.forEach((msg) => {
      if (
        String(msg.senderId) ===
        String(userId)
      ) {
        partnerIds.add(
          String(msg.receiverId)
        );
      } else {
        partnerIds.add(
          String(msg.senderId)
        );
      }
    });

    const chatPartners = [];
    const newContacts = [];

    allUsers.forEach((user) => {
      if (
        partnerIds.has(
          String(user._id)
        )
      ) {
        chatPartners.push(user);
      } else {
        newContacts.push(user);
      }
    });

    res.status(200).json({
      allUsers,
      chatPartners,
      newContacts,
    });
  } catch (error) {
    console.log(
      "Error in getContactsData:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* -------------------------------- */
/* Get Messages */
/* -------------------------------- */

export const getMessages = async (
  req,
  res
) => {
  try {
    const myId = req.user._id;

    const {
      userId: userToChatId,
    } = req.params;

    const messages =
      await Message.find({
        $or: [
          {
            senderId: myId,
            receiverId:
              userToChatId,
          },
          {
            senderId:
              userToChatId,
            receiverId: myId,
          },
        ],
      })
        .sort({
          createdAt: 1,
        })
        .lean();

    const normalized =
      messages.map((msg) => ({
        ...msg,

        senderId:
          msg.senderId.toString(),

        receiverId:
          msg.receiverId.toString(),
      }));

    res.status(200).json({
      messages: normalized,
    });
  } catch (error) {
    console.log(
      "Error in getMessages:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* -------------------------------- */
/* Send Message */
/* -------------------------------- */

export const sendMessage = async (
  req,
  res
) => {
  try {
    const senderId =
      req.user._id;

    const {
      content,
      receiverId,
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
        mime.startsWith("image/")
      ) {
        image = fileUrl;
      } else if (
        mime.startsWith("video/")
      ) {
        video = fileUrl;
      } else {
        document = fileUrl;
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
      });

    const newMessage = {
      ...created.toObject(),

      senderId:
        created.senderId.toString(),

      receiverId:
        created.receiverId.toString(),
    };

    const receiverSocketId =
      getReceiverSocketId(
        receiverId
      );

    if (receiverSocketId) {
      io.to(receiverSocketId).emit(
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
        error.message ||
        "Failed to send message",
    });
  }
};
/* -------------------------------- */
/* Unread Count */
/* -------------------------------- */

export const getUnreadCount = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const count =
      await Message.countDocuments({
        receiverId: userId,
        seen: false,
      });

    res.status(200).json({
      unreadCount: count,
    });
  } catch (error) {
    console.log(
      "Error in getUnreadCount:",
      error.message
    );

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

/* -------------------------------- */
/* Unread Chats */
/* -------------------------------- */

export const getUnreadChats = async (
  req,
  res
) => {
  try {
    const userId = req.user._id;

    const unread =
      await Message.aggregate([
        {
          $match: {
            receiverId: userId,
            seen: false,
          },
        },
        {
          $group: {
            _id: "$senderId",
            count: {
              $sum: 1,
            },
          },
        },
      ]);

    res.status(200).json(unread);
  } catch (error) {
    console.log(
      "Error in getUnreadChats:",
      error.message
    );

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

/* -------------------------------- */
/* Mark Read */
/* -------------------------------- */

export const markMessagesAsRead =
  async (req, res) => {
    try {
      const { senderId } =
        req.params;

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
            readAt: new Date(),
          },
        }
      );

      res.status(200).json({
        message:
          "Messages marked as read",
      });
    } catch (error) {
      console.log(
        "Error in markMessagesAsRead:",
        error.message
      );

      res.status(500).json({
        error:
          "Internal Server Error",
      });
    }
  };
  