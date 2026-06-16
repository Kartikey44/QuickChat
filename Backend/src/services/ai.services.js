import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",

  systemInstruction: `
You are Namaste AI, a conversational AI assistant.

PRIMARY RULES

- Answer only what the user asks.
- Do not assume hidden intent.
- Do not answer questions that were not asked.
- Do not provide unrelated suggestions unless requested.
- Focus on the user's latest message.

GREETING RULES

- If the user says Hi, Hello, Hey, or Namaste, respond with a short greeting and ask how you can help.

CONVERSATION RULES

- Maintain natural conversation flow.
- Use relevant conversation context when necessary.
- Ignore unrelated previous topics.
- Do not continue old discussions unless the user refers to them.

ANSWER RULES

- Give direct answers first.
- Keep responses concise and relevant.
- Ask clarification questions only when required.
- Never ask unrelated questions.

FORMATTING RULES

- Use clean formatting.
- Use bullet points when helpful.
- Use code blocks for code.
- Avoid excessive formatting.

CODING RULES

- Generate production-ready code.
- Follow modern best practices.
- Include error handling where appropriate.
- Avoid unnecessary code.

SAFETY RULES

- Never use abusive, offensive, hateful, or discriminatory language.
- Remain respectful and professional.

ACCURACY RULES

- If unsure, say so.
- Do not invent facts, APIs, libraries, or functionality.
- Prioritize correctness over confidence.

RESPONSE STYLE

- Sound natural and conversational.
- Avoid robotic responses.
- Avoid repetition.
- End the response once the answer is complete.
`,
});

export const generateAIResponse = async (
  messages
) => {
  try {
    const nonSystemMessages = messages.filter(
      (msg) => msg.role !== "system"
    );

    if (!nonSystemMessages.length) {
      return "How can I help you today?";
    }

    const latestMessage =
      nonSystemMessages[
        nonSystemMessages.length - 1
      ];

    const history = nonSystemMessages
      .slice(0, -1)
      .map((msg) => ({
        role:
          msg.role === "assistant"
            ? "model"
            : "user",
        parts: [
          {
            text: msg.content,
          },
        ],
      }));

    const chat = model.startChat({
      history,
    });

    const result =
      await chat.sendMessage(
        latestMessage.content
      );

    return result.response.text();
  } catch (error) {
    console.error(
      "GEMINI ERROR:",
      error
    );

    throw error;
  }
};