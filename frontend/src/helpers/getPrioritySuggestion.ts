import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyAUcpO6QrUkR6bL6Ww8VhLaFh6IgobLrbE";
const MODEL_NAME = "gemini-2.0-pro";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getPrioritySuggestion(taskTitle: string): Promise<"low" | "medium" | "critical"> {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
You are a task management AI assistant.
Classify the following task title into exactly one of the following: low, medium, critical.
Respond only with the word: low, medium, or critical.

Task title: "${taskTitle}"
`;

    // ✅ Correct call by passing string directly (simpler and safe for SDK)
    const result = await model.generateContent(prompt);

    const text = result.response.text().toLowerCase().trim();

    if (["low", "medium", "critical"].includes(text)) {
      return text as "low" | "medium" | "critical";
    } else {
      console.warn("Gemini unclear response, fallback to 'low'");
      return "low";
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    return "low";
  }
}
