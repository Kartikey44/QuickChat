import Message from "../model/message.model.js";
import User from "../model/user.model.js";
import dotenv from "dotenv";
dotenv.config();
export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId }
        }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getting all contact", error);
        res.status(500).json({ message: "server error", success: false });
    }
};
export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const partnerIds = new Set();

        messages.forEach((msg) => {
            if (msg.senderId.toString() === loggedInUserId.toString()) {
                partnerIds.add(msg.receiverId.toString());
            }

            if (msg.receiverId.toString() === loggedInUserId.toString()) {
                partnerIds.add(msg.senderId.toString());
            }
        });

        const partners = await User.find({
            _id: { $in: Array.from(partnerIds) }
        }).select("-password");

        res.status(200).json(partners);
    } catch (error) {
        console.log("Error in getting chat partners", error);
        res.status(500).json({ message: "server error", success: false });
    }
};
export const getMessageByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json({ messages, success: true });
    } catch (error) {
        console.log("Getting message Error", error);
        res.status(500).json({ message: "Internal server error", success: false });
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