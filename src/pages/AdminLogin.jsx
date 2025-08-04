import React from "react";
import { SignIn } from "@clerk/clerk-react";

const AdminLogin = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <SignIn routing="path" path="/admin" />
    </div>
  );
};

export default AdminLogin;
