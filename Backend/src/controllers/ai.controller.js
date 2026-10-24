import AIMessage from "../models/ai.model.js";
import { generateAIResponse } from "../services/ai.services.js";
import { getOrCreateConversationId } from "../utils/conversation.helper.js";

const DAILY_LIMIT = 20;

const GREETINGS = new Set([
  "hi",
  "hello",
  "hey",
  "namaste",
  "good morning",
  "good afternoon",
  "good evening",
]);

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationId: requestedId } = req.body ?? {};

    // Validate request
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid message.",
      });
    }

    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const cleanMessage = message.trim();
    const user = req.user;
    const userId = user._id;

    const conversationId = getOrCreateConversationId(requestedId);

    // Reset daily usage when the date changes.
    const now = new Date();

    const isNewDay =
      !user.dailyAiDate ||
      new Date(user.dailyAiDate).toDateString() !== now.toDateString();

    if (isNewDay) {
      user.dailyAiCount = 0;
      user.dailyAiDate = now;
      await user.save();
    }

    const usedCount = Math.max(0, Number(user.dailyAiCount) || 0);

    // Apply the limit to greetings and normal messages.
    if (usedCount >= DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message: "Daily AI limit reached. Please try again tomorrow.",
        conversationId,
        remainingRequests: 0,
      });
    }

    // Handle simple greetings without an API call.
    const normalizedMessage = cleanMessage.toLowerCase();

    let aiReply;

    if (GREETINGS.has(normalizedMessage)) {
      aiReply = "Namaste! 🙏 How can I help you today?";
    } else {
      try {
        // Send only the current message to Gemini.
        aiReply = await generateAIResponse(cleanMessage);
      } catch (error) {
        const status = Number(error.status ?? error.statusCode);

        const isQuotaError =
          status === 429 ||
          /resource_exhausted|quota|rate.?limit|429/i.test(error.message ?? "");

        console.error("Gemini request failed:", {
          message: error.message,
          status: error.status,
          conversationId,
        });

        if (isQuotaError) {
          return res.status(429).json({
            success: false,
            message:
              "The AI service has reached its current usage limit. Please try again later.",
            conversationId,
          });
        }

        return res.status(502).json({
          success: false,
          message:
            "The AI service is temporarily unavailable. Please try again.",
          conversationId,
        });
      }
    }

    // Persist the successful exchange.
    await AIMessage.create({
      userId,
      role: "user",
      content: cleanMessage,
      conversationId,
    });

    const savedAIMessage = await AIMessage.create({
      userId,
      role: "assistant",
      content: aiReply,
      conversationId,
    });

    // Count successful exchanges, including greetings.
    user.dailyAiCount = usedCount + 1;
    user.dailyAiDate = now;
    await user.save();

    return res.status(200).json({
      success: true,
      reply: aiReply,
      message: savedAIMessage,
      conversationId,
      remainingRequests: Math.max(0, DAILY_LIMIT - user.dailyAiCount),
    });
  } catch (error) {
    console.error("AI controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process your AI request.",
    });
  }
};

/* =========================
   GET AI CONVERSATION
========================= */

export const getAIConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      typeof conversationId !== "string" ||
      !conversationId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    // Only retrieve messages belonging to this user.
    const messages = await AIMessage.find({
      userId,
      conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversationId,
      messages,
    });
  } catch (error) {
    console.error("GET AI CONVERSATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch AI conversation.",
    });
  }
};


/* =========================
   DELETE AI CONVERSATION
========================= */

export const deleteAIConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      typeof conversationId !== "string" ||
      !conversationId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required.",
      });
    }

    // Delete only messages belonging to this user
    // and this specific conversation.
    const result = await AIMessage.deleteMany({
      userId,
      conversationId,
    });

    return res.status(200).json({
      success: true,
      message: "AI conversation deleted successfully.",
      conversationId,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("DELETE AI CONVERSATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete AI conversation.",
    });
  }
};
