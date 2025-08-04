import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RoleSelector from "./pages/RoleSelector";
import AdminPanel from "./components/AdminPanel";
import TeachersLogin from "./pages/TeachersLogin";
import StudentsLogin from "./pages/StudentsLogin";
import StudentPanel from "./components1/StudentPanel";
import GuestPanel from "./pages/guest/GuestPanel"; // ✅ Updated import

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Landing */}
          <Route path="/" element={<RoleSelector />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Teacher */}
          <Route path="/teacher" element={<TeachersLogin />} />

          {/* Student Login */}
          <Route path="/student" element={<StudentsLogin />} />

          {/* Student Panel with nested routes */}
          <Route path="/student/panel/:enrollmentNumber/*" element={<StudentPanel />} />

          {/* Guest Panel with nested routes */}
          <Route path="/guest/*" element={<GuestPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
