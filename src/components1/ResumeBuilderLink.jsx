import React from "react";

const ResumeBuilderLink = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">📄 Resume Builder</h2>
      <a
        href="https://nextstep-resume.netlify.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
      >
        Build Your Resume
      </a>
    </div>
  );
};

export default ResumeBuilderLink;
