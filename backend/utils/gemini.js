import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
configDotenv();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateQuiz = async (topic, number) => {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  const prompt = `Generate ${number} multiple choice questions on the topic "${topic}". Each question should have 4 options and mention the correct answer clearly. Format it as pure JSON like this:
  [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "..."
    }
  ]`;

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