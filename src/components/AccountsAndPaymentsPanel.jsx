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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-3 md:p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-emerald-400/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-pink-400/8 to-violet-400/8 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
            Financial Dashboard
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Comprehensive management system for student accounts and payment transactions
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Accounts Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transform hover:scale-[1.001] transition-all duration-300">
          {/* Enhanced Header with Glassmorphism */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-1">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="text-xl">💼</span>
                    </div>
                    Student Accounts
                  </h2>
                  <p className="text-blue-100 text-sm font-medium">Manage student financial records</p>
                </div>
                <div className="hidden md:block">
                  <div className="text-right text-white/90">
                    <div className="text-2xl font-bold">{accounts.length}</div>
                    <div className="text-xs font-medium">Total Accounts</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
          </div>
          
          <div className="p-6">
            {/* Enhanced Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search accounts by enrollment number"
                className="w-full pl-16 pr-6 py-3 border-2 border-blue-200/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl text-sm bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-lg font-medium placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="text-xs text-slate-400 font-medium">{filteredAccounts.length} results</div>
              </div>
            </div>
            
            {/* Enhanced Table Container */}
            <div className="overflow-hidden rounded-xl shadow-lg border border-blue-100/50 bg-gradient-to-br from-white to-slate-50/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white relative">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>📋</span>
                          Enrollment
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          Total Fees
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>✅</span>
                          Fees Paid
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>⏳</span>
                          Fees Due
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">Updated At</th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          ⚙ Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {filteredAccounts.map((acc, index) => {
                      const isEditing = editingId === acc.account_id;
                      return (
                        <tr key={acc.account_id} className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-indigo-50/80 hover:shadow-md group ${index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/40'}`}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="font-semibold text-blue-800 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm text-sm">
                                {acc.enrollment_number}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-full min-w-[140px] border-2 border-slate-300/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg disabled:bg-gradient-to-r disabled:from-slate-100 disabled:to-slate-200 disabled:text-slate-700 transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md"
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
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              className="w-full min-w-[140px] border-2 border-slate-300/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded-lg disabled:bg-gradient-to-r disabled:from-slate-100 disabled:to-slate-200 disabled:text-slate-700 transition-all duration-300 font-semibold text-sm shadow-sm hover:shadow-md"
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
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${acc.fees_due > 0 ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`}></div>
                              <span className={`font-bold text-sm px-3 py-2 rounded-lg shadow-md min-w-[90px] text-center ${
                                acc.fees_due > 0 
                                  ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200' 
                                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                              }`}>
                                ₹{acc.fees_due}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded">
                              {acc.updated_at ? new Date(acc.updated_at).toLocaleDateString() : "—"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
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
                                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20 text-sm"
                              >
                                <span className="flex items-center gap-2">
                                  ✏ Edit
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSave(acc.account_id)}
                                className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 border border-white/20 text-sm"
                              >
                                <span className="flex items-center gap-2">
                                  💾 Save
                                </span>
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
        </div>

        {/* Payments Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden transform hover:scale-[1.001] transition-all duration-300">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-1">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <span className="text-xl">💳</span>
                    </div>
                    Payment Transactions
                  </h2>
                  <p className="text-emerald-100 text-sm font-medium">Monitor and verify student payments</p>
                </div>
                <div className="hidden md:block">
                  <div className="text-right text-white/90">
                    <div className="text-2xl font-bold">{payments.length}</div>
                    <div className="text-xs font-medium">Total Payments</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 bg-white/5 rounded-full translate-y-6 -translate-x-6"></div>
          </div>
          
          <div className="p-6">
            {/* Enhanced Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search payments by enrollment number"
                className="w-full pl-16 pr-6 py-3 border-2 border-emerald-200/60 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl text-sm bg-gradient-to-r from-white to-emerald-50/30 backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-lg font-medium placeholder-slate-400"
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <div className="text-xs text-slate-400 font-medium">{filteredPayments.length} results</div>
              </div>
            </div>
            
            {/* Enhanced Table Container */}
            <div className="overflow-hidden rounded-xl shadow-lg border border-emerald-100/50 bg-gradient-to-br from-white to-slate-50/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>🆔</span>
                          Payment ID
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>🔗</span>
                          Txn ID
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>📋</span>
                          Enrollment
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          Amount
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>📊</span>
                          Status
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>⏰</span>
                          Created At
                        </div>
                      </th>
                      <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                        <div className="flex items-center gap-2">
                          <span>⚡</span>
                          Action
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {filteredPayments.map((pay, index) => (
                      <tr key={pay.payment_id} className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80 hover:shadow-md group ${index % 2 === 0 ? 'bg-white/60' : 'bg-slate-50/40'}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs font-semibold bg-gradient-to-r from-slate-100 to-slate-200 px-2 py-1 rounded-lg border border-slate-300 shadow-sm">
                              {pay.payment_id}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded font-medium">
                            {pay.transaction_id || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span className="font-semibold text-emerald-800 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm text-sm">
                              {pay.enrollment_number}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-sm text-slate-900 bg-gradient-to-r from-yellow-100 to-amber-100 px-3 py-1.5 rounded-lg border border-yellow-200 shadow-md">
                            ₹{pay.amount}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              pay.status === 'approved' ? 'bg-green-400 animate-pulse' : 
                              pay.status === 'pending' ? 'bg-yellow-400 animate-pulse' : 
                              'bg-red-400 animate-pulse'
                            }`}></div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md border ${
                              pay.status === 'approved' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300' : 
                              pay.status === 'pending' ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300' : 
                              'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-300'
                            }`}>
                              {pay.status.toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-600 text-xs font-medium bg-slate-100 px-2 py-1 rounded">
                            {new Date(pay.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {pay.status === "pending" && (
                            <button
                              onClick={() => handleVerifyPayment(pay)}
                              disabled={loading}
                              className={`px-4 py-2 rounded-lg font-semibold shadow-lg transform transition-all duration-300 border border-white/20 text-sm ${
                                loading 
                                  ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white cursor-not-allowed' 
                                  : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white hover:scale-105'
                              }`}
                            >
                              {loading ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>🔄 Verifying...</span>
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  <span>✅</span>
                                  Verify
                                </span>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-xl border border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 font-medium text-sm">Approved Payments</p>
                    <p className="text-2xl font-bold text-green-800">
                      {filteredPayments.filter(p => p.status === 'approved').length}
                    </p>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-4 rounded-xl border border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 font-medium text-sm">Pending Payments</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {filteredPayments.filter(p => p.status === 'pending').length}
                    </p>
                  </div>
                  <div className="text-2xl">⏳</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-xl border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 font-medium text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-800">
                      ₹{filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-2xl">💰</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-slate-500 font-medium text-sm">
            <span>⚡</span>
            <span>Powered by Advanced Financial Management System</span>
            <span>⚡</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsAndPaymentsPanel;