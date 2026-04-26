import express from "express"
import { getAllContacts,getChatPartners,getMessageByUserId,sendMessage,getUnreadChats,getUnreadCount,markMessagesAsRead} from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
const router = express.Router()
router.get("/contacts",protectRoute,getAllContacts)
router.get("/chats", protectRoute, getChatPartners)
router.get("/unread-count", protectRoute, getUnreadCount);
router.put("/mark-read/:senderId", protectRoute, markMessagesAsRead);
router.get("/unread", protectRoute, getUnreadChats)
router.get("/:id",protectRoute,getMessageByUserId)
router.post("/send", protectRoute, sendMessage)
export default router