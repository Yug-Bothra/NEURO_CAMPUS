// src/pages/StudentsLogin.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const StudentsLogin = () => {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState("");
  const [step, setStep] = useState("login"); // login | reset
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle login attempt
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("student_auth")
        .select("*")
        .eq("enrollment_number", enrollment.trim())
        .single();

      if (error || !data) {
        setError("Invalid enrollment number or password.");
        return;
      }

      if (data.password !== password.trim()) {
        setError("Incorrect password.");
        return;
      }

      setLoginData(data);

      if (data.must_reset) {
        setStep("reset"); // force reset
      } else {
        // Save session & redirect
        sessionStorage.setItem("student", JSON.stringify(data));
        navigate(`/student/panel/${enrollment.trim()}`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("student_auth")
        .update({ password: newPassword.trim(), must_reset: false })
        .eq("enrollment_number", loginData.enrollment_number);

      if (error) {
        setError("Failed to reset password. Try again.");
      } else {
        sessionStorage.setItem("student", JSON.stringify({ 
          ...loginData, password: newPassword.trim(), must_reset: false 
        }));
        navigate(`/student/panel/${loginData.enrollment_number}`);
      }
    } catch (err) {
      setError("Something went wrong during reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Student Login
        </h1>

        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Enrollment Number"
              value={enrollment}
              onChange={(e) => setEnrollment(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-gray-700 text-center">
              You must reset your password before continuing.
            </p>
            <input
              type="password"
              placeholder="New Password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-green-300 rounded focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default StudentsLogin;
