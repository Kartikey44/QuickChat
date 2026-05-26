import express from "express";

import {
  getContactsData,
  getMessages,
  sendMessage,
  getUnreadCount,
  getUnreadChats,
  markMessagesAsRead,
} from "../controllers/message.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

import {
  uploadChatImage,
} from "../middleware/upload.middleware.js";

const router = express.Router();

/* Contacts */

router.get(
  "/contacts-data",
  protectRoute,
  getContactsData
);

/* Messages */

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

/* Unread */

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

/* Mark Read */

router.put(
  "/mark-read/:senderId",
  protectRoute,
  markMessagesAsRead
);

export default router;