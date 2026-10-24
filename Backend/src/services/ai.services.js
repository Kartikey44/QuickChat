import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenAI({
  apiKey: API_KEY,
});

/* =========================================
   NAMASTE AI SYSTEM INSTRUCTION
========================================= */

const SYSTEM_INSTRUCTION = `
You are Namaste AI, a friendly, intelligent, and helpful AI assistant.

CORE RULES:
- Answer the user's current question directly.
- Focus on the current request and relevant context.
- Be accurate, clear, concise, and practical.
- Do not introduce unrelated topics.
- Never invent facts, sources, or capabilities.
- Avoid unnecessary repetition.

FORMATTING RULES:
- Always use clean, readable Markdown when formatting is useful.
- Never return the entire answer as one long paragraph.
- Separate distinct ideas with blank lines.
- Use headings to organize long answers into sections.
- Use paragraphs for explanations.
- Use bullet points for related facts, features, or examples.
- Use numbered lists for steps, procedures, and sequences.
- Indent nested list items consistently by two spaces.
- Put important terms in **bold** when useful.
- Use Markdown tables for structured comparisons.
- Use fenced code blocks with the appropriate language for code.
- Keep headings, paragraphs, and lists on separate lines.
- Do not use excessive headings or unnecessary bullet points.
- Do not use HTML tags for formatting.
- Do not wrap the entire answer in a code block.
- Do not use multiple spaces as a substitute for Markdown indentation.

RESPONSE STRUCTURE:
1. For simple questions, answer directly in a short paragraph.
2. For explanations, use a short introduction followed by organized sections.
3. For essays, use a title, clear section headings, and well-organized content.
4. For step-by-step instructions, use a numbered list.
5. For advantages, disadvantages, features, or examples, use bullet points.
6. For programming questions, provide working code and explain the important parts.
7. For long answers, end with a brief conclusion when appropriate.

LIST FORMATTING:
- Put each bullet point on a separate line.
- Keep each bullet focused on one main idea.
- Use nested bullets only when supporting details are necessary.
- Leave a blank line before and after a list when appropriate.

Your goal is to make every response easy to scan, understand, and read on both mobile and desktop screens.
`;

/* =========================================
   GENERATION CONFIGURATION
========================================= */

const GENERATION_CONFIG = {
  systemInstruction: SYSTEM_INSTRUCTION,
  temperature: 0.4,
  maxOutputTokens: 2048,
};

/* =========================================
   GENERATE AI RESPONSE
========================================= */

export const generateAIResponse = async (prompt) => {
  if (typeof prompt !== "string" || !prompt.trim()) {
    return "Namaste! 🙏 How can I help you today?";
  }

  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: prompt.trim(),
      config: GENERATION_CONFIG,
    });

    const answer = response.text?.trim();

    if (!answer) {
      throw new Error("Gemini returned an empty response.");
    }

    // Preserve Markdown for rendering in the frontend.
    return answer;
  } catch (error) {
    console.error("Gemini API error:", {
      message: error.message,
      status: error.status,
      model: MODEL_NAME,
    });

    throw error;
  }
};

/* =========================================
   TEST GEMINI CONNECTION
========================================= */

export const testConnection = async () => {
  try {
    const response = await genAI.models.generateContent({
      model: MODEL_NAME,
      contents: "Reply with exactly: Gemini is working.",
      config: {
        maxOutputTokens: 30,
      },
    });

    return {
      success: Boolean(response.text?.trim()),
      model: MODEL_NAME,
      response: response.text?.trim() || "",
    };
  } catch (error) {
    console.error("Gemini connection test failed:", error.message);

    return {
      success: false,
      model: MODEL_NAME,
      error: error.message,
      status: error.status ?? null,
    };
  }
};
