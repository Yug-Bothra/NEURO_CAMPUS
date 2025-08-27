// src/components1/QuizApp.jsx
import React from "react";
import { useParams } from "react-router-dom";

const QuizApp = () => {
  const { enrollmentNumber } = useParams(); // Get enrollment number from route

  // Decide base URL based on environment
  const baseURL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5173"
      : "https://quizz-18o9.vercel.app";

  // Final quiz URL with enrollment param
  const quizURL = `${baseURL}/?enrollment=${enrollmentNumber}`;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-green-600 mb-4">📝 Aptitude Quiz</h2>
      <a
        href={quizURL}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-300"
      >
        Take the Quiz
      </a>
    </div>
  );
};

export default QuizApp;
