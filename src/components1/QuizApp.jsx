// src/components1/QuizApp.jsx
import React from "react";
import { useParams } from "react-router-dom";

const QuizApp = () => {
  const { enrollmentNumber } = useParams();

  const baseURL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5173"
      : "https://quizz-18o9.vercel.app";

  // ✅ go to dashboard (not just /quiz)
  const quizURL = `${baseURL}/dashboard?enrollment=${enrollmentNumber}`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-green-600 mb-4">📝 Aptitude Quiz</h2>
      <a
        href={quizURL}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-300"
      >
        Go to Dashboard
      </a>
    </div>
  );
};

export default QuizApp;
