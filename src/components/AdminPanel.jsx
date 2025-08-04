// src/components/AdminPanel.jsx
import React, { useState } from "react";
import TeachersTable from "./TeachersTable";
import StudentsTable from "./StudentsTable";
import SubjectsTable from "./SubjectsTable";
import TeacherSubjectsTable from "./TeacherSubjectsTable";
import AccountsAndPaymentsPanel from "./AccountsAndPaymentsPanel"; // ✅ updated import
import { Users, GraduationCap, BookOpen, ClipboardList, DollarSign } from "lucide-react";

// Clerk imports
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("teachers");

  const tabs = [
    { key: "teachers", label: "Teachers", icon: Users },
    { key: "students", label: "Students", icon: GraduationCap },
    { key: "subjects", label: "Subjects", icon: BookOpen },
    { key: "teacher_subjects", label: "Teacher Subjects", icon: ClipboardList },
    { key: "accounts", label: "Accounts", icon: DollarSign }, // ✅ tab remains the same
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* If not signed in, show login */}
      <SignedOut>
        <div className="flex items-center justify-center w-full">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-4">
              Admin Login
            </h2>
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>

      {/* If signed in, show admin panel */}
      <SignedIn>
        <aside className="w-64 bg-white shadow-md">
          <div className="p-6 border-b flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">Admin Panel</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
          <nav className="mt-6">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center w-full px-5 py-3 text-left text-gray-700 font-medium transition-colors ${
                  activeTab === key
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            {activeTab === "teachers" && <TeachersTable />}
            {activeTab === "students" && <StudentsTable />}
            {activeTab === "subjects" && <SubjectsTable />}
            {activeTab === "teacher_subjects" && <TeacherSubjectsTable />}
            {activeTab === "accounts" && <AccountsAndPaymentsPanel />} {/* ✅ updated section */}
          </div>
        </main>
      </SignedIn>
    </div>
  );
};

export default AdminPanel;
