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

      const updatedPaid = Number(accountData.fees_paid) + Number(amount);
      const updatedDue = Number(accountData.total_fees) - updatedPaid;
      const currentDateTime = new Date().toISOString();

      const { error: paymentError } = await supabase
        .from("payments")
        .update({ status: "approved" })
        .eq("payment_id", payment_id);

      if (paymentError) {
        console.error("Failed to update payment:", paymentError);
        setLoading(false);
        return;
      }

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
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            Financial Dashboard
          </h1>
          <p className="text-blue-600">
            Manage student accounts and payment transactions
          </p>
        </div>

        {/* Accounts Section */}
        <div className="bg-white rounded-xl shadow border border-blue-200">
          <div className="px-6 py-4 border-b border-blue-200 bg-blue-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  Student Accounts
                </h2>
                <p className="text-sm text-blue-600 mt-1">
                  Manage student financial records
                </p>
              </div>
              <div className="text-sm text-blue-700 font-medium">
                {accounts.length} total accounts
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search accounts by enrollment number..."
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200 bg-blue-50">
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Enrollment Number
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Total Fees
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Fees Paid
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Fees Due
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Updated At
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredAccounts.map((acc) => {
                    const isEditing = editingId === acc.account_id;
                    return (
                      <tr key={acc.account_id} className="hover:bg-blue-50">
                        <td className="py-3 px-4">
                          <span className="font-medium text-blue-700">
                            {acc.enrollment_number}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:text-blue-700"
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
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-blue-50 disabled:text-blue-700"
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
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            acc.fees_due > 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            ₹{acc.fees_due}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-blue-600">
                          {acc.updated_at ? new Date(acc.updated_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-4">
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
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Edit
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSave(acc.account_id)}
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
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
        </div>

        {/* Payments Section */}
        <div className="bg-white rounded-xl shadow border border-blue-200">
          <div className="px-6 py-4 border-b border-blue-200 bg-blue-100 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  Payment Transactions
                </h2>
                <p className="text-sm text-blue-600 mt-1">
                  Monitor and verify student payments
                </p>
              </div>
              <div className="text-sm text-blue-700 font-medium">
                {payments.length} total payments
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search payments by enrollment number..."
                className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
              />
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-blue-200 bg-blue-50">
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Payment ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Transaction ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Enrollment
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Created At
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-blue-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredPayments.map((pay) => (
                    <tr key={pay.payment_id} className="hover:bg-blue-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-blue-700">
                          {pay.payment_id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm text-blue-700">
                          {pay.transaction_id || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-blue-600">
                          {pay.enrollment_number}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-blue-900">
                          ₹{pay.amount}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          pay.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          pay.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-blue-600">
                        {new Date(pay.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {pay.status === "pending" && (
                          <button
                            onClick={() => handleVerifyPayment(pay)}
                            disabled={loading}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              loading 
                                ? 'bg-blue-200 text-blue-400 cursor-not-allowed' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-blue-200">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div>
                  <p className="text-sm font-medium text-green-800">Approved</p>
                  <p className="text-2xl font-bold text-green-900">
                    {filteredPayments.filter(p => p.status === 'approved').length}
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div>
                  <p className="text-sm font-medium text-yellow-800">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {filteredPayments.filter(p => p.status === 'pending').length}
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsAndPaymentsPanel;
