import mongoose from "mongoose";
import AIMessage from "../models/ai.model.js";

/**
 * Generate a unique conversation ID
 */
export const generateConversationId = () => {
  return new mongoose.Types.ObjectId().toString();
};

/**
 * Get conversation ID or create a new one
 */
export const getOrCreateConversationId = (
  conversationId,
) => {
  return (
    conversationId ||
    generateConversationId()
  );
};

/**
 * Fetch recent chat history
 */
export const getRecentMessages =
  async (
    userId,
    conversationId,
    limit = 20,
  ) => {
    const messages =
      await AIMessage.find({
        userId,
        conversationId,
      })
        .sort({
          createdAt: -1,
        })
        .limit(limit);

    return messages.reverse();
  };

/**
 * Generate conversation title
 * Uses first message as title
 */
export const generateConversationTitle =
  (message) => {
    if (!message)
      return "New Chat";

    return message.length > 40
      ? `${message.substring(
          0,
          40,
        )}...`
      : message;
  };