// src/app/(dashboard)/accountant/fees/collect/page.js

"use client";

import { useState, useEffect } from "react";
import {
  Search,
  IndianRupee,
  User,
  Phone,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  FileText,
  Calendar,
  ChevronDown,
  GraduationCap,
  Hash,
  Clock,
  ArrowRight,
} from "lucide-react";
// import FeeReceipt from "../../../../../components/fees/FeeReceipt";
import FeeReceipt from "@/components/fees/FeeReceipt";

// ── Mock search data ─────────────────────────────────────────────
const MOCK_STUDENTS = [
  {
    id: "STU0001",
    name: "Aarav Sharma",
    admissionNo: "ADM/2024/0001",
    class: "10",
    section: "A",
    rollNo: 5,
    photo: null,
    fatherName: "Rajesh Sharma",
    fatherPhone: "9876543210",
    pendingFees: [
      { id: "F1", category: "Tuition Fee", amount: 12000, dueDate: "2025-01-01", status: "PENDING" },
      { id: "F2", category: "Transport Fee", amount: 2000, dueDate: "2025-01-01", status: "PENDING" },
      { id: "F3", category: "Lab Fee", amount: 2500, dueDate: "2025-03-01", status: "OVERDUE" },
    ],
  },
  {
    id: "STU0002",
    name: "Priya Reddy",
    admissionNo: "ADM/2024/0002",
    class: "9",
    section: "B",
    rollNo: 12,
    photo: null,
    fatherName: "Suresh Reddy",
    fatherPhone: "9876543211",
    pendingFees: [
      { id: "F4", category: "Tuition Fee", amount: 8000, dueDate: "2025-02-01", status: "OVERDUE" },
      { id: "F5", category: "Library Fee", amount: 1000, dueDate: "2025-02-01", status: "PENDING" },
    ],
  },
  {
    id: "STU0003",
    name: "Karthik Kumar",
    admissionNo: "ADM/2024/0003",
    class: "8",
    section: "A",
    rollNo: 8,
    photo: null,
    fatherName: "Ravi Kumar",
    fatherPhone: "9876543212",
    pendingFees: [
      { id: "F6", category: "Tuition Fee", amount: 6500, dueDate: "2025-03-01", status: "PENDING" },
    ],
  },
];

const PAYMENT_METHODS = [
  { id: "CASH", label: "Cash", icon: Banknote, color: "emerald" },
  { id: "ONLINE", label: "Online/UPI", icon: Smartphone, color: "blue" },
  { id: "CHEQUE", label: "Cheque", icon: FileText, color: "purple" },
  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2, color: "indigo" },
];

const feeStatusConfig = {
  PENDING: { label: "Pending", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400" },
  OVERDUE: { label: "Overdue", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400" },
  PAID: { label: "Paid", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
};

// ════════════════════════════════════════════════════════════════
export default function FeeCollectionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFees, setSelectedFees] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [errors, setErrors] = useState({});

  // ── Search ────────────────────────────────────────────────────
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = MOCK_STUDENTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.admissionNo.toLowerCase().includes(q) ||
        s.fatherPhone.includes(q)
    );
    setSearchResults(results);
    setShowResults(true);
  }, [searchQuery]);

  function selectStudent(student) {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setShowResults(false);
    setSelectedFees(student.pendingFees.map((f) => f.id));
    const total = student.pendingFees.reduce((s, f) => s + f.amount, 0);
    setPaymentAmount(total.toString());
    setErrors({});
  }

  function clearStudent() {
    setSelectedStudent(null);
    setSearchQuery("");
    setSelectedFees([]);
    setPaymentAmount("");
    setErrors({});
  }

  function toggleFee(id) {
    const updated = selectedFees.includes(id)
      ? selectedFees.filter((f) => f !== id)
      : [...selectedFees, id];
    setSelectedFees(updated);
    if (selectedStudent) {
      const total = selectedStudent.pendingFees
        .filter((f) => updated.includes(f.id))
        .reduce((s, f) => s + f.amount, 0);
      setPaymentAmount(total.toString());
    }
  }

  const selectedFeeItems = selectedStudent?.pendingFees.filter((f) => selectedFees.includes(f.id)) || [];
  const totalPending = selectedStudent?.pendingFees.reduce((s, f) => s + f.amount, 0) || 0;

  // ── Validate ──────────────────────────────────────────────────
  function validate() {
    const errs = {};
    if (!selectedStudent) errs.student = "Please select a student";
    if (selectedFees.length === 0) errs.fees = "Select at least one fee";
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) errs.amount = "Enter valid amount";
    if (parseFloat(paymentAmount) > totalPending) errs.amount = "Amount exceeds pending total";
    if (paymentMethod === "ONLINE" && !transactionId) errs.transactionId = "Transaction ID required";
    if (paymentMethod === "CHEQUE" && !chequeNo) errs.chequeNo = "Cheque number required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Collect Payment ───────────────────────────────────────────
  async function handleCollect() {
    if (!validate()) return;
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);

    // Build receipt
    const receipt = {
      receiptNo: `RCP/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date(paymentDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      feeItems: selectedFeeItems.map((f) => ({ category: f.category, amount: f.amount })),
      totalAmount: parseFloat(paymentAmount),
      paymentMethod,
      transactionId: transactionId || undefined,
      chequeNo: chequeNo || undefined,
      remarks: remarks || undefined,
    };

    setReceiptData(receipt);
    setShowReceipt(true);
  }

  const colorMap = {
    emerald: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
    purple: "border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300",
    indigo: "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Collect Fee Payment
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search student → Select fees → Collect payment → Print receipt
          </p>
        </div>

        {/* Step 1 — Search Student */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Find Student</h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, admission number, or phone..."
              className={`w-full pl-10 pr-10 py-3 rounded-xl border-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all ${
                errors.student ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              }`}
            />
            {selectedStudent && (
              <button onClick={clearStudent} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                {searchResults.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => selectStudent(student)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-xs font-bold">{student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
                      <p className="text-[11px] text-slate-400">Class {student.class}-{student.section} • {student.admissionNo}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">
                        ₹{student.pendingFees.reduce((s, f) => s + f.amount, 0).toLocaleString()}
                      </p>
                      <p className="text-[11px] text-slate-400">pending</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.student && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.student}</p>}

          {/* Student Info Card */}
          {selectedStudent && (
            <div className="mt-4 flex items-center gap-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 animate-in slide-in-from-top-2 duration-300">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white text-lg font-bold">{selectedStudent.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-900 dark:text-white">{selectedStudent.name}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-1"><GraduationCap className="w-3 h-3" /> Class {selectedStudent.class}-{selectedStudent.section}</span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-1"><Hash className="w-3 h-3" /> {selectedStudent.admissionNo}</span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {selectedStudent.fatherPhone}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-bold text-red-600 dark:text-red-400">₹{totalPending.toLocaleString()}</p>
                <p className="text-[11px] text-slate-400">total pending</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — Select Fees */}
        {selectedStudent && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Select Fees to Collect</h3>
            </div>

            {errors.fees && <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-sm text-red-600 dark:text-red-400"><AlertCircle className="w-4 h-4 flex-shrink-0" />{errors.fees}</div>}

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    <th className="w-10 px-3 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">✓</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-3 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedStudent.pendingFees.map((fee) => {
                    const isSelected = selectedFees.includes(fee.id);
                    const sc = feeStatusConfig[fee.status];
                    return (
                      <tr key={fee.id} className={`transition-colors ${isSelected ? "bg-blue-50/70 dark:bg-blue-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"}`}>
                        <td className="px-3 py-3.5">
                          <button onClick={() => toggleFee(fee.id)} className="text-slate-300 hover:text-blue-500 transition-colors">
                            {isSelected
                              ? <CheckCircle2 className="w-5 h-5 text-blue-600" />
                              : <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                            }
                          </button>
                        </td>
                        <td className="px-3 py-3.5 text-sm font-medium text-slate-900 dark:text-white">{fee.category}</td>
                        <td className="px-3 py-3.5 text-sm font-bold text-slate-900 dark:text-white">₹{fee.amount.toLocaleString()}</td>
                        <td className="px-3 py-3.5 text-sm text-slate-500 dark:text-slate-400">
                          {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                            {sc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold">
                    <td colSpan={2} className="px-3 py-3.5 text-sm font-bold text-slate-900 dark:text-white">
                      Selected Total ({selectedFees.length} items)
                    </td>
                    <td className="px-3 py-3.5 text-base font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{selectedFeeItems.reduce((s, f) => s + f.amount, 0).toLocaleString()}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Step 3 — Payment Details */}
        {selectedStudent && selectedFees.length > 0 && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Details</h3>
            </div>

            <div className="space-y-5">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PAYMENT_METHODS.map((method) => {
                    const Icon = method.icon;
                    const active = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all ${
                          active ? colorMap[method.color] : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Amount Collecting <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all font-bold ${
                        errors.amount ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                      }`}
                    />
                  </div>
                  {errors.amount && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.amount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Payment Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all"
                  />
                </div>
              </div>

              {/* Conditional fields */}
              {paymentMethod === "ONLINE" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Transaction / UTR ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. TXN123456789"
                    className={`w-full px-3.5 py-3 rounded-xl border-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all font-mono ${
                      errors.transactionId ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                    }`}
                  />
                  {errors.transactionId && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.transactionId}</p>}
                </div>
              )}

              {paymentMethod === "CHEQUE" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Cheque Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={chequeNo}
                      onChange={(e) => setChequeNo(e.target.value)}
                      placeholder="e.g. 123456"
                      className={`w-full px-3.5 py-3 rounded-xl border-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all ${
                        errors.chequeNo ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                      }`}
                    />
                    {errors.chequeNo && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.chequeNo}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. State Bank of India"
                      className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Remarks (Optional)</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="Any additional notes..."
                  className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all resize-none"
                />
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Collecting from:</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{selectedStudent.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedFees.length} fee item{selectedFees.length > 1 ? "s" : ""} • {PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-slate-400">Total Amount</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{(parseFloat(paymentAmount) || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Collect Button */}
              <button
                onClick={handleCollect}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-base shadow-xl shadow-emerald-500/25 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isProcessing ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Processing Payment...</>
                ) : (
                  <><IndianRupee className="w-5 h-5" /> Collect ₹{(parseFloat(paymentAmount) || 0).toLocaleString()} Payment</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <FeeReceipt
          receipt={receiptData}
          student={selectedStudent}
          school={{ name: "Sri Vidya High School", address: "Main Road, Rajyampet, AP - 516115", phone: "9876543210", email: "admin@srividya.edu.in" }}
          show={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            clearStudent();
          }}
        />
      )}
    </>
  );
}