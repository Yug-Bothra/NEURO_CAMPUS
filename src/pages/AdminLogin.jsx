import React from "react";
import { SignIn } from "@clerk/clerk-react";

const AdminLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-4">
        <SignIn routing="path" path="/admin" />

        {/* Demo Login */}
        <div className="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg">
          <p className="font-semibold text-gray-700 mb-1">Demo Login :</p>
          <p>
            Email: <span className="font-mono">admin@gmail.com</span>
          </p>
          <p>
            Password: <span className="font-mono">Yugyug@123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
