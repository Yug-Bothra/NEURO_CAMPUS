// src/components1/StudentPanel.jsx
import React from "react";
import { Routes, Route, Link, useParams, Navigate } from "react-router-dom";

import StudentProfile from "./StudentProfile";
import Attendance from "./Attendance";
import Accounts from "./Accounts";
import CanteenLink from "./CanteenLink";
import LibraryLink from "./LibraryLink";
import ResumeBuilderLink from "./ResumeBuilderLink";
import QuizApp from "./QuizApp"; // Import your quiz app component

const StudentPanel = () => {
  const { enrollmentNumber } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎓 Student Panel</h1>
          <div className="space-x-4">
            <Link
              to={`/student/panel/${enrollmentNumber}/attendance`}
              className="hover:underline"
            >
              Attendance
            </Link>
            <Link
              to={`/student/panel/${enrollmentNumber}/canteen`}
              className="hover:underline"
            >
              E-Canteen
            </Link>
            <Link
              to={`/student/panel/${enrollmentNumber}/library`}
              className="hover:underline"
            >
              E-Library
            </Link>
            <Link
              to={`/student/panel/${enrollmentNumber}/resume`}
              className="hover:underline"
            >
              Resume Builder
            </Link>
            <Link
              to={`/student/panel/${enrollmentNumber}/accounts`}
              className="hover:underline"
            >
              Accounts
            </Link>
            {/* New Aptitude Quiz Button */}
            <Link
              to={`/student/panel/${enrollmentNumber}/aptitude`}
              className="hover:underline"
            >
              Aptitude
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Redirect to profile if no sub-route */}
          <Route index element={<Navigate to="profile" replace />} />

          <Route
            path="profile"
            element={<StudentProfile enrollmentNumber={enrollmentNumber} />}
          />
          <Route
            path="attendance"
            element={<Attendance enrollmentNumber={enrollmentNumber} />}
          />
          <Route path="canteen" element={<CanteenLink />} />
          <Route path="library" element={<LibraryLink />} />
          <Route path="resume" element={<ResumeBuilderLink />} />
          <Route
            path="accounts"
            element={<Accounts enrollmentNumber={enrollmentNumber} />}
          />
          {/* New Route for QuizApp */}
          <Route path="aptitude" element={<QuizApp />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentPanel;
