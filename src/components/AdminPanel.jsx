// src/components/AdminPanel.jsx
import React, { useState } from "react";
import TeachersTable from "./TeachersTable";
import StudentsTable from "./StudentsTable";
import SubjectsTable from "./SubjectsTable";
import TeacherSubjectsTable from "./TeacherSubjectsTable";
import AccountsAndPaymentsPanel from "./AccountsAndPaymentsPanel";
import { Users, GraduationCap, BookOpen, ClipboardList, DollarSign } from "lucide-react";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/clerk-react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("teachers");

  const tabs = [
    { key: "teachers", label: "Teachers", icon: Users },
    { key: "students", label: "Students", icon: GraduationCap },
    { key: "subjects", label: "Subjects", icon: BookOpen },
    { key: "teacher_subjects", label: "Teacher Subjects", icon: ClipboardList },
    { key: "accounts", label: "Accounts", icon: DollarSign },
  ];

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Blobs */}
      <div className="absolute top-20 -left-32 w-[32rem] h-[32rem] bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 -right-40 w-[36rem] h-[36rem] bg-purple-200/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-100/40 rounded-full blur-2xl animate-bounce animation-delay-4000"></div>

      {/* Clerk Sign-In */}
      <SignedOut>
        <div className="flex items-center justify-center w-full relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl transform -rotate-3 opacity-20"></div>

            <div className="relative bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/20 max-w-md">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  Admin Portal
                </h2>
                <p className="text-slate-600">Secure access to administrative dashboard</p>
              </div>
              <SignIn routing="hash" />
            </div>
          </div>
        </div>
      </SignedOut>

      {/* Main Dashboard */}
      <SignedIn>
        <aside className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20 fixed h-screen z-10">
          <div className="p-8 border-b border-slate-200/50">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-slate-500 text-sm mt-1">Management Dashboard</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl opacity-20"></div>
                <div className="relative bg-white rounded-xl p-2 shadow-lg">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </div>

          <nav className="mt-8 px-4">
            <div className="space-y-2">
              {tabs.map(({ key, label, icon: Icon }, index) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center w-full px-6 py-4 text-left font-semibold transition-all duration-300 rounded-2xl group relative overflow-hidden ${
                    activeTab === key
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl transform scale-105"
                      : "text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-lg hover:transform hover:scale-102"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform transition-transform duration-300 ${
                    activeTab === key ? "translate-x-0" : "translate-x-full"
                  }`}></div>

                  <div className="relative flex items-center">
                    <div className={`p-2 rounded-xl mr-4 transition-all duration-300 ${
                      activeTab === key
                        ? "bg-white/20"
                        : "bg-slate-100 group-hover:bg-blue-100"
                    }`}>
                      <Icon className={`h-5 w-5 transition-colors duration-300 ${
                        activeTab === key ? "text-white" : "text-slate-600 group-hover:text-blue-600"
                      }`} />
                    </div>
                    <span className="text-base relative z-10">{label}</span>
                  </div>

                  {activeTab === key && (
                    <div className="absolute right-4 w-2 h-2 bg-white rounded-full z-10"></div>
                  )}
                </button>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-8 left-4 right-4">
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">System Status</h3>
              </div>
              <p className="text-sm text-slate-600">All systems operational</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8 ml-72 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>Dashboard</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-blue-600 font-medium">
                  {tabs.find((tab) => tab.key === activeTab)?.label}
                </span>
              </div>
              <h2 className="text-4xl font-bold text-slate-800">
                {tabs.find((tab) => tab.key === activeTab)?.label} Management
              </h2>
            </div>

            <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <div className="p-8">
                  {activeTab === "teachers" && <TeachersTable />}
                  {activeTab === "students" && <StudentsTable />}
                  {activeTab === "subjects" && <SubjectsTable />}
                  {activeTab === "teacher_subjects" && <TeacherSubjectsTable />}
                  {activeTab === "accounts" && <AccountsAndPaymentsPanel />}
                </div>
              </div>
            </div>
          </div>
        </main>
      </SignedIn>

      {/* Custom animation delays */}
      <style>
        {`
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  );
};

export default AdminPanel;
