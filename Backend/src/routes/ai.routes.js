import express from "express";

import {
  chatWithAI,
  getAIConversation,
  deleteAIConversation,
} from "../controllers/ai.controller.js";

import {protectRoute} from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/chat",
  protectRoute,
  chatWithAI
);

router.get(
  "/conversation/:conversationId",
  protectRoute,
  getAIConversation
);

router.delete(
  "/conversation/:conversationId",
  protectRoute,
  deleteAIConversation
);

export default router;