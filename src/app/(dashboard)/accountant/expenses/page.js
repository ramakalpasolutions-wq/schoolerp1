// src/app/(dashboard)/accountant/expenses/page.js

"use client";

import { useState, useMemo } from "react";
import {
  Wallet, Plus, Search, X, Download, Filter,
  ChevronDown, Trash2, Pencil, Loader2, CheckCircle2,
  AlertTriangle, Calendar, TrendingDown, ArrowUpRight,
  FileText, Zap, Building2, Lightbulb, Wrench, Users,
  ShoppingCart, MoreHorizontal,
} from "lucide-react";

// ── Mock expense data ────────────────────────────────────────────
const MOCK_EXPENSES = [
  { id: "EXP001", title: "Electricity Bill", category: "UTILITIES", amount: 8500, date: "2025-03-15", description: "Monthly electricity bill for school campus", receipt: null, createdBy: "Admin" },
  { id: "EXP002", title: "Office Supplies", category: "SUPPLIES", amount: 2300, date: "2025-03-14", description: "Stationery, pens, papers for office use", receipt: null, createdBy: "Admin" },
  { id: "EXP003", title: "Maintenance - Plumbing", category: "MAINTENANCE", amount: 5600, date: "2025-03-12", description: "Bathroom plumbing repair work", receipt: null, createdBy: "Admin" },
  { id: "EXP004", title: "Water Bill", category: "UTILITIES", amount: 1800, date: "2025-03-10", description: "Monthly water supply bill", receipt: null, createdBy: "Admin" },
  { id: "EXP005", title: "Lab Chemicals", category: "SUPPLIES", amount: 12000, date: "2025-03-08", description: "Science lab chemicals and equipment", receipt: null, createdBy: "Admin" },
  { id: "EXP006", title: "Classroom Furniture", category: "INFRASTRUCTURE", amount: 35000, date: "2025-03-05", description: "New desks and chairs for Class 6-A", receipt: null, createdBy: "Admin" },
  { id: "EXP007", title: "Printing & Xerox", category: "SUPPLIES", amount: 1500, date: "2025-03-04", description: "Exam papers and circulars printing", receipt: null, createdBy: "Admin" },
  { id: "EXP008", title: "Staff Refreshments", category: "MISCELLANEOUS", amount: 3200, date: "2025-03-01", description: "Tea/coffee for staff room", receipt: null, createdBy: "Admin" },
  { id: "EXP009", title: "Security Guard Salary", category: "SALARY", amount: 18000, date: "2025-02-28", description: "Monthly salary for 2 security guards", receipt: null, createdBy: "Admin" },
  { id: "EXP010", title: "Whiteboard Markers", category: "SUPPLIES", amount: 800, date: "2025-02-25", description: "Bulk purchase of markers", receipt: null, createdBy: "Admin" },
  { id: "EXP011", title: "Internet Bill", category: "UTILITIES", amount: 2999, date: "2025-02-20", description: "Broadband internet monthly bill", receipt: null, createdBy: "Admin" },
  { id: "EXP012", title: "Sports Equipment", category: "SUPPLIES", amount: 8500, date: "2025-02-15", description: "Cricket bat, ball, nets for sports day", receipt: null, createdBy: "Admin" },
];

const CATEGORIES = [
  { value: "UTILITIES", label: "Utilities", icon: Lightbulb, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { value: "SUPPLIES", label: "Supplies", icon: ShoppingCart, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { value: "MAINTENANCE", label: "Maintenance", icon: Wrench, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" },
  { value: "SALARY", label: "Salary", icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { value: "INFRASTRUCTURE", label: "Infrastructure", icon: Building2, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
  { value: "MISCELLANEOUS", label: "Miscellaneous", icon: MoreHorizontal, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-800" },
];

function getCategoryConfig(cat) {
  return CATEGORIES.find((c) => c.value === cat) || CATEGORIES[5];
}

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

// ── Add Expense Modal ─────────────────────────────────────────────
function AddExpenseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    title: "", category: "", amount: "", date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.category) errs.category = "Category is required";
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = "Valid amount required";
    if (!form.date) errs.date = "Date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    onAdd({
      id: `EXP${Date.now()}`,
      ...form,
      amount: parseFloat(form.amount),
      receipt: null,
      createdBy: "Admin",
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Expense</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Title <span className="text-red-500">*</span></label>
            <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Electricity Bill" className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${errors.title ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`} />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Category <span className="text-red-500">*</span></label>
            <div className="relative">
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className={`w-full pl-3.5 pr-9 py-3 rounded-xl border-2 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all ${errors.category ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Amount (₹) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} placeholder="0" className={`w-full pl-8 pr-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold outline-none transition-all ${errors.amount ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`} />
              </div>
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Date <span className="text-red-500">*</span></label>
              <input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={2} placeholder="Additional details..." className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all active:scale-95">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function ExpensesPage() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterMonth, setFilterMonth] = useState("ALL");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Filter ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...expenses];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((e) => e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
    }
    if (filterCategory !== "ALL") data = data.filter((e) => e.category === filterCategory);
    if (filterMonth !== "ALL") data = data.filter((e) => e.date.startsWith(filterMonth));
    return data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, search, filterCategory, filterMonth]);

  // ── Stats ─────────────────────────────────────────────────────
  const totalThisMonth = expenses.filter((e) => e.date.startsWith("2025-03")).reduce((s, e) => s + e.amount, 0);
  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);

  const categoryTotals = CATEGORIES.map((cat) => ({
    ...cat,
    total: expenses.filter((e) => e.category === cat.value).reduce((s, e) => s + e.amount, 0),
  })).sort((a, b) => b.total - a.total);

  function handleDelete(id) {
    setExpenses((p) => p.filter((e) => e.id !== id));
    setDeleteTarget(null);
  }

  const months = [...new Set(expenses.map((e) => e.date.slice(0, 7)))].sort().reverse();

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Expenses</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage school expenses</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "This Month", value: formatCurrency(totalThisMonth), icon: Calendar, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
            { label: "Total Expenses", value: formatCurrency(totalAll), icon: Wallet, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
            { label: "Transactions", value: expenses.length, icon: FileText, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20" },
            { label: "Avg per Month", value: formatCurrency(Math.round(totalAll / (months.length || 1))), icon: TrendingDown, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${stat.bg}`}>
              <div className="w-11 h-11 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">Expense by Category</h3>
          <div className="space-y-3">
            {categoryTotals.filter((c) => c.total > 0).map((cat) => {
              const pct = Math.round((cat.total / totalAll) * 100);
              const Icon = cat.icon;
              return (
                <div key={cat.value}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${cat.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(cat.total)}</span>
                      <span className="text-[11px] text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${cat.color.replace("text-", "bg-").replace(" dark:text-", " dark:bg-").split(" ")[0]}`} style={{ width: `${pct}%`, backgroundColor: undefined }}>
                      <div className="h-full w-full bg-current" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all">
                <option value="ALL">All Categories</option>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all">
                <option value="ALL">All Months</option>
                {months.map((m) => <option key={m} value={m}>{new Date(m + "-01").toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Expense Records</h3>
            <span className="text-xs text-slate-400">{filtered.length} records</span>
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  {["Title", "Category", "Amount", "Date", "Description", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((exp) => {
                  const catCfg = getCategoryConfig(exp.category);
                  const CatIcon = catCfg.icon;
                  return (
                    <tr key={exp.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${catCfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <CatIcon className={`w-4 h-4 ${catCfg.color}`} />
                          </div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{exp.title}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${catCfg.bg} ${catCfg.color}`}>
                          {catCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-base font-bold text-red-600 dark:text-red-400">-{formatCurrency(exp.amount)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-[12px] text-slate-400 dark:text-slate-500 truncate max-w-[200px]">
                          {exp.description || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(exp.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
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
                <Wallet className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-semibold">No expenses found</p>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((exp) => {
              const catCfg = getCategoryConfig(exp.category);
              const CatIcon = catCfg.icon;
              return (
                <div key={exp.id} className="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className={`w-10 h-10 rounded-xl ${catCfg.bg} flex items-center justify-center flex-shrink-0`}>
                    <CatIcon className={`w-5 h-5 ${catCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{exp.title}</p>
                    <p className="text-[11px] text-slate-400">
                      {catCfg.label} • {new Date(exp.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-red-600 dark:text-red-400">-{formatCurrency(exp.amount)}</p>
                    <button onClick={() => setDeleteTarget(exp.id)} className="text-[10px] text-slate-400 hover:text-red-500 transition-colors">Remove</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filtered.length} expense{filtered.length !== 1 ? "s" : ""} shown
              </span>
              <span className="text-base font-bold text-red-600 dark:text-red-400">
                Total: -{formatCurrency(filtered.reduce((s, e) => s + e.amount, 0))}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <AddExpenseModal
          onClose={() => setShowAdd(false)}
          onAdd={(exp) => setExpenses((p) => [exp, ...p])}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Delete Expense</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">This expense record will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}