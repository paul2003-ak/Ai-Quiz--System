import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
configDotenv();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuiz = async (topic, number) => {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const prompt = `You are a professional quiz maker. Generate ${number} high-quality, unique multiple-choice questions on the topic "${topic}". Each question must:

1. Be strictly related to the topic.
2. Include 4 options.
3. Have only one correct answer.
4. Clearly mention the correct answer.

Format your output strictly in this JSON format:

[
  {
    "question": "What is ...?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A"
  }
]
Only return the JSON array, no explanations or markdown.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text.replace(/```json|```/g, "").trim();

  try {
    const questions = JSON.parse(cleaned);
    return questions;
  } catch (err) {
    console.error("JSON parsing error:", err);
    throw new Error("Failed to parse Gemini response as JSON");
  }
};
