// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import RoleSelector from "./pages/RoleSelector";
import AdminPanel from "./components/AdminPanel";

import TeachersLogin from "./pages/TeachersLogin";
import AccountLogin from "./pages/AccountLogin";   // ✅ NEW
import StudentsLogin from "./pages/StudentsLogin";

import StudentPanel from "./components1/StudentPanel";
import GuestPanel from "./pages/guest/GuestPanel"; // Updated import

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing */}
          <Route path="/" element={<RoleSelector />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Teacher (redirect page) */}
          <Route path="/teacher" element={<TeachersLogin />} />

          {/* Account Login (redirect page) */}
          <Route path="/account-login" element={<AccountLogin />} />   {/* ✅ ADDED */}

          {/* Student Login */}
          <Route path="/student" element={<StudentsLogin />} />

          {/* Student Panel (nested) */}
          <Route path="/student/panel/:enrollmentNumber/*" element={<StudentPanel />} />

          {/* Guest Panel (nested) */}
          <Route path="/guest/*" element={<GuestPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
