import { getReceiverSocketId, io } from "../lib/socketio.js";
import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
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
      if (msg.senderId.toString() === userId.toString()) {
        partnerIds.add(msg.receiverId.toString());
      } else {
        partnerIds.add(msg.senderId.toString());
      }
    });

    const chatPartners = [];
    const newContacts = [];

    allUsers.forEach((user) => {
      if (partnerIds.has(user._id.toString())) {
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
    console.log("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      console.log("Invalid ID:", userToChatId);
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.log("Error in getMessageByUserId:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, content } = req.body;
    const image = req.file ? req.file.path : null; 
    if (!content && !image) {
      return res.status(400).json({
        message: "Message must contain text or image",
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      image,
    });
    console.log("req.body:", req.body)
    console.log("req.file:",req.file)
    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newMessage); 
  } catch (error) {
    console.log("Error in sending message", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getUnreadCount = async (req, res) => {
     try {
    const userId = req.user._id;
    const count = await Message.countDocuments({
      receiverId: userId,
      seen: false,
    });
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    console.log("Error in getUnreadCount:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export const getUnreadChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const unread = await Message.aggregate([
      {
        $match: {
          receiverId: userId,
          seen: false,
        },
      },
      {
        $group: {
          _id: "$senderId",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(unread);
  } catch (error) {
    console.log("Error in getUnreadPerChat:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export const markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const receiverId = req.user._id;

    await Message.updateMany(
      {
        senderId,
        receiverId,
        seen: false,
      },
      {
        $set: { seen: true },
      }
    );
    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.log("Error in markMessagesAsRead:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};