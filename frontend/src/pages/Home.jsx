import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../context/Authcontext";

const Home = () => {
    const [topic, setTopic] = useState("");
    const [number, setNumber] = useState(5);

    const navigate = useNavigate();
    const { serverUrl } = useContext(authDataContext)

    const startQuiz = async () => {
        try {
            const res = await axios.post(
                serverUrl + "/api/quiz/generate",
                { topic, number },
                { withCredentials: true }
            );
            localStorage.setItem("questions", JSON.stringify(res.data.questions));
            navigate("/quiz");
        } catch (error) {
            console.log(error)
            alert("Failed to start quiz!");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white shadow-md rounded-2xl p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center">Start Your Quiz</h1>

                <input
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="text"
                    placeholder="Enter Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />

                <input
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    type="number"
                    min={1}
                    max={20}
                    placeholder="Number of Questions"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                />

                <button
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    onClick={startQuiz}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default Home;

