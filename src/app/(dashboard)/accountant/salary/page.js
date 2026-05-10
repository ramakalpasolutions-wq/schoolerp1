// src/app/(dashboard)/accountant/salary/page.js

"use client";

import { useState, useMemo } from "react";
import {
  IndianRupee, Download, Search, X, CheckCircle2, Clock,
  Loader2, ChevronDown, Users, TrendingUp, Filter,
  FileText, Send, Eye, AlertCircle,
} from "lucide-react";

// ── Mock salary data ──────────────────────────────────────────────
const SALARY_DATA = [
  { id: "SAL001", teacherId: "TCH001", name: "Suresh Kumar", employeeId: "EMP001", designation: "Senior Teacher", department: "Mathematics", basicSalary: 30000, allowances: 5000, deductions: 0, netSalary: 35000, month: 3, year: 2025, status: "PENDING", paidDate: null },
  { id: "SAL002", teacherId: "TCH002", name: "Radha Devi", employeeId: "EMP002", designation: "Teacher", department: "Science", basicSalary: 24000, allowances: 4000, deductions: 0, netSalary: 28000, month: 3, year: 2025, status: "PENDING", paidDate: null },
  { id: "SAL003", teacherId: "TCH003", name: "Priya Sharma", employeeId: "EMP003", designation: "Teacher", department: "English", basicSalary: 26000, allowances: 4000, deductions: 500, netSalary: 29500, month: 3, year: 2025, status: "PENDING", paidDate: null },
  { id: "SAL004", teacherId: "TCH004", name: "Ravi Nair", employeeId: "EMP004", designation: "Teacher", department: "Social Studies", basicSalary: 22000, allowances: 4000, deductions: 0, netSalary: 26000, month: 3, year: 2025, status: "PAID", paidDate: "2025-03-01" },
  { id: "SAL005", teacherId: "TCH005", name: "Lakshmi Rao", employeeId: "EMP005", designation: "Senior Teacher", department: "Telugu", basicSalary: 33000, allowances: 5000, deductions: 0, netSalary: 38000, month: 3, year: 2025, status: "PAID", paidDate: "2025-03-01" },
  { id: "SAL006", teacherId: "TCH006", name: "Venkatesh N", employeeId: "EMP006", designation: "Teacher", department: "Hindi", basicSalary: 27000, allowances: 5000, deductions: 0, netSalary: 32000, month: 3, year: 2025, status: "PENDING", paidDate: null },
  { id: "SAL007", teacherId: "TCH007", name: "Anitha R", employeeId: "EMP007", designation: "Teacher", department: "Physics", basicSalary: 20000, allowances: 4000, deductions: 0, netSalary: 24000, month: 3, year: 2025, status: "PROCESSING", paidDate: null },
  { id: "SAL008", teacherId: "TCH008", name: "Kiran Babu", employeeId: "EMP008", designation: "Teacher", department: "Computer Science", basicSalary: 28000, allowances: 4000, deductions: 0, netSalary: 32000, month: 3, year: 2025, status: "PAID", paidDate: "2025-03-02" },
];

const STATUS_CONFIG = {
  PAID: { label: "Paid", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  PENDING: { label: "Pending", bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  PROCESSING: { label: "Processing", bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
};

const MONTHS = [
  { value: "1", label: "January" }, { value: "2", label: "February" },
  { value: "3", label: "March" }, { value: "4", label: "April" },
  { value: "5", label: "May" }, { value: "6", label: "June" },
  { value: "7", label: "July" }, { value: "8", label: "August" },
  { value: "9", label: "September" }, { value: "10", label: "October" },
  { value: "11", label: "November" }, { value: "12", label: "December" },
];

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

// ── Pay Slip Modal ────────────────────────────────────────────────
function PaySlipModal({ salary, onClose, onPay }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(salary.status === "PAID");

  async function handlePay() {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPaying(false);
    setPaid(true);
    onPay(salary.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Payslip Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-5 text-center">
          <p className="text-blue-100 text-xs font-semibold uppercase tracking-widest mb-1">Salary Slip</p>
          <h3 className="text-white text-xl font-bold">Sri Vidya High School</h3>
          <p className="text-blue-200 text-xs mt-1">
            {MONTHS.find((m) => m.value === String(salary.month))?.label} {salary.year}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Employee info */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base">{salary.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900 dark:text-white">{salary.name}</p>
              <p className="text-[12px] text-slate-400">{salary.employeeId} • {salary.designation}</p>
              <p className="text-[11px] text-slate-400">{salary.department}</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-2">
            {[
              { label: "Basic Salary", value: salary.basicSalary, type: "earning" },
              { label: "Allowances", value: salary.allowances, type: "earning" },
              { label: "Deductions", value: salary.deductions, type: "deduction" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                <span className={`text-sm font-semibold ${item.type === "deduction" ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                  {item.type === "deduction" ? "-" : "+"}₹{item.value.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl px-3 mt-2">
              <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Net Salary</span>
              <span className="text-xl font-black text-blue-700 dark:text-blue-300">₹{salary.netSalary.toLocaleString()}</span>
            </div>
          </div>

          {/* Status */}
          {paid ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                Salary paid on {salary.paidDate || new Date().toLocaleDateString("en-IN")}
              </span>
            </div>
          ) : (
            <button onClick={handlePay} disabled={paying} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 transition-all active:scale-95">
              {paying ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> Pay ₹{salary.netSalary.toLocaleString()} Now</>}
            </button>
          )}

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> Download
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function SalaryPage() {
  const [salaries, setSalaries] = useState(SALARY_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedMonth, setSelectedMonth] = useState("3");
  const [selectedYear] = useState("2025");
  const [viewSalary, setViewSalary] = useState(null);
  const [payingAll, setPayingAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const filtered = useMemo(() => {
    let data = salaries.filter((s) => s.month === parseInt(selectedMonth) && s.year === parseInt(selectedYear));
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((s) => s.name.toLowerCase().includes(q) || s.employeeId.toLowerCase().includes(q));
    }
    if (filterStatus !== "ALL") data = data.filter((s) => s.status === filterStatus);
    return data;
  }, [salaries, search, filterStatus, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const monthData = salaries.filter((s) => s.month === parseInt(selectedMonth) && s.year === parseInt(selectedYear));
    return {
      total: monthData.reduce((s, x) => s + x.netSalary, 0),
      paid: monthData.filter((s) => s.status === "PAID").reduce((s, x) => s + x.netSalary, 0),
      pending: monthData.filter((s) => s.status === "PENDING").reduce((s, x) => s + x.netSalary, 0),
      paidCount: monthData.filter((s) => s.status === "PAID").length,
      pendingCount: monthData.filter((s) => s.status === "PENDING").length,
    };
  }, [salaries, selectedMonth, selectedYear]);

  function handlePay(id) {
    setSalaries((p) => p.map((s) => s.id === id ? { ...s, status: "PAID", paidDate: new Date().toLocaleDateString("en-IN") } : s));
  }

  async function handlePayAll() {
    const pendingIds = filtered.filter((s) => s.status === "PENDING").map((s) => s.id);
    if (!pendingIds.length) return;
    setPayingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSalaries((p) => p.map((s) => pendingIds.includes(s.id) ? { ...s, status: "PAID", paidDate: new Date().toLocaleDateString("en-IN") } : s));
    setPayingAll(false);
  }

  const pendingCount = filtered.filter((s) => s.status === "PENDING").length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Salary Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Process and track teacher salaries</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            {pendingCount > 0 && (
              <button
                onClick={handlePayAll}
                disabled={payingAll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 transition-all active:scale-95"
              >
                {payingAll ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : <><Send className="w-4 h-4" /> Pay All Pending ({pendingCount})</>}
              </button>
            )}
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex flex-wrap gap-2">
          {MONTHS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMonth(m.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                selectedMonth === m.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              {m.label.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Payroll", value: formatCurrency(stats.total), color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
            { label: "Paid", value: formatCurrency(stats.paid), color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
            { label: "Pending", value: formatCurrency(stats.pending), color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
            { label: "Staff Paid", value: `${stats.paidCount}/${stats.paidCount + stats.pendingCount}`, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center justify-between p-4 rounded-2xl border ${stat.bg}`}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Salary Disbursement — {MONTHS.find((m) => m.value === selectedMonth)?.label} {selectedYear}
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              {stats.paidCount}/{stats.paidCount + stats.pendingCount} paid
            </span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
              style={{ width: `${stats.paidCount + stats.pendingCount > 0 ? (stats.paidCount / (stats.paidCount + stats.pendingCount)) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>
          <div className="relative">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all">
              <option value="ALL">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Salary Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  {["Teacher", "Employee ID", "Designation", "Basic", "Allowances", "Deductions", "Net Salary", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((salary) => {
                  const sc = STATUS_CONFIG[salary.status];
                  return (
                    <tr key={salary.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[11px] font-bold">{salary.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-white whitespace-nowrap">{salary.name}</p>
                            <p className="text-[11px] text-slate-400">{salary.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[13px] font-mono text-slate-500 dark:text-slate-400">{salary.employeeId}</td>
                      <td className="px-4 py-4 text-[13px] text-slate-600 dark:text-slate-400">{salary.designation}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900 dark:text-white">₹{salary.basicSalary.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">+₹{salary.allowances.toLocaleString()}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-red-600 dark:text-red-400">-₹{salary.deductions.toLocaleString()}</td>
                      <td className="px-4 py-4 text-base font-bold text-slate-900 dark:text-white">₹{salary.netSalary.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewSalary(salary)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {salary.status === "PENDING" ? "Pay" : "View"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((salary) => {
              const sc = STATUS_CONFIG[salary.status];
              return (
                <div key={salary.id} className="p-4">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{salary.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{salary.name}</p>
                      <p className="text-[11px] text-slate-400">{salary.employeeId} • {salary.designation}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pl-12">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">₹{salary.netSalary.toLocaleString()}</span>
                    <button onClick={() => setViewSalary(salary)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[12px] font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      {salary.status === "PENDING" ? "Pay Now" : "View Slip"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer total */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-sm text-slate-500 dark:text-slate-400">{filtered.length} employees</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">
                Total: ₹{filtered.reduce((s, x) => s + x.netSalary, 0).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pay Slip Modal */}
      {viewSalary && (
        <PaySlipModal
          salary={viewSalary}
          onClose={() => setViewSalary(null)}
          onPay={(id) => { handlePay(id); }}
        />
      )}
    </>
  );
}