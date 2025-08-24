import React from "react";

const LibraryLink = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📚 E-Library</h2>
      <a
        href="https://eliberary.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-300"
      >
        Visit E-Library
      </a>
    </div>
  );
};

export default LibraryLink;
