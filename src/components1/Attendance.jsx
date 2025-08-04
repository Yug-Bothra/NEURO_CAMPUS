import React from "react";

const Attendance = ({ enrollmentNumber }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Attendance</h2>
      <p className="text-gray-500">
        Attendance details for enrollment: {enrollmentNumber}
      </p>
    </div>
  );
};

export default Attendance;
