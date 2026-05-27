import express from "express";
import {
  getContactsData,
  getMessages,
  sendMessage,
  clearChat,
  deleteMessage,
  editMessage,
  getUnreadCount,
  getUnreadChats,
  markMessagesAsRead,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  uploadChatImage,
} from "../middleware/upload.middleware.js";
const router = express.Router();
router.get(
  "/contacts-data",
  protectRoute,
  getContactsData
);
router.get(
  "/:userId",
  protectRoute,
  getMessages
);
router.post(
  "/send",
  protectRoute,
  uploadChatImage.single("file"),
  sendMessage
);
router.delete(
  "/delete/:messageId",
  protectRoute,
  deleteMessage
);
router.put(
  "/edit/:messageId",
  protectRoute,
  editMessage
);
router.get(
  "/unread/count",
  protectRoute,
  getUnreadCount
);
router.get(
  "/unread/chats",
  protectRoute,
  getUnreadChats
);
router.put(
  "/mark-read/:senderId",
  protectRoute,
  markMessagesAsRead
);
router.delete(
  "/clear/:id",
  protectRoute,
  clearChat
);
export default router;