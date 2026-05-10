// src/app/(dashboard)/parent/fees/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, IndianRupee, CheckCircle2, Clock, AlertCircle, Phone, Download } from "lucide-react";

const FEE_DATA = {
  childName: "Arjun Reddy",
  class: "8-A",
  total: 42000, paid: 22000,
  records: [
    { category: "Tuition Fee Q1", amount: 8000, dueDate: "Jun 30, 2024", paidDate: "Jun 28, 2024", status: "PAID", receiptNo: "RCP001" },
    { category: "Transport Fee Q1", amount: 3000, dueDate: "Jun 30, 2024", paidDate: "Jun 28, 2024", status: "PAID", receiptNo: "RCP002" },
    { category: "Tuition Fee Q2", amount: 8000, dueDate: "Sep 30, 2024", paidDate: "Oct 01, 2024", status: "PAID", receiptNo: "RCP003" },
    { category: "Transport Fee Q2", amount: 3000, dueDate: "Sep 30, 2024", paidDate: "Oct 01, 2024", status: "PAID", receiptNo: "RCP004" },
    { category: "Tuition Fee Q3", amount: 8000, dueDate: "Jan 10, 2025", paidDate: null, status: "OVERDUE", receiptNo: null },
    { category: "Transport Fee Q3", amount: 3000, dueDate: "Jan 10, 2025", paidDate: null, status: "OVERDUE", receiptNo: null },
    { category: "Tuition Fee Q4", amount: 8000, dueDate: "Mar 31, 2025", paidDate: null, status: "PENDING", receiptNo: null },
    { category: "Lab Fee", amount: 1000, dueDate: "Mar 31, 2025", paidDate: null, status: "PENDING", receiptNo: null },
  ],
};

const statusConfig = {
  PAID: { label: "Paid", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
  PENDING: { label: "Pending", bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400" },
  OVERDUE: { label: "Overdue", bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400" },
};

export default function ParentFeesPage() {
  const pending = FEE_DATA.total - FEE_DATA.paid;
  const pct = Math.round((FEE_DATA.paid / FEE_DATA.total) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/parent" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fee Status</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{FEE_DATA.childName} — Class {FEE_DATA.class}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Fee", value: `₹${(FEE_DATA.total / 1000).toFixed(0)}K`, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800" },
          { label: "Paid", value: `₹${(FEE_DATA.paid / 1000).toFixed(0)}K`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Pending", value: `₹${(pending / 1000).toFixed(0)}K`, color: pending > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400", bg: pending > 0 ? "bg-red-50 dark:bg-red-500/10" : "bg-emerald-50 dark:bg-emerald-500/10" },
        ].map((s) => (
          <div key={s.label} className={`text-center p-4 rounded-2xl border border-slate-200 dark:border-slate-700 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Payment Progress</span>
          <span className={`text-sm font-bold ${pct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{pct}%</span>
        </div>
        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {pending > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Pending Fees: ₹{pending.toLocaleString()}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Please visit the school office or call 9876543210 to clear dues.</p>
            <a href="tel:9876543210" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 hover:underline">
              <Phone className="w-3.5 h-3.5" /> Call School Office
            </a>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Fee Breakdown</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FEE_DATA.records.map((fee, i) => {
            const sc = statusConfig[fee.status];
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{fee.category}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Due: {fee.dueDate} {fee.paidDate && `• Paid: ${fee.paidDate}`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">₹{fee.amount.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${sc.bg} ${sc.text}`}>{sc.label}</span>
                </div>
                {fee.receiptNo && (
                  <button className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors flex-shrink-0" title="Download Receipt">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}