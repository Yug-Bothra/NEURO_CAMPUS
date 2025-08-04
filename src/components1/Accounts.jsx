import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Copy, Download } from "lucide-react";
import PaymentEntryForm from "./PaymentEntryForm";

const StaticUPIBlock = () => {
  const upiID = "yugbothra200-1@okicici";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiID);
    alert("✅ UPI ID copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Pay via UPI
      </h3>
      <img
        src="/images/qrcode.jpg"
        alt="UPI QR Code"
        className="w-52 h-52 mx-auto border-2 border-gray-300 rounded-lg mb-4"
      />
      <p className="text-center text-sm text-gray-600 mb-3">
        Scan the QR code using any UPI app
      </p>
      <div className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-base font-medium text-gray-800">
        <span>{upiID}</span>
        <button onClick={handleCopy} title="Copy UPI ID">
          <Copy size={20} className="text-gray-600 hover:text-gray-800" />
        </button>
      </div>
      <p className="text-xs text-center text-gray-500 mt-2">
        Add your enrollment number in remarks.
      </p>
    </div>
  );
};

const Accounts = ({ enrollmentNumber }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const fetchAccount = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("enrollment_number", enrollmentNumber.trim())
        .single();
      if (error) throw error;
      setAccount(data);
    } catch (error) {
      console.error("Account Fetch Error:", error.message);
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("enrollment_number", enrollmentNumber.trim())
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPaymentHistory(data);
    } catch (error) {
      console.error("Payment History Error:", error.message);
    }
  };

  const generatePDFReceipt = (payment) => {
    const formattedDate = new Date(payment.created_at).toLocaleString();
    const htmlContent = `
      <html>
        <head>
          <title>Payment Receipt</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              background-color: #f8f9fa;
              color: #212529;
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #e11d48;
              margin-bottom: 32px;
              padding-bottom: 16px;
            }
            .header h1 {
              margin: 0;
              color: #e11d48;
              font-size: 28px;
            }
            .sub-header {
              font-size: 15px;
              color: #666;
              margin-top: 4px;
            }
            .receipt {
              max-width: 650px;
              margin: 0 auto;
              background: #fff;
              padding: 32px;
              border: 1px solid #ccc;
              border-radius: 10px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .row {
              margin-bottom: 14px;
              font-size: 16px;
            }
            .label {
              display: inline-block;
              width: 180px;
              font-weight: 600;
              color: #555;
            }
            .amount-box {
              margin-top: 24px;
              padding: 18px;
              background-color: #e6f4ea;
              border: 2px dashed #28a745;
              border-radius: 8px;
              text-align: center;
              font-size: 20px;
              font-weight: bold;
              color: #2e7d32;
            }
            .footer {
              text-align: center;
              font-size: 13px;
              color: #999;
              margin-top: 40px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SVVV - Payment Receipt</h1>
            <div class="sub-header">Shri Vaishnav Vidyapeeth Vishwavidyalaya</div>
          </div>
          <div class="receipt">
            <div class="row"><span class="label">Receipt No:</span> ${payment.payment_id}</div>
            <div class="row"><span class="label">Enrollment No:</span> ${payment.enrollment_number}</div>
            <div class="row"><span class="label">Transaction ID:</span> ${payment.transaction_id || "N/A"}</div>
            <div class="row"><span class="label">Payment Date:</span> ${formattedDate}</div>
            <div class="row"><span class="label">Payment Status:</span> ${payment.status}</div>
            <div class="amount-box">Amount Paid: ₹${payment.amount}</div>
          </div>
          <div class="footer">This is a digitally generated receipt. No signature required.</div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 500);
    };
  };

  useEffect(() => {
    if (enrollmentNumber) {
      fetchAccount();
      fetchPaymentHistory();
    }
  }, [enrollmentNumber]);

  if (loading) return <p>Loading account data...</p>;
  if (!account) return <p className="text-red-600 font-medium">No account found.</p>;

  return (
    <div className="max-w-screen-xl mx-auto mt-10 px-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
        <h2 className="text-3xl font-extrabold text-rose-600">💳 Fee Account Summary</h2>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="mt-4 sm:mt-0 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          {showHistory ? "⬅ Back to Payment" : "📄 View Payment History"}
        </button>
      </div>

      {/* Account Summary Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-8 grid md:grid-cols-2 gap-4 text-gray-800 text-base">
        <p><strong>Total Fees:</strong> ₹{account.total_fees}</p>
        <p><strong>Paid:</strong> ₹{account.fees_paid}</p>
        <p><strong>Due:</strong> ₹{account.fees_due}</p>
        <p>
          <strong>Last Payment:</strong>{" "}
          {account.last_payment_at
            ? new Date(account.last_payment_at).toLocaleString()
            : "No payments yet"}
        </p>
      </div>

      {!showHistory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StaticUPIBlock />
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Submit New Payment</h2>
            <PaymentEntryForm
              enrollmentNumber={enrollmentNumber}
              onPaymentAdded={() => {
                fetchAccount();
                fetchPaymentHistory();
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment History</h2>
          {paymentHistory.length === 0 ? (
            <p className="text-sm text-gray-500">No previous payments found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <li key={payment.id} className="py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-800 font-medium">
                        ₹{payment.amount} on {new Date(payment.created_at).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Txn: {payment.transaction_id || "N/A"}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          payment.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                    <button
                      onClick={() => generatePDFReceipt(payment)}
                      className="text-sm flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Download size={16} />
                      Receipt
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Accounts;
