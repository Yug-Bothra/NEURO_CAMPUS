import React from "react";
import { SignIn } from "@clerk/clerk-react";

const AdminLogin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 space-y-4">
      <SignIn routing="path" path="/admin" />

      {/* Demo Login */}
      <div className="text-sm text-gray-600 text-left bg-gray-100 p-4 rounded-lg w-full max-w-sm">
        <p className="font-semibold text-gray-700 mb-1">Demo Login :</p>
        <p>
          Username:{" "}
          <span className="font-mono">yugbothra200@gmail.com</span>
        </p>
        <p>
          Password:{" "}
          <span className="font-mono">Yugyug@123</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
