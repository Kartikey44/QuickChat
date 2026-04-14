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

        const newMessage = new Message({
            senderId,
            receiverId,
            content
        });

        await newMessage.save();

        res.status(200).json({
            message: "Message sent successfully",
            success: true
        });
    } catch (error) {
        console.log("Error in sending message", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
