import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY,
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",

  systemInstruction: `
You are Namaste AI.

Rules:
- Answer the user's current question directly.
- Focus on the latest message only.
- Do not continue unrelated previous topics.
- Be accurate, concise, and helpful.
- Use code blocks for code.
- For programming questions, provide practical examples.
- If information is missing, ask a short clarification question.
- Do not repeat previous answers.
`,
});

export const generateAIResponse = async (
  prompt,
) => {
  try {
    if (!prompt?.trim()) {
      return "How can I help you today?";
    }

    const result = await model.generateContent(
      prompt.trim(),
    );

    return result.response.text();
  } catch (error) {
    console.error(
      "GEMINI ERROR:",
      error,
    );

    throw error;
  }
};