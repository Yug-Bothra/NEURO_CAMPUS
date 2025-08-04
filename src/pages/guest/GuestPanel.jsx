// src/pages/guest/GuestPanel.jsx
import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import AboutUniversity from "./AboutUniversity";
import EVisit from "./EVisit";
import CanteenLink from "./CanteenLink";
import GuestPage from "./GuestPage";

const GuestPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-center space-x-8">
        <NavLink
          to="/guest/about-university"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          About University
        </NavLink>
        <NavLink
          to="/guest/e-visit"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          E-Visit
        </NavLink>
        <NavLink
          to="/guest/e-canteen"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          E-Canteen
        </NavLink>
        <NavLink
          to="/guest/register"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          Register
        </NavLink>
      </nav>

      {/* Routes */}
      <main className="p-6">
        <Routes>
          <Route path="/" element={<AboutUniversity />} />
          <Route path="/about-university" element={<AboutUniversity />} />
          <Route path="/e-visit" element={<EVisit />} />
          <Route path="/e-canteen" element={<CanteenLink />} />
          <Route path="/register" element={<GuestPage />} />
          <Route path="*" element={<AboutUniversity />} />
        </Routes>
      </main>
    </div>
  );
};

export default GuestPanel;
