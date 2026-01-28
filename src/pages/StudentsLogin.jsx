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

      if (data.must_reset) setStep("reset");
      else {
        sessionStorage.setItem("student", JSON.stringify(data));
        navigate(`/student/panel/${enrollment.trim()}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      if (error) setError("Failed to reset password. Try again.");
      else {
        sessionStorage.setItem(
          "student",
          JSON.stringify({
            ...loginData,
            password: newPassword.trim(),
            must_reset: false,
          })
        );
        navigate(`/student/panel/${loginData.enrollment_number}`);
      }
    } catch {
      setError("Something went wrong during reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-cyan-200 to-pink-200 overflow-hidden px-4">

      {/* Castle-like campus silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-56 bg-gradient-to-t from-gray-300/40 to-transparent">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" fill="none">
          <rect x="50" y="70" width="100" height="130" fill="rgba(100,100,120,0.3)" />
          <rect x="180" y="50" width="80" height="150" fill="rgba(110,110,130,0.3)" />
          <rect x="280" y="80" width="60" height="120" fill="rgba(120,100,120,0.3)" />
          <rect x="370" y="60" width="90" height="140" fill="rgba(100,110,120,0.25)" />
          <rect x="480" y="90" width="50" height="110" fill="rgba(120,120,140,0.2)" />

          <polygon points="50,70 100,30 150,70" fill="rgba(90,90,110,0.3)" />
          <polygon points="180,50 220,15 260,50" fill="rgba(80,80,100,0.3)" />
          <polygon points="280,80 310,50 340,80" fill="rgba(90,90,110,0.3)" />
          <polygon points="370,60 415,20 460,60" fill="rgba(100,100,120,0.25)" />
          <polygon points="480,90 505,60 530,90" fill="rgba(110,110,130,0.2)" />
        </svg>
      </div>

      {/* Animated blobs */}
      <div className="absolute top-0 left-1/5 w-[450px] h-[450px] bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/4 right-1/5 w-[350px] h-[350px] bg-gradient-to-br from-pink-300/30 to-yellow-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-green-200/20 to-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>

      {/* Floating academic elements */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-20 animate-float"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          {i % 4 === 0 && <div className="text-3xl">🎓</div>}
          {i % 4 === 1 && <div className="text-3xl">📚</div>}
          {i % 4 === 2 && <div className="text-2xl">🏛️</div>}
          {i % 4 === 3 && <div className="text-2xl">⭐</div>}
        </div>
      ))}

      {/* Sparkling stars */}
      {[...Array(25)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        ></div>
      ))}

      {/* Login card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-10 w-full max-w-md text-center transform transition-transform hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-pink-500 drop-shadow-md">
          🎓 SVVV Student Portal
        </h1>

        {step === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Enrollment Number"
              value={enrollment}
              onChange={(e) => setEnrollment(e.target.value)}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition"
              required
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-400 text-white py-3 rounded-lg hover:bg-purple-500 transition duration-300"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Demo Login */}
            <div className="mt-4 text-sm text-gray-600 text-left bg-gray-100 p-3 rounded-lg">
              <p className="font-semibold text-gray-700">Demo Login :</p>
              <p>
                Username:{" "}
                <span className="font-mono">22100BTAIMLM11277</span>
              </p>
              <p>
                Password:{" "}
                <span className="font-mono">Yugyug@123</span>
              </p>
            </div>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <p className="text-gray-700 text-center mb-2">
              You must reset your password before continuing.
            </p>
            <input
              type="password"
              placeholder="New Password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none transition"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes blob {
            0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
            33% { transform: translate(30px,-50px) scale(1.1) rotate(120deg); }
            66% { transform: translate(-20px,20px) scale(0.9) rotate(240deg); }
          }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }

          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.2; }
            50% { transform: translateY(-30px) rotate(180deg); opacity: 0.4; }
            100% { transform: translateY(0) rotate(360deg); opacity: 0.2; }
          }
          .animate-float { animation: float 8s infinite ease-in-out; }

          @keyframes twinkle {
            0%,100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default StudentsLogin;
