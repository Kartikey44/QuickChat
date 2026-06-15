import AIMessage from "../models/ai.model.js";
import { generateAIResponse } from "../services/ai.services.js";
import { getOrCreateConversationId } from "../utils/conversation.helper.js";

export const chatWithAI = async (
req,
res,
) => {
try {
const {
message,
conversationId,
} = req.body;

const userId = req.user._id;

if (!message?.trim()) {
  return res.status(400).json({
    success: false,
    message:
      "Message is required",
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
const previousMessages =
  await AIMessage.find({
    userId,
    conversationId,
  })
    .sort({
      createdAt: 1,
    })
    .limit(20);

const formattedMessages = [
  {
    role: "system",
    content:
      "You are Namaste AI, a helpful and intelligent assistant.",
  },

  ...previousMessages.map(
    (msg) => ({
      role: msg.role,
      content: msg.content,
    }),
  ),
];

// Generate response
const aiReply =
  await generateAIResponse(
    formattedMessages,
  );

// Save AI response
const savedAIMessage =
  await AIMessage.create({
    userId,
    role: "assistant",
    content: aiReply,
    conversationId,
  });

return res.status(200).json({
  success: true,
  reply: aiReply,
  message: savedAIMessage,
});

} catch (error) {
console.error(
"AI CONTROLLER ERROR:",
error
);

// Gemini quota exceeded
if (
  error.message?.includes(
    "429"
  ) ||
  error.message?.includes(
    "quota"
  )
) {
  return res.status(429).json({
    success: false,
    message:
      "AI quota exceeded. Please wait about a minute and try again.",
    error:
      error.message,
  });
}

return res.status(500).json({
  success: false,
  message:
    "AI request failed",
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