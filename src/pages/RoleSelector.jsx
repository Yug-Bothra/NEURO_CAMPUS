import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, BookOpen, GraduationCap, Eye } from "lucide-react";

const RoleSelector = () => {
  const navigate = useNavigate();

  const colorMap = {
    Admin: "bg-blue-600 hover:bg-blue-700",
    Teacher: "bg-green-600 hover:bg-green-700",
    Student: "bg-purple-600 hover:bg-purple-700",
    "Guest / Visitor": "bg-gray-600 hover:bg-gray-700",
  };

  const roles = [
    { label: "Admin", path: "/admin", icon: <Shield className="mr-2" /> },
    { label: "Teacher", path: "/teacher", icon: <BookOpen className="mr-2" /> },
    { label: "Student", path: "/student", icon: <GraduationCap className="mr-2" /> },
    { label: "Guest / Visitor", path: "/guest", icon: <Eye className="mr-2" /> },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to SVVV Portal
        </h1>
        <p className="text-gray-600 mb-8 text-sm">
          Please select your role to continue
        </p>

        <div className="grid gap-4">
          {roles.map((role) => (
            <button
              key={role.label}
              onClick={() => navigate(role.path)}
              className={`flex items-center justify-center w-full ${colorMap[role.label]} text-white py-3 rounded-lg shadow transition`}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
