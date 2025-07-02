import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // ✅ import markdown parser

const Result = () => {
  const [result, setResult] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const r = localStorage.getItem("result");
    if (!r) navigate("/");
    else setResult(r);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Quiz Evaluation</h1>

        {/* ✅ Render markdown with styles */}
        <div className="prose prose-sm max-w-none text-gray-800">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Result;