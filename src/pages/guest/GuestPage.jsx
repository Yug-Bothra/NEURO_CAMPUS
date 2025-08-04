import React, { useState } from "react";

const GuestPage = () => {
  const [form, setForm] = useState({ name: "", number: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome ${form.name}, we’ll contact you at ${form.number}!`);
    setForm({ name: "", number: "" });
  };

  return (
    <div className="flex items-center justify-center py-10 bg-gray-100 min-h-[calc(100vh-4rem)]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
          Guest Registration
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border border-gray-300 p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="tel"
          placeholder="Contact Number"
          value={form.number}
          onChange={(e) => setForm({ ...form, number: e.target.value })}
          className="w-full border border-gray-300 p-2 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GuestPage;
