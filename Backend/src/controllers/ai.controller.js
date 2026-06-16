import AIMessage from "../models/ai.model.js";
import { generateAIResponse } from "../services/ai.services.js";
import { getOrCreateConversationId } from "../utils/conversation.helper.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    const user = req.user;
    const userId = user._id;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Daily AI limit check
    const today = new Date().toDateString();

    if (
      !user.dailyAiDate ||
      new Date(user.dailyAiDate).toDateString() !== today
    ) {
      user.dailyAiCount = 0;
      user.dailyAiDate = new Date();
      await user.save();
    }

    const DAILY_LIMIT = 20;

    if (user.dailyAiCount >= DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message:
          "Daily AI limit reached. Please try again tomorrow.",
      });
    }

    // Save user message
    await AIMessage.create({
      userId,
      role: "user",
      content: message.trim(),
      conversationId,
    });

    // Get conversation history
    const previousMessages = await AIMessage.find({
      userId,
      conversationId,
    })
      .sort({ createdAt: 1 })
      .limit(20);

    const formattedMessages = [
      {
        role: "system",
        content: `
You are Namaste AI.

Rules:
1. Answer only what the user asks.
2. Do not suggest extra tasks, features, improvements, or related topics unless explicitly requested.
3. For greetings like Hi, Hello, Namaste, respond with a simple greeting and ask how you can help.
4. Keep responses concise and relevant.
5. Do not assume the user's intent.
6. If information is missing, ask a clarification question.
7. Avoid long introductions and conclusions.
8. Provide code, examples, or step-by-step explanations only when requested.

Response Format:

Answer:
<direct answer>

Need More Information:
<only if required>
        `,
      },

      ...previousMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    // Generate AI response
    const aiReply =
      await generateAIResponse(formattedMessages);

    // Increment daily usage count
    user.dailyAiCount += 1;
    await user.save();

    // Save AI response
    const savedAIMessage = await AIMessage.create({
      userId,
      role: "assistant",
      content: aiReply,
      conversationId,
    });

    return res.status(200).json({
      success: true,
      reply: aiReply,
      message: savedAIMessage,
      remainingRequests:
        DAILY_LIMIT - user.dailyAiCount,
    });
  } catch (error) {
    console.error("AI CONTROLLER ERROR:", error);

    if (
      error.message?.includes("429") ||
      error.message?.toLowerCase().includes("quota")
    ) {
      return res.status(429).json({
        success: false,
        message:
          "AI service is temporarily unavailable due to quota limits. Please try again later.",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI request failed",
      error: error.message,
    });
  }
};

/* =========================
GET AI CONVERSATION
========================= */

export const getAIConversation =
async (req, res) => {
try {
const {
conversationId,
} = req.params;

  const userId =
    req.user._id;

  const messages =
    await AIMessage.find({
      userId,
      conversationId,
    }).sort({
      createdAt: 1,
    });

  return res.status(200).json({
    success: true,
    messages,
  });
} catch (error) {
  console.error(
    "GET AI CHAT ERROR:",
    error
  );

  return res.status(500).json({
    success: false,
    message:
      "Failed to fetch AI conversation",
  });
}

};

/* =========================
DELETE AI CONVERSATION
========================= */

export const deleteAIConversation =
async (req, res) => {
try {
const {
conversationId,
} = req.params;

  const userId =
    req.user._id;

  await AIMessage.deleteMany({
    userId,
    conversationId,
  });

  return res.status(200).json({
    success: true,
    message:
      "AI conversation deleted successfully",
  });
} catch (error) {
  console.error(
    "DELETE AI CHAT ERROR:",
    error
  );

  return res.status(500).json({
    success: false,
    message:
      "Failed to delete AI conversation",
  });
}

};