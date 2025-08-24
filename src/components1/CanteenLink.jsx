import React from "react";

const CanteenLink = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-green-600 mb-4">🍽️ E-Canteen</h2>
      <a
        href="https://project-alpha-roan.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition duration-300"
      >
        Visit E-Canteen
      </a>
    </div>
  );
};

export default CanteenLink;
