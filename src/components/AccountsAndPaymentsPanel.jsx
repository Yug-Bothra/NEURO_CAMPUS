// src/components/AccountsAndPaymentsPanel.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AccountsAndPaymentsPanel = () => {
  const [accounts, setAccounts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentSearch, setPaymentSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchPayments();
  }, []);

  const fetchAccounts = async () => {
    const { data, error } = await supabase.from("accounts").select("*");
    if (!error) setAccounts(data);
    else console.error("Fetch accounts error:", error);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("payment_id, transaction_id, amount, status, created_at, enrollment_number, account_id")
      .order("created_at", { ascending: false });
    if (!error) setPayments(data);
    else console.error("Fetch payments error:", error);
  };

  const handleSave = async (id) => {
    const values = editValues[id];
    if (!values) return;

    const { error } = await supabase
      .from("accounts")
      .update({
        total_fees: Number(values.total_fees),
        fees_paid: Number(values.fees_paid),
        updated_at: new Date().toISOString(),
      })
      .eq("account_id", id);

    if (error) console.error("Save error:", error);
    else {
      fetchAccounts();
      setEditingId(null);
    }
  };

  const handleVerifyPayment = async (payment) => {
    setLoading(true);
    const { payment_id, account_id, amount } = payment;

    try {
      // First, get the current account data
      const { data: accountData, error: accountFetchError } = await supabase
        .from("accounts")
        .select("fees_paid, total_fees")
        .eq("account_id", account_id)
        .single();

      if (accountFetchError || !accountData) {
        console.error("Failed to fetch account:", accountFetchError);
        setLoading(false);
        return;
      }

      // Calculate new values
      const updatedPaid = Number(accountData.fees_paid) + Number(amount);
      const updatedDue = Number(accountData.total_fees) - updatedPaid;
      const currentDateTime = new Date().toISOString();

      // Update payment status to approved
      const { error: paymentError } = await supabase
        .from("payments")
        .update({ status: "approved" })
        .eq("payment_id", payment_id);

      if (paymentError) {
        console.error("Failed to update payment:", paymentError);
        setLoading(false);
        return;
      }

      // Update account with all payment details
      const { error: accountUpdateError } = await supabase
        .from("accounts")
        .update({
          fees_paid: updatedPaid,
          fees_due: updatedDue,
          last_payment_at: currentDateTime,
          last_payment_amount: Number(amount),
          last_payment_date: currentDateTime,
          updated_at: currentDateTime,
        })
        .eq("account_id", account_id);

      if (accountUpdateError) {
        console.error("Failed to update account:", accountUpdateError);
        setLoading(false);
        return;
      }

      // Update local state immediately for instant UI feedback
      setPayments(prevPayments => 
        prevPayments.map(p => 
          p.payment_id === payment_id ? { ...p, status: "approved" } : p
        )
      );

      setAccounts(prevAccounts => 
        prevAccounts.map(acc => 
          acc.account_id === account_id ? {
            ...acc,
            fees_paid: updatedPaid,
            fees_due: updatedDue,
            last_payment_at: currentDateTime,
            last_payment_amount: Number(amount),
            last_payment_date: currentDateTime,
            updated_at: currentDateTime,
          } : acc
        )
      );

      // Also refresh from database to ensure sync
      await Promise.all([fetchAccounts(), fetchPayments()]);

    } catch (error) {
      console.error("Error in handleVerifyPayment:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAccounts = accounts.filter((acc) =>
    acc.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter((pay) =>
    pay.enrollment_number.toLowerCase().includes(paymentSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-10 bg-gray-50 min-h-screen">
      {/* Accounts Section */}
      <div>
        <h2 className="text-3xl font-bold text-blue-800 mb-4">📘 Student Accounts</h2>
        <input
          type="text"
          placeholder="🔍 Search accounts by enrollment number"
          className="mb-4 px-4 py-2 border rounded w-full border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-blue-200 bg-white shadow-md rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Enrollment</th>
                <th className="px-4 py-2">Total Fees</th>
                <th className="px-4 py-2">Fees Paid</th>
                <th className="px-4 py-2">Fees Due</th>
                <th className="px-4 py-2">Last Payment</th>
                <th className="px-4 py-2">Last Payment Amount</th>
                <th className="px-4 py-2">Last Payment Date</th>
                <th className="px-4 py-2">Updated At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((acc) => {
                const isEditing = editingId === acc.account_id;
                return (
                  <tr key={acc.account_id} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-2">{acc.enrollment_number}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        className="w-full border px-2 py-1 rounded disabled:bg-gray-100"
                        value={editValues[acc.account_id]?.total_fees ?? acc.total_fees}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            [acc.account_id]: {
                              ...prev[acc.account_id],
                              total_fees: e.target.value,
                            },
                          }))
                        }
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        className="w-full border px-2 py-1 rounded disabled:bg-gray-100"
                        value={editValues[acc.account_id]?.fees_paid ?? acc.fees_paid}
                        disabled={!isEditing}
                        onChange={(e) =>
                          setEditValues((prev) => ({
                            ...prev,
                            [acc.account_id]: {
                              ...prev[acc.account_id],
                              fees_paid: e.target.value,
                            },
                          }))
                        }
                      />
                    </td>
                    <td className="px-4 py-2">{acc.fees_due}</td>
                    <td className="px-4 py-2">
                      {acc.last_payment_at ? new Date(acc.last_payment_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-2">{acc.last_payment_amount ?? "—"}</td>
                    <td className="px-4 py-2">
                      {acc.last_payment_date
                        ? new Date(acc.last_payment_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {acc.updated_at ? new Date(acc.updated_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {!isEditing ? (
                        <button
                          onClick={() => {
                            setEditingId(acc.account_id);
                            setEditValues((prev) => ({
                              ...prev,
                              [acc.account_id]: {
                                total_fees: acc.total_fees,
                                fees_paid: acc.fees_paid,
                              },
                            }));
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSave(acc.account_id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Save
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Section */}
      <div>
        <h2 className="text-3xl font-bold text-blue-800 mb-4">💸 Payments</h2>
        <input
          type="text"
          placeholder="🔍 Search payments by enrollment number"
          className="mb-4 px-4 py-2 border rounded w-full border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={paymentSearch}
          onChange={(e) => setPaymentSearch(e.target.value)}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-blue-200 bg-white shadow-md rounded-lg">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2">Payment ID</th>
                <th className="px-4 py-2">Txn ID</th>
                <th className="px-4 py-2">Enrollment</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((pay) => (
                <tr key={pay.payment_id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-2">{pay.payment_id}</td>
                  <td className="px-4 py-2">{pay.transaction_id || "—"}</td>
                  <td className="px-4 py-2">{pay.enrollment_number}</td>
                  <td className="px-4 py-2">{pay.amount}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      pay.status === 'approved' ? 'bg-green-100 text-green-800' : 
                      pay.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(pay.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {pay.status === "pending" && (
                      <button
                        onClick={() => handleVerifyPayment(pay)}
                        disabled={loading}
                        className={`px-3 py-1 rounded text-white ${
                          loading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {loading ? 'Verifying...' : 'Verify'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountsAndPaymentsPanel;