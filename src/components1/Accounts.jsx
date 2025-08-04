import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Copy, Download } from "lucide-react";
import PaymentEntryForm from "./PaymentEntryForm"; // ✅ Keep as-is

const StaticUPIBlock = () => {
  const upiID = "yugbothra200-1@okicici";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiID);
    alert("✅ UPI ID copied to clipboard!");
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">📤 Make a Payment</h3>

      <img
        src="/src/assets/images/qrcode.jpg"
        alt="UPI QR Code"
        className="w-44 h-44 mx-auto border rounded-md mb-4"
      />

      <p className="text-center text-gray-600 mb-2">Scan using any UPI App</p>

      <div className="flex justify-between items-center bg-white p-3 rounded-md border text-sm text-gray-700">
        <span>{upiID}</span>
        <button onClick={handleCopy}>
          <Copy size={18} className="text-gray-600 hover:text-black" />
        </button>
      </div>

      <p className="text-xs text-center mt-3 text-gray-500">
        Don't forget to mention your enrollment number in remarks.
      </p>
    </div>
  );
};

const Accounts = ({ enrollmentNumber }) => {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentHistory, setPaymentHistory] = useState([]);

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

  // ✅ PDF Receipt Generation Function (name removed, SVVV added)
  const generatePDFReceipt = (payment) => {
    const doc = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Payment Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .receipt-title { color: #d63384; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .institute-name { color: #666; font-size: 18px; }
          .receipt-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px dotted #ccc; }
          .detail-label { font-weight: bold; color: #333; }
          .detail-value { color: #666; }
          .amount-highlight { background: #d63384; color: white; padding: 15px; text-align: center; border-radius: 8px; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-approved { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="receipt-title">PAYMENT RECEIPT</div>
          <div class="institute-name">SVVV</div>
        </div>
        
        <div class="receipt-details">
          <div class="detail-row">
            <span class="detail-label">Receipt No:</span>
            <span class="detail-value">${payment.payment_id || payment.id}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Enrollment Number:</span>
            <span class="detail-value">${payment.enrollment_number}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Transaction ID:</span>
            <span class="detail-value">${payment.transaction_id || payment.upi_reference || 'N/A'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Date:</span>
            <span class="detail-value">${new Date(payment.created_at).toLocaleDateString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Time:</span>
            <span class="detail-value">${new Date(payment.created_at).toLocaleTimeString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">
              <span class="status-badge ${payment.status === 'approved' ? 'status-approved' : 'status-pending'}">
                ${payment.status ? payment.status.toUpperCase() : 'COMPLETED'}
              </span>
            </span>
          </div>
        </div>

        <div class="amount-highlight">
          Amount Paid: ₹${payment.amount}
        </div>

        <div class="footer">
          <p>This is a computer generated receipt.</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(doc);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  };

  useEffect(() => {
    if (enrollmentNumber) {
      fetchAccount();
      fetchPaymentHistory();
    }
  }, [enrollmentNumber]);

  if (loading) return <p>Loading account details...</p>;
  if (!account)
    return <p className="text-red-600">No account found for this student.</p>;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-red-600 mb-4">💳 Account Summary</h2>
      <p className="text-gray-700 mb-2">
        <strong>Total Fees:</strong> ₹{account.total_fees}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Fees Paid:</strong> ₹{account.fees_paid}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Fees Due:</strong>{" "}
        <span className="text-red-600 font-semibold">₹{account.fees_due}</span>
      </p>
      <p className="text-gray-700 mb-6">
        <strong>Last Payment:</strong>{" "}
        {account.last_payment_at
          ? new Date(account.last_payment_at).toLocaleString()
          : "No payments yet"}
      </p>

      <StaticUPIBlock />

      <PaymentEntryForm
        enrollmentNumber={enrollmentNumber}
        onPaymentAdded={() => {
          fetchAccount();
          fetchPaymentHistory();
        }}
      />

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">🧾 Payment History</h3>
        {paymentHistory.length === 0 ? (
          <p className="text-sm text-gray-500">No previous payments found.</p>
        ) : (
          <ul className="divide-y divide-gray-200 text-sm">
            {paymentHistory.map((payment) => (
              <li key={payment.id} className="py-3 flex justify-between items-center">
                <div>
                  <strong>₹{payment.amount}</strong> on{" "}
                  {new Date(payment.created_at).toLocaleString()} &nbsp;
                  <span className="text-gray-500">Ref: {payment.upi_reference}</span>
                  {payment.status && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      payment.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => generatePDFReceipt(payment)}
                  className="ml-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                  title="Download Receipt"
                >
                  <Download size={16} />
                  <span className="text-xs">Receipt</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Accounts;
