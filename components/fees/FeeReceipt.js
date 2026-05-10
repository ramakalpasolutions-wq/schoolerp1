// components/fees/FeeReceipt.js

"use client";

import { useRef } from "react";
import {
  Printer,
  Download,
  CheckCircle2,
  GraduationCap,
  X,
} from "lucide-react";

// ── Amount to words ──────────────────────────────────────────────
function amountToWords(n) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (n === 0) return "Zero";
  if (n < 20) return ones[n];
  if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
  if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + amountToWords(n % 100) : "");
  if (n < 100000) return amountToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + amountToWords(n % 1000) : "");
  if (n < 10000000) return amountToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + amountToWords(n % 100000) : "");
  return amountToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + amountToWords(n % 10000000) : "");
}

const METHOD_LABELS = {
  CASH: "Cash",
  ONLINE: "Online / UPI",
  CHEQUE: "Cheque",
  BANK_TRANSFER: "Bank Transfer",
  DD: "Demand Draft",
  CARD: "Card",
};

export default function FeeReceipt({
  receipt = {},
  school = {},
  student = {},
  onClose,
  show = true,
}) {
  const printRef = useRef(null);

  if (!show) return null;

  const {
    receiptNo = "RCP/2025/0001",
    date = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    feeItems = [
      { category: "Tuition Fee", amount: 12000 },
      { category: "Transport Fee", amount: 2000 },
    ],
    totalAmount = 14000,
    paymentMethod = "CASH",
    transactionId,
    chequeNo,
    remarks,
  } = receipt;

  const {
    name: schoolName = "Sri Vidya High School",
    address: schoolAddress = "Main Road, Rajyampet, Andhra Pradesh - 516115",
    phone: schoolPhone = "9876543210",
    email: schoolEmail = "admin@srividya.edu.in",
  } = school;

  const {
    name: studentName = "Aarav Sharma",
    admissionNo = "ADM/2024/0001",
    class: studentClass = "10",
    section = "A",
    fatherName = "Rajesh Sharma",
  } = student;

  function handlePrint() {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Fee Receipt - ${receiptNo}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #000; background: #fff; }
            .receipt { max-width: 600px; margin: 20px auto; padding: 20px; border: 2px solid #000; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
            .header h1 { font-size: 20px; font-weight: bold; }
            .header p { font-size: 11px; color: #444; }
            .receipt-no { display: flex; justify-content: space-between; margin-bottom: 16px; }
            .receipt-no span { font-size: 12px; }
            .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 16px; margin-bottom: 14px; }
            .info-row { display: flex; gap: 8px; font-size: 12px; }
            .info-label { color: #666; min-width: 80px; }
            .info-value { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
            th { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; text-align: left; padding: 6px 8px; background: #f5f5f5; border: 1px solid #ddd; }
            td { font-size: 12px; padding: 6px 8px; border: 1px solid #ddd; }
            .total-row td { font-weight: bold; background: #f5f5f5; }
            .amount-words { font-size: 11px; color: #444; margin-bottom: 16px; padding: 8px; background: #f9f9f9; border: 1px solid #ddd; }
            .footer { display: flex; justify-content: space-between; margin-top: 24px; font-size: 11px; }
            .signature { text-align: center; border-top: 1px solid #000; padding-top: 4px; width: 140px; }
            .thank-you { text-align: center; margin-top: 16px; font-size: 12px; color: #444; border-top: 1px dashed #999; padding-top: 10px; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Fee Receipt Generated</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{receiptNo}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 pt-4 pb-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* Receipt Content */}
        <div className="px-6 pb-6">
          <div ref={printRef}>
            <div className="receipt border-2 border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white">
              {/* School Header */}
              <div className="header bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-5 text-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-xl font-bold">{schoolName}</h1>
                </div>
                <p className="text-blue-100 text-xs">{schoolAddress}</p>
                <p className="text-blue-100 text-xs mt-0.5">Ph: {schoolPhone} | {schoolEmail}</p>
              </div>

              {/* Receipt Title */}
              <div className="bg-slate-50 dark:bg-slate-800 border-b-2 border-t-2 border-dashed border-slate-300 dark:border-slate-600 px-6 py-2 text-center">
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 tracking-widest uppercase">
                  Fee Collection Receipt
                </p>
              </div>

              <div className="p-6 space-y-5">
                {/* Receipt No + Date */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receipt Number</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{receiptNo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{date}</p>
                    <p className="text-xs text-slate-400">{time}</p>
                  </div>
                </div>

                {/* Student Info */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Student Details</p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {[
                      { label: "Student Name", value: studentName },
                      { label: "Admission No.", value: admissionNo },
                      { label: "Class & Section", value: `Class ${studentClass}-${section}` },
                      { label: "Father's Name", value: fatherName },
                    ].map((item) => (
                      <div key={item.label} className="info-row">
                        <div>
                          <p className="text-[10px] text-slate-400">{item.label}</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fee Breakdown Table */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Fee Breakdown</p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800">
                          <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                          <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {feeItems.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{item.category}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white text-right">₹{item.amount.toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-50 dark:bg-emerald-500/10 font-bold">
                          <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">Total Amount Paid</td>
                          <td className="px-4 py-3 text-base font-bold text-emerald-600 dark:text-emerald-400 text-right">₹{totalAmount.toLocaleString("en-IN")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Amount in words */}
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount in Words</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {amountToWords(totalAmount)} Rupees Only
                  </p>
                </div>

                {/* Payment Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {METHOD_LABELS[paymentMethod] || paymentMethod}
                    </span>
                  </div>
                  {transactionId && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                      <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{transactionId}</p>
                    </div>
                  )}
                  {chequeNo && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cheque No.</p>
                      <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{chequeNo}</p>
                    </div>
                  )}
                  {remarks && (
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Remarks</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{remarks}</p>
                    </div>
                  )}
                </div>

                {/* Signature Row */}
                <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
                  <div className="text-center">
                    <div className="w-28 border-t-2 border-slate-400 pt-1 mx-auto">
                      <p className="text-[10px] text-slate-400 font-medium">Received By</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">PAID</span>
                    </div>
                    <div className="w-28 border-t-2 border-slate-400 pt-1 mx-auto">
                      <p className="text-[10px] text-slate-400 font-medium">Authorized Signature</p>
                    </div>
                  </div>
                </div>

                {/* Thank you */}
                <div className="text-center pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    🙏 Thank you for your payment!
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This is a computer-generated receipt. No signature required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}