import { generateQuiz } from "../utils/gemini.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// GET QUIZ based on topic and number of questions
export const getQuiz = async (req, res) => {
  const { topic, number } = req.body;

  if (!req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const questionsRaw = await generateQuiz(topic, number);
    res.json({ questions: questionsRaw });
  } catch (err) {
    console.error("Quiz generation error:", err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
};

// SUBMIT QUIZ

export const submitQuiz = async (req, res) => {
  const { questionsWithUserAnswers } = req.body;

  if (!req.userId) {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

    const prompt = `
Evaluate the user's answers for the following MCQ quiz. Count how many are correct and how many are wrong. Then give a final score out of ${questionsWithUserAnswers.length}. After that, for each question, mention:
- The question
- What user answered
- What was the correct answer
- Whether it was correct or not

Respond in detailed markdown format:

### 📝 Quiz Evaluation Result
- ✅ Correct: X
- ❌ Wrong: Y
- 🧠 Score: X/Y

Then list:
### 📋 Question-wise Feedback
1. **Question**: ...
   - 🧑‍🎓 Your Answer: ...
   - ✅ Correct Answer: ...
   - 📊 Result: Correct ❎ / ✅

Here is the quiz data:
${JSON.stringify(questionsWithUserAnswers)}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ evaluation: text });
  } catch (err) {
    console.error("Quiz submission error:", err);
    res.status(500).json({ error: "Quiz evaluation failed" });
  }
};

