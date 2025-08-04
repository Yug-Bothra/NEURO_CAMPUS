// src/components/StudentPaymentEntryForm.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const StudentPaymentEntryForm = () => {
  const [formData, setFormData] = useState({
    payment_id: "",
    enrollment_number: "",
    amount: "",
    payment_method: "UPI (static)",
    transaction_id: "",
    status: "pending",
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Fetch account_id using enrollment_number
      const {
        data: accountData, error: accountError } = await supabase
  .from("accounts") // ✅ now refers to the public view
  .select("account_id")
  .eq("enrollment_number", formData.enrollment_number.trim())
  .single();

      if (accountError || !accountData) {
        throw new Error("Invalid enrollment number. Account not found.");
      }

      const account_id = accountData.account_id;

      // Insert payment record (receipt_url excluded)
      const { error } = await supabase.from("payments").insert({
        payment_id: formData.payment_id.trim(),
        account_id,
        enrollment_number: formData.enrollment_number.trim(),
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method,
        transaction_id: formData.transaction_id.trim(),
        status: formData.status,
      });

      if (error) {
        throw error;
      }

      setMessage("✅ Payment submitted successfully.");
      setFormData({
        payment_id: "",
        enrollment_number: "",
        amount: "",
        payment_method: "UPI (static)",
        transaction_id: "",
        status: "pending",
      });
    } catch (err) {
      setMessage("❌ Error submitting payment: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Submit Payment</h2>
      {message && (
        <div className="mb-4 text-sm text-center text-red-600">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Payment ID</label>
          <input
            name="payment_id"
            value={formData.payment_id}
            onChange={handleChange}
            placeholder="Unique Payment ID"
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Enrollment Number</label>
          <input
            name="enrollment_number"
            value={formData.enrollment_number}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Payment Method</label>
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option>UPI (static)</option>
            <option>Cash</option>
            <option>Bank Transfer</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-gray-700">Transaction ID</label>
          <input
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            placeholder="e.g. UPI Ref No / Bank Txn ID"
            className="w-full border px-3 py-2 rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
};

export default StudentPaymentEntryForm;
