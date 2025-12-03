// src/pages/TeachersLogin.jsx
import React, { useEffect } from "react";

const TeachersLogin = () => {
  useEffect(() => {
    // Redirect to Teacher Panel (no back button loop)
    window.location.replace("https://teacher-panel-chi.vercel.app/");
  }, []);

  return null; // no UI
};

export default TeachersLogin;
