// src/components1/StudentProfile.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

const StudentProfile = ({ enrollmentNumber }) => {
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState({
    attendance: "N/A",
    gpa: "N/A",
    feesStatus: "Unpaid",
    borrowedBooks: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch student details
  const fetchStudent = async () => {
    setLoading(true);

    try {
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("enrollment_number", enrollmentNumber)
        .single();

      if (studentError) throw studentError;
      setStudent(studentData);

      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("percentage")
        .eq("enrollment_number", enrollmentNumber)
        .single();

      const { data: gpaData } = await supabase
        .from("evaluations")
        .select("gpa")
        .eq("enrollment_number", enrollmentNumber)
        .single();

      const { count: borrowedBooks } = await supabase
        .from("library_records")
        .select("*", { count: "exact", head: true })
        .eq("enrollment_number", enrollmentNumber);

      setStats({
        attendance: attendanceData?.percentage || "N/A",
        gpa: gpaData?.gpa || "N/A",
        feesStatus:
          studentData.fees && studentData.fees > 0
            ? `₹${studentData.fees} / Paid`
            : "Unpaid",
        borrowedBooks: borrowedBooks || 0,
      });
    } catch (error) {
      console.error("Error loading profile:", error.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (enrollmentNumber) fetchStudent();
  }, [enrollmentNumber]);

  if (loading) return <p className="text-center text-lg">Loading Profile...</p>;
  if (!student) return <p className="text-center text-lg">No profile found for enrollment: {enrollmentNumber}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-6 flex items-center space-x-6">
        <img
          src={`https://ui-avatars.com/api/?name=${student.name}&background=0D8ABC&color=fff`}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-white shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold">{student.name}</h2>
          <p className="text-lg">Enrollment: {student.enrollment_number}</p>
          <p className="text-sm text-blue-100">
            {student.branch} | Semester {student.semester} | Section {student.section}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white p-4 rounded-xl shadow text-center border-t-4 border-blue-500 transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">Attendance</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.attendance !== "N/A" ? `${stats.attendance}%` : "N/A"}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border-t-4 border-green-500 transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">GPA</h3>
          <p className="text-2xl font-bold text-green-600">{stats.gpa}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border-t-4 border-yellow-500 transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">Fees</h3>
          <p
            className={`text-2xl font-bold ${
              stats.feesStatus.includes("Paid") ? "text-green-600" : "text-red-600"
            }`}
          >
            {stats.feesStatus}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow text-center border-t-4 border-purple-500 transition-transform transform hover:scale-105">
          <h3 className="text-lg font-semibold text-gray-600">Books</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.borrowedBooks} Borrowed
          </p>
        </div>
      </div>

      {/* Linked Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link
          to={`/student/panel/${enrollmentNumber}/attendance`}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg p-6 text-center transition transform hover:scale-105"
        >
          <h3 className="text-xl font-bold">📅 Attendance</h3>
          <p>View your attendance records</p>
        </Link>

        <Link
          to={`/student/panel/${enrollmentNumber}/canteen`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-lg p-6 text-center transition transform hover:scale-105"
        >
          <h3 className="text-xl font-bold">🍔 E-Canteen</h3>
          <p>Order food online</p>
        </Link>

        <Link
          to={`/student/panel/${enrollmentNumber}/library`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl shadow-lg p-6 text-center transition transform hover:scale-105"
        >
          <h3 className="text-xl font-bold">📚 E-Library</h3>
          <p>Access your digital library</p>
        </Link>

        <Link
          to={`/student/panel/${enrollmentNumber}/resume`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl shadow-lg p-6 text-center transition transform hover:scale-105"
        >
          <h3 className="text-xl font-bold">📄 Resume Builder</h3>
          <p>Create your ATS-ready resume</p>
        </Link>

        <Link
          to={`/student/panel/${enrollmentNumber}/accounts`}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg p-6 text-center transition transform hover:scale-105"
        >
          <h3 className="text-xl font-bold">💳 Accounts</h3>
          <p>Pay fees and view history</p>
        </Link>
      </div>
    </div>
  );
};

export default StudentProfile;
