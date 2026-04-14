import express from "express"
import { getAllContacts,getChatPartners,getMessageByUserId,sendMessage } from "../controllers/message.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
const router = express.Router()
router.get("/contacts",protectRoute,getAllContacts)
router.get("/chats",protectRoute,getChatPartners)
router.get("/:id",protectRoute,getMessageByUserId)

router.post("/send", protectRoute, sendMessage)
export default router