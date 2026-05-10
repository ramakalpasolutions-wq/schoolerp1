// src/app/(dashboard)/admin/reports/page.js

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3, Download, IndianRupee, TrendingUp, Wallet,
  Users, Calendar, FileText, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, Search, X, ChevronDown,
  AlertCircle, Clock, Target, BookOpen, GraduationCap,
  CheckSquare,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
  PieChart, Pie,
} from "recharts";
import SafeChart from "@/components/shared/SafeChart";
// import SafeChart from "../../../../components/shared/SafeChart";

// ── Mock data ────────────────────────────────────────────────────
const monthlyFees = [
  { month: "Oct", collected: 210000, target: 350000, pending: 140000 },
  { month: "Nov", collected: 280000, target: 350000, pending: 70000 },
  { month: "Dec", collected: 190000, target: 350000, pending: 160000 },
  { month: "Jan", collected: 320000, target: 350000, pending: 30000 },
  { month: "Feb", collected: 295000, target: 350000, pending: 55000 },
  { month: "Mar", collected: 245000, target: 350000, pending: 105000 },
];

const attendanceTrend = [
  { week: "Week 1", pct: 92, present: 1150, absent: 100 },
  { week: "Week 2", pct: 88, present: 1100, absent: 150 },
  { week: "Week 3", pct: 85, present: 1063, absent: 187 },
  { week: "Week 4", pct: 91, present: 1138, absent: 112 },
  { week: "Week 5", pct: 87, present: 1088, absent: 162 },
  { week: "Week 6", pct: 89, present: 1113, absent: 137 },
];

const feeBreakdown = [
  { name: "Tuition", value: 245000, color: "#3b82f6" },
  { name: "Transport", value: 42000, color: "#10b981" },
  { name: "Lab", value: 18000, color: "#8b5cf6" },
  { name: "Library", value: 5000, color: "#f59e0b" },
];

const classWiseFee = [
  { class: "6-A", collected: 280000, pending: 42000, pct: 87 },
  { class: "6-B", collected: 264000, pending: 66000, pct: 80 },
  { class: "7-A", collected: 304000, pending: 76000, pct: 80 },
  { class: "8-A", collected: 280000, pending: 120000, pct: 70 },
  { class: "9-A", collected: 405000, pending: 45000, pct: 90 },
  { class: "9-B", collected: 344000, pending: 86000, pct: 80 },
  { class: "10-A", collected: 480000, pending: 120000, pct: 80 },
  { class: "10-B", collected: 322000, pending: 138000, pct: 70 },
];

const defaultersList = [
  { id: 1, name: "Aarav Sharma", class: "10-A", admNo: "ADM/2024/0001", amount: 14000, daysOverdue: 76, phone: "9876543210" },
  { id: 2, name: "Priya Reddy", class: "9-B", admNo: "ADM/2024/0002", amount: 9000, daysOverdue: 67, phone: "9876543211" },
  { id: 3, name: "Karthik Kumar", class: "8-A", admNo: "ADM/2024/0003", amount: 6500, daysOverdue: 45, phone: "9876543212" },
  { id: 4, name: "Sneha Patel", class: "7-A", admNo: "ADM/2024/0004", amount: 3000, daysOverdue: 17, phone: "9876543213" },
  { id: 5, name: "Ravi Nair", class: "10-B", admNo: "ADM/2024/0005", amount: 8000, daysOverdue: 3, phone: "9876543214" },
];

const examResults = [
  { exam: "Unit Test 1", class: "10-A", appeared: 45, passed: 42, failed: 3, avgMarks: 68, topScore: 92 },
  { exam: "Unit Test 1", class: "9-A", appeared: 42, passed: 38, failed: 4, avgMarks: 65, topScore: 88 },
  { exam: "Mid-Term", class: "10-A", appeared: 45, passed: 40, failed: 5, avgMarks: 72, topScore: 95 },
  { exam: "Mid-Term", class: "9-B", appeared: 43, passed: 39, failed: 4, avgMarks: 69, topScore: 91 },
];

// ── Helpers ──────────────────────────────────────────────────────
function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl min-w-[160px]">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.fill || p.color || p.stroke }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {typeof p.value === "number" && p.value > 1000
              ? formatCurrency(p.value)
              : typeof p.value === "number" && p.name?.toLowerCase().includes("pct")
              ? `${p.value}%`
              : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
      <p className="text-xs font-bold mb-1" style={{ color: payload[0].payload.color }}>
        {payload[0].name}
      </p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

// ── Report Type Quick Links ───────────────────────────────────────
const QUICK_REPORTS = [
  { label: "Fee Collection", icon: IndianRupee, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20", tab: "fees" },
  { label: "Attendance", icon: CheckSquare, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20", tab: "attendance" },
  { label: "Exam Results", icon: GraduationCap, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20", tab: "exams" },
  { label: "Fee Defaulters", icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20", tab: "defaulters" },
];

const TABS = [
  { id: "fees", label: "Fee Reports" },
  { id: "attendance", label: "Attendance" },
  { id: "exams", label: "Exam Results" },
  { id: "defaulters", label: "Defaulters" },
];

// ════════════════════════════════════════════════════════════════
export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState("fees");
  const [startDate, setStartDate] = useState("2024-10-01");
  const [endDate, setEndDate] = useState("2025-03-31");
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All");

  const totalCollected = monthlyFees.reduce((s, m) => s + m.collected, 0);
  const totalTarget = monthlyFees.reduce((s, m) => s + m.target, 0);
  const totalPending = monthlyFees.reduce((s, m) => s + m.pending, 0);
  const collectionRate = Math.round((totalCollected / totalTarget) * 100);

  const filteredDefaulters = defaultersList.filter((d) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!d.name.toLowerCase().includes(q) && !d.admNo.toLowerCase().includes(q)) return false;
    }
    if (filterClass !== "All" && d.class !== filterClass) return false;
    return true;
  });

  const defaulterClasses = ["All", ...new Set(defaultersList.map((d) => d.class))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-blue-500" />
            Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive analytics and insights
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Quick Report Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUICK_REPORTS.map((r) => (
          <button
            key={r.tab}
            onClick={() => setActiveTab(r.tab)}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg text-left ${r.bg} ${activeTab === r.tab ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900" : ""}`}
          >
            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <r.icon className={`w-5 h-5 ${r.color}`} />
            </div>
            <span className={`text-sm font-bold leading-tight ${r.color}`}>{r.label}</span>
          </button>
        ))}
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex gap-3 flex-1">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── FEE REPORTS TAB ──────────────────────────────────────── */}
      {activeTab === "fees" && (
        <div className="space-y-5">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Collected", value: formatCurrency(totalCollected), color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20", trend: "+12.5%", up: true },
              { label: "Total Pending", value: formatCurrency(totalPending), color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20", trend: "-8%", up: false },
              { label: "Collection Rate", value: `${collectionRate}%`, color: collectionRate >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20", trend: "+5%", up: true },
              { label: "Monthly Target", value: formatCurrency(totalTarget / 6), color: "text-blue-600 dark:text-blue-400", bg: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700", trend: "Set", up: null },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center justify-between p-4 rounded-2xl border ${stat.bg}`}>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
                  {stat.up !== null && (
                    <div className="flex items-center gap-1 mt-1">
                      {stat.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                      <span className={`text-[11px] font-semibold ${stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{stat.trend}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Monthly Bar Chart */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
                Monthly Collection vs Target
              </h3>
              <SafeChart height={260}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyFees} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} formatter={(val) => val === "collected" ? "Collected" : "Target"} />
                    <Bar dataKey="target" name="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="collected" name="collected" radius={[4, 4, 0, 0]} maxBarSize={24}>
                      {monthlyFees.map((_, i) => (
                        <Cell key={i} fill={i === monthlyFees.length - 1 ? "#10b981" : "#34d399"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </SafeChart>
            </div>

            {/* Pie Chart */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
                Fee Category Split
              </h3>
              <SafeChart height={200}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feeBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {feeBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </SafeChart>
              <div className="space-y-2 mt-3">
                {feeBreakdown.map((item) => {
                  const total = feeBreakdown.reduce((s, x) => s + x.value, 0);
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-[12px] text-slate-600 dark:text-slate-400">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-slate-900 dark:text-white">{formatCurrency(item.value)}</span>
                        <span className="text-[10px] text-slate-400">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Class-wise Fee Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Class-wise Fee Collection</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    {["Class", "Collected", "Pending", "Collection Rate", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {classWiseFee.map((row) => (
                    <tr key={row.class} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white">{row.class}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(row.collected)}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(row.pending)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${row.pct >= 80 ? "bg-emerald-500" : row.pct >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                          <span className={`text-sm font-bold ${row.pct >= 80 ? "text-emerald-600 dark:text-emerald-400" : row.pct >= 70 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                            {row.pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${row.pct >= 80 ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : row.pct >= 70 ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"}`}>
                          {row.pct >= 80 ? "✓ Good" : row.pct >= 70 ? "⚠ Average" : "✗ Low"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 border-t-2 border-slate-200 dark:border-slate-700">
                    <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">Total</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(classWiseFee.reduce((s, c) => s + c.collected, 0))}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(classWiseFee.reduce((s, c) => s + c.pending, 0))}
                    </td>
                    <td colSpan={2} className="px-4 py-3">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{collectionRate}% overall</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE TAB ──────────────────────────────────────── */}
      {activeTab === "attendance" && (
        <div className="space-y-5">
          {/* Attendance KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Avg Attendance", value: "88.5%", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
              { label: "Classes Marked", value: "22/24", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
              { label: "Avg Absent/Day", value: "142", color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20" },
              { label: "Below 75%", value: "23 students", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center justify-between p-4 rounded-2xl border ${stat.bg}`}>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Attendance Trend Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
              Weekly Attendance Trend
            </h3>
            <SafeChart height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" domain={[75, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="pct"
                    name="Attendance %"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </SafeChart>
          </div>

          {/* Attendance Summary Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Weekly Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    {["Week", "Present", "Absent", "Attendance %", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendanceTrend.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white">{row.week}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{row.present.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400">{row.absent}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${row.pct >= 90 ? "bg-emerald-500" : row.pct >= 80 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${row.pct}%` }} />
                          </div>
                          <span className={`text-sm font-bold ${row.pct >= 90 ? "text-emerald-600 dark:text-emerald-400" : row.pct >= 80 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>{row.pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${row.pct >= 90 ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : row.pct >= 80 ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
                          {row.pct >= 90 ? "Excellent" : row.pct >= 80 ? "Good" : "Average"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── EXAM RESULTS TAB ────────────────────────────────────── */}
      {activeTab === "exams" && (
        <div className="space-y-5">
          {/* Exam KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Exams Conducted", value: "4", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
              { label: "Avg Pass %", value: `${Math.round(examResults.reduce((s, e) => s + (e.passed / e.appeared) * 100, 0) / examResults.length)}%`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
              { label: "Avg Score", value: `${Math.round(examResults.reduce((s, e) => s + e.avgMarks, 0) / examResults.length)}/100`, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
              { label: "Top Score", value: `${Math.max(...examResults.map((e) => e.topScore))}/100`, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center justify-between p-4 rounded-2xl border ${stat.bg}`}>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Exam Results Chart */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
              Pass vs Fail Comparison
            </h3>
            <SafeChart height={260}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={examResults.map((e) => ({
                    name: `${e.exam} ${e.class}`,
                    passed: e.passed,
                    failed: e.failed,
                  }))}
                  margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(148,163,184,0.06)" }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="passed" name="passed" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="failed" name="failed" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </SafeChart>
          </div>

          {/* Exam Results Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Exam Results Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    {["Exam", "Class", "Appeared", "Passed", "Failed", "Pass %", "Avg Score", "Top Score"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {examResults.map((e, i) => {
                    const passPct = Math.round((e.passed / e.appeared) * 100);
                    return (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white whitespace-nowrap">{e.exam}</td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg">{e.class}</span>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300 font-semibold">{e.appeared}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">{e.passed}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-red-600 dark:text-red-400">{e.failed}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-bold ${passPct >= 90 ? "text-emerald-600 dark:text-emerald-400" : passPct >= 75 ? "text-blue-600 dark:text-blue-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {passPct}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{e.avgMarks}/100</td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{e.topScore}/100 🏆</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── DEFAULTERS TAB ──────────────────────────────────────── */}
      {activeTab === "defaulters" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or admission number..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all"
              >
                {defaulterClasses.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Classes" : `Class ${c}`}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Alert Banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700 dark:text-red-300">
                {defaultersList.length} students have pending/overdue fees
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                Total outstanding: ₹{defaultersList.reduce((s, d) => s + d.amount, 0).toLocaleString()} • Send bulk reminders from the Fees page
              </p>
            </div>
          </div>

          {/* Defaulters Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Fee Defaulters</h3>
              <Link
                href="/admin/fees/pending"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View & Send Reminders <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    {["Student", "Class", "Pending", "Overdue Days", "Phone", "Action"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredDefaulters.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[11px] font-bold">
                              {d.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{d.name}</p>
                            <p className="text-[11px] text-slate-400">{d.admNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg">{d.class}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">₹{d.amount.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${d.daysOverdue >= 60 ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400" : d.daysOverdue >= 30 ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {d.daysOverdue > 0 ? `${d.daysOverdue} days` : "Due now"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{d.phone}</td>
                      <td className="px-4 py-4">
                        <Link
                          href={`/accountant/fees/collect`}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors whitespace-nowrap"
                        >
                          <IndianRupee className="w-3 h-3" /> Collect
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredDefaulters.length === 0 && (
                <div className="flex flex-col items-center py-12 text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mb-2 opacity-30" />
                  <p className="text-sm font-medium">No defaulters found</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredDefaulters.length > 0 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredDefaulters.length} defaulters
                </span>
                <span className="text-base font-bold text-red-600 dark:text-red-400">
                  Total: ₹{filteredDefaulters.reduce((s, d) => s + d.amount, 0).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}