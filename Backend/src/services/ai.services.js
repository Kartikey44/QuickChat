import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY,
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateAIResponse = async (
  messages,
) => {
  try {
    const formattedPrompt =
      messages
        .map(
          (msg) =>
            `${msg.role}: ${msg.content}`
        )
        .join("\n");

    console.log(
      "PROMPT:",
      formattedPrompt
    );

    const result =
      await model.generateContent(
        formattedPrompt
      );

    console.log(result);

    return result.response.text();
  } catch (error) {
    console.error(
      "GEMINI ERROR:"
    );

    console.error(error);

    console.error(
      error.message
    );

    throw error;
  }
};