import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { uploadChatImage } from "../middleware/upload.middleware.js";

import {
  sendMessage,
  getMessageByUserId,
  markMessagesAsRead,
  getContactsData
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/contacts-data", protectRoute, getContactsData);

router.get("/:id", protectRoute, getMessageByUserId);

router.post(
  "/send",
  protectRoute,
  uploadChatImage.single("image"),
  sendMessage
);

router.put("/mark-read/:senderId", protectRoute, markMessagesAsRead);

export default router;