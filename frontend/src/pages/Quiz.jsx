import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/Authcontext";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);

  useEffect(() => {
    const data = localStorage.getItem("questions");
    if (data) {
      const parsed = JSON.parse(data);
      setQuestions(parsed);

      // ✅ Set timer dynamically: e.g., 30 sec per question
      const secondsPerQ = 30;
      setTimeLeft(parsed.length * secondsPerQ);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!submitted) handleSubmit(); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const handleOptionClick = (option) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = {
      ...questions[currentIndex],
      userAnswer: option,
    };
    setAnswers(updatedAnswers);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
  };

  const prev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      const res = await axios.post(
        serverUrl + "/api/quiz/submit",
        { questionsWithUserAnswers: answers },
        { withCredentials: true }
      );

      // ✅ Save result as JSON string (IMPORTANT)
      localStorage.setItem("result", JSON.stringify(res.data.evaluation));
      navigate("/result");
    } catch (err) {
      console.log(err);
      alert("Submission failed");
    }
  };

  if (questions.length === 0) return null;

  const current = questions[currentIndex];
  const selected = answers[currentIndex]?.userAnswer;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-6">
      <div className="text-xl font-bold mb-4 text-red-600">
        Time Left: {timeLeft}s
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-xl w-full space-y-4">
        <h2 className="text-lg font-semibold">
          Q{currentIndex + 1}: {current.question}
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {current.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`text-left border p-2 rounded-xl transition-all duration-200 hover:bg-blue-100 ${
                selected === option
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between pt-4">
          <button
            onClick={prev}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
          >
            Previous
          </button>
          <button
            onClick={next}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;