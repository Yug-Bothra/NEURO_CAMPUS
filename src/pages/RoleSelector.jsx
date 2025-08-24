import React from "react";
import { Shield, BookOpen, GraduationCap, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelector = () => {
  const navigate = useNavigate();

  const handleRoleClick = (path) => {
    navigate(path);
  };

  const colorMap = {
    Admin: "bg-blue-400 hover:bg-blue-500",
    Teacher: "bg-green-400 hover:bg-green-500",
    Student: "bg-pink-400 hover:bg-pink-500",
    "Guest / Visitor": "bg-gray-400 hover:bg-gray-500",
  };

  const roles = [
    { label: "Admin", path: "/admin", icon: <Shield className="mr-2" /> },
    { label: "Teacher", path: "/teacher", icon: <BookOpen className="mr-2" /> },
    { label: "Student", path: "/student", icon: <GraduationCap className="mr-2" /> },
    { label: "Guest / Visitor", path: "/guest", icon: <Eye className="mr-2" /> },
  ];

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-200 via-cyan-200 to-pink-200 px-4 overflow-hidden">

      {/* College campus buildings silhouette */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-300/40 to-transparent">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 200" fill="none">
          {/* Example building */}
          <rect x="100" y="80" width="120" height="120" fill="rgba(100,100,100,0.3)" />
          <rect x="110" y="90" width="20" height="30" fill="rgba(255,255,200,0.4)" />
          <rect x="140" y="90" width="20" height="30" fill="rgba(255,255,200,0.3)" />
          <rect x="170" y="90" width="20" height="30" fill="rgba(255,255,200,0.4)" />
          <rect x="110" y="130" width="20" height="30" fill="rgba(255,255,200,0.2)" />
          <rect x="140" y="130" width="20" height="30" fill="rgba(255,255,200,0.4)" />
          <rect x="170" y="130" width="20" height="30" fill="rgba(255,255,200,0.3)" />
          <polygon points="95,80 160,50 225,80" fill="rgba(100,100,100,0.4)" />
          {/* Add other buildings, trees, library, dorms here as in your original SVG */}
        </svg>
      </div>

      {/* Animated blobs */}
      <div className="absolute top-0 left-1/5 w-[450px] h-[450px] bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-blob"></div>
      <div className="absolute top-1/4 right-1/5 w-[350px] h-[350px] bg-gradient-to-br from-pink-300/30 to-yellow-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-green-200/20 to-blue-200/30 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-2xl animate-blob animation-delay-1000"></div>

      {/* Gradient rays */}
      <div className="absolute w-[800px] h-[800px] bg-gradient-conic from-cyan-300/10 via-green-200/10 via-yellow-200/10 to-pink-200/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>

      {/* Floating academic elements */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute opacity-10 animate-float"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${6 + Math.random() * 4}s`,
          }}
        >
          {i % 5 === 0 && <div className="text-4xl">🎓</div>}
          {i % 5 === 1 && <div className="text-3xl">📚</div>}
          {i % 5 === 2 && <div className="text-3xl">🏛️</div>}
          {i % 5 === 3 && <div className="text-2xl">⭐</div>}
          {i % 5 === 4 && <div className="text-3xl">🎯</div>}
        </div>
      ))}

      {/* Sparkling stars */}
      {[...Array(30)].map((_, i) => (
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

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Role selection card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-10 w-full max-w-md text-center transform transition-transform hover:scale-105 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-400 drop-shadow-md">
          Welcome to SVVV Portal
        </h1>
        <p className="text-gray-600 mb-8 text-sm sm:text-base">
          Please select your role to continue
        </p>

        <div className="grid gap-4">
          {roles.map((role) => (
            <button
              key={role.label}
              onClick={() => handleRoleClick(role.path)}
              className={`flex items-center justify-center w-full ${colorMap[role.label]} text-white py-3 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:brightness-110`}
            >
              <span className="text-lg mr-2">{role.icon}</span>
              <span className="font-medium">{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1) rotate(0deg); }
            33% { transform: translate(30px, -50px) scale(1.1) rotate(120deg); }
            66% { transform: translate(-20px, 20px) scale(0.9) rotate(240deg); }
          }
          .animate-blob { animation: blob 12s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
          .animation-delay-1000 { animation-delay: 1s; }

          @keyframes float {
            0% { transform: translateY(0px) rotate(0deg); opacity: 0.1; }
            50% { transform: translateY(-30px) rotate(180deg); opacity: 0.3; }
            100% { transform: translateY(0px) rotate(360deg); opacity: 0.1; }
          }
          .animate-float { animation: float 8s infinite ease-in-out; }

          @keyframes pulse-slow {
            0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.1; }
            50% { transform: scale(1.2) rotate(180deg); opacity: 0.2; }
          }
          .animate-pulse-slow { animation: pulse-slow 15s infinite ease-in-out; }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
          }
          .animate-twinkle { animation: twinkle 3s infinite ease-in-out; }
        `}
      </style>
    </div>
  );
};

export default RoleSelector;
