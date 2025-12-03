// src/pages/AccountLogin.jsx
import React, { useEffect } from "react";

const AccountLogin = () => {
  useEffect(() => {
    // Redirect to Account/Admin Panel (no back button loop)
    window.location.replace("https://admin-panel-gamma-jade.vercel.app/");
  }, []);

  return null; // no UI
};

export default AccountLogin;
