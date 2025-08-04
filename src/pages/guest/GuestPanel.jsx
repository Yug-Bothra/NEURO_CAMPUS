// src/pages/guest/GuestPanel.jsx
import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import CanteenLink from "./CanteenLink";
import EVisit from "./EVisit";
import AboutUniversity from "./AboutUniversity";
import GuestPage from "./GuestPage";

const GuestPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-center space-x-8">
        <NavLink
          to="about-university"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          About University
        </NavLink>
        <NavLink
          to="e-visit"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          E-Visit
        </NavLink>
        <NavLink
          to="e-canteen"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          E-Canteen
        </NavLink>
        <NavLink
          to="register"
          className={({ isActive }) =>
            isActive
              ? "text-blue-700 font-bold underline"
              : "text-gray-700 hover:text-blue-700 transition"
          }
        >
          Register
        </NavLink>
      </nav>

      {/* Content Area */}
      <main className="p-6">
        <Routes>
          <Route index element={<AboutUniversity />} />
          <Route path="about-university" element={<AboutUniversity />} />
          <Route path="e-visit" element={<EVisit />} />
          <Route path="e-canteen" element={<CanteenLink />} />
          <Route path="register" element={<GuestPage />} />
          <Route path="*" element={<AboutUniversity />} />
        </Routes>
      </main>
    </div>
  );
};

export default GuestPanel;
