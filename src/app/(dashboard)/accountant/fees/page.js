// src/app/(dashboard)/accountant/fees/page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  IndianRupee, Search, X, ChevronDown, Eye, Send,
  Download, Filter, Phone, Calendar, AlertCircle,
  CheckCircle2, Clock, ArrowRight, Plus,
} from "lucide-react";

const PENDING_FEES = [
  { id: "F001", student: "Aarav Sharma", admissionNo: "ADM/2024/0001", class: "10-A", parentPhone: "9876543210", pendingAmount: 14000, dueDate: "2025-01-01", overdueDays: 76, feeTypes: ["Tuition", "Lab Fee"] },
  { id: "F002", student: "Priya Reddy", admissionNo: "ADM/2024/0002", class: "9-B", parentPhone: "9876543211", pendingAmount: 9000, dueDate: "2025-01-10", overdueDays: 67, feeTypes: ["Tuition"] },
  { id: "F003", student: "Karthik Kumar", admissionNo: "ADM/2024/0003", class: "8-A", parentPhone: "9876543212", pendingAmount: 6500, dueDate: "2025-02-01", overdueDays: 45, feeTypes: ["Tuition", "Transport"] },
  { id: "F004", student: "Sneha Patel", admissionNo: "ADM/2024/0004", class: "7-A", parentPhone: "9876543213", pendingAmount: 3000, dueDate: "2025-03-01", overdueDays: 17, feeTypes: ["Transport"] },
  { id: "F005", student: "Ravi Nair", admissionNo: "ADM/2024/0005", class: "10-B", parentPhone: "9876543214", pendingAmount: 8000, dueDate: "2025-03-15", overdueDays: 3, feeTypes: ["Tuition"] },
  { id: "F006", student: "Ananya Singh", admissionNo: "ADM/2024/0006", class: "6-A", parentPhone: "9876543215", pendingAmount: 12000, dueDate: "2025-01-15", overdueDays: 62, feeTypes: ["Tuition", "Library"] },
  { id: "F007", student: "Vikram Rao", admissionNo: "ADM/2024/0007", class: "9-A", parentPhone: "9876543216", pendingAmount: 5500, dueDate: "2025-03-31", overdueDays: 0, feeTypes: ["Transport"] },
  { id: "F008", student: "Divya Menon", admissionNo: "ADM/2024/0008", class: "8-B", parentPhone: "9876543217", pendingAmount: 7200, dueDate: "2025-02-15", overdueDays: 31, feeTypes: ["Tuition"] },
];

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function AccountantFeesPage() {
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [filterOverdue, setFilterOverdue] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const classes = ["All", ...new Set(PENDING_FEES.map((f) => f.class))];

  const filtered = useMemo(() => {
    let data = [...PENDING_FEES];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((f) => f.student.toLowerCase().includes(q) || f.admissionNo.toLowerCase().includes(q) || f.parentPhone.includes(q));
    }
    if (filterClass !== "All") data = data.filter((f) => f.class === filterClass);
    if (filterOverdue === "30+") data = data.filter((f) => f.overdueDays >= 30);
    if (filterOverdue === "60+") data = data.filter((f) => f.overdueDays >= 60);
    if (filterOverdue === "Due") data = data.filter((f) => f.overdueDays === 0);
    return data.sort((a, b) => b.overdueDays - a.overdueDays);
  }, [search, filterClass, filterOverdue]);

  const isAllSelected = filtered.length > 0 && filtered.every((f) => selectedIds.includes(f.id));
  function toggleAll() {
    if (isAllSelected) setSelectedIds((p) => p.filter((id) => !filtered.find((f) => f.id === id)));
    else setSelectedIds((p) => [...new Set([...p, ...filtered.map((f) => f.id)])]);
  }
  function toggleOne(id) {
    setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  }

  async function handleSendReminder() {
    if (!selectedIds.length) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 2500));
    setSending(false);
    setSent(true);
    setSelectedIds([]);
    setTimeout(() => setSent(false), 4000);
  }

  const totalPending = PENDING_FEES.reduce((s, f) => s + f.pendingAmount, 0);
  const selectedTotal = PENDING_FEES.filter((f) => selectedIds.includes(f.id)).reduce((s, f) => s + f.pendingAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Pending Fees</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {PENDING_FEES.length} students • {formatCurrency(totalPending)} pending
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/accountant/fees/collect" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> Collect Fee
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Pending", value: formatCurrency(totalPending), color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
          { label: "Overdue 60+", value: PENDING_FEES.filter((f) => f.overdueDays >= 60).length, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
          { label: "Overdue 30+", value: PENDING_FEES.filter((f) => f.overdueDays >= 30).length, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20" },
          { label: "Due This Month", value: PENDING_FEES.filter((f) => f.overdueDays === 0).length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center justify-between p-3.5 rounded-xl border ${s.bg}`}>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Success/sending banner */}
      {sent && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            ✅ Fee reminders sent successfully via SMS!
          </p>
        </div>
      )}

      {/* Selected actions */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 animate-in slide-in-from-top-2">
          <div>
            <span className="text-sm font-bold text-red-700 dark:text-red-300">{selectedIds.length} students selected</span>
            <span className="text-sm text-red-600 dark:text-red-400 ml-2">• {formatCurrency(selectedTotal)} total</span>
          </div>
          <button
            onClick={handleSendReminder}
            disabled={sending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-md shadow-red-500/20 disabled:opacity-60 transition-all active:scale-95"
          >
            {sending ? <><AlertCircle className="w-4 h-4 animate-pulse" /> Sending...</> : <><Send className="w-4 h-4" /> Send Reminder</>}
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, admission no, phone..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all">
              {classes.map((c) => <option key={c} value={c}>{c === "All" ? "All Classes" : `Class ${c}`}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={filterOverdue} onChange={(e) => setFilterOverdue(e.target.value)} className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all">
              {[{ v: "All", l: "All" }, { v: "60+", l: "60+ Days Overdue" }, { v: "30+", l: "30+ Days Overdue" }, { v: "Due", l: "Due This Month" }].map((o) => (
                <option key={o.v} value={o.v}>{o.l}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <th className="w-12 px-4 py-3.5">
                  <button onClick={toggleAll} className="text-slate-400 hover:text-blue-500 transition-colors">
                    {isAllSelected
                      ? <div className="w-4.5 h-4.5 rounded bg-blue-600 flex items-center justify-center"><div className="w-2.5 h-0.5 bg-white rounded" /></div>
                      : <div className="w-4.5 h-4.5 rounded border-2 border-slate-300 dark:border-slate-600" />
                    }
                  </button>
                </th>
                {["Student", "Class", "Parent Phone", "Fee Types", "Pending", "Due Date", "Overdue", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((fee) => {
                const isSelected = selectedIds.includes(fee.id);
                return (
                  <tr key={fee.id} className={`group transition-colors ${isSelected ? "bg-red-50/60 dark:bg-red-950/15" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"}`}>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleOne(fee.id)} className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors">
                        {isSelected
                          ? <div className="w-4.5 h-4.5 rounded bg-blue-600 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                          : <div className="w-4.5 h-4.5 rounded border-2 border-slate-300 dark:border-slate-600" />
                        }
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-[11px] font-bold">{fee.student.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-white whitespace-nowrap">{fee.student}</p>
                          <p className="text-[11px] text-slate-400">{fee.admissionNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{fee.class}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5" />{fee.parentPhone}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1">
                        {fee.feeTypes.map((t) => <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-base font-bold text-red-600 dark:text-red-400">₹{fee.pendingAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(fee.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {fee.overdueDays > 0 ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                          fee.overdueDays >= 60 ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400" :
                          fee.overdueDays >= 30 ? "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400" :
                          "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        }`}>
                          {fee.overdueDays}d
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-lg">Due</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href="/accountant/fees/collect" className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" title="Collect">
                          <IndianRupee className="w-4 h-4" />
                        </Link>
                        <button onClick={() => { setSelectedIds([fee.id]); handleSendReminder(); }} className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Send Reminder">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-14 text-slate-400">
              <CheckCircle2 className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-semibold">No pending fees found</p>
            </div>
          )}
        </div>

        {/* Mobile */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.map((fee) => {
            const isSelected = selectedIds.includes(fee.id);
            return (
              <div key={fee.id} className={`p-4 ${isSelected ? "bg-red-50/60 dark:bg-red-950/15" : ""}`}>
                <div className="flex items-start gap-3 mb-2">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleOne(fee.id)} className="mt-1" />
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[11px] font-bold">{fee.student.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{fee.student}</p>
                    <p className="text-[11px] text-slate-400">Class {fee.class} • {fee.parentPhone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">₹{fee.pendingAmount.toLocaleString()}</p>
                    {fee.overdueDays > 0 && <p className="text-[10px] font-bold text-red-500">{fee.overdueDays}d overdue</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pl-12">
                  <Link href="/accountant/fees/collect" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-100 transition-colors">
                    <IndianRupee className="w-3 h-3" /> Collect
                  </Link>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-bold hover:bg-red-100 transition-colors">
                    <Send className="w-3 h-3" /> Remind
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <span className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} students</span>
            <span className="text-base font-bold text-red-600 dark:text-red-400">
              ₹{filtered.reduce((s, f) => s + f.pendingAmount, 0).toLocaleString()} total pending
            </span>
          </div>
        )}
      </div>
    </div>
  );
}