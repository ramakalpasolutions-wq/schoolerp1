// src/app/(dashboard)/accountant/reports/page.js

"use client";

import { useState } from "react";
import {
  BarChart3, Download, IndianRupee, TrendingUp, Wallet,
  Users, Calendar, FileText, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

const monthlyFees = [
  { month: "Oct", collected: 210000, expenses: 85000 },
  { month: "Nov", collected: 280000, expenses: 92000 },
  { month: "Dec", collected: 190000, expenses: 78000 },
  { month: "Jan", collected: 320000, expenses: 110000 },
  { month: "Feb", collected: 295000, expenses: 95000 },
  { month: "Mar", collected: 245000, expenses: 88000 },
];

const feeBreakdown = [
  { name: "Tuition", value: 180000, color: "#3b82f6" },
  { name: "Transport", value: 42000, color: "#10b981" },
  { name: "Lab", value: 18000, color: "#8b5cf6" },
  { name: "Library", value: 5000, color: "#f59e0b" },
];

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
      <p className="text-xs font-bold mb-1" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function AccountantReportsPage() {
  const [startDate, setStartDate] = useState("2025-03-01");
  const [endDate, setEndDate] = useState("2025-03-31");

  const totalFees = monthlyFees.reduce((s, m) => s + m.collected, 0);
  const totalExpenses = monthlyFees.reduce((s, m) => s + m.expenses, 0);
  const netBalance = totalFees - totalExpenses;

  const financeSummary = [
    { label: "Total Fee Collected", value: formatCurrency(totalFees), icon: IndianRupee, trend: "+18%", up: true, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
    { label: "Total Expenses", value: formatCurrency(totalExpenses), icon: Wallet, trend: "+5%", up: false, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
    { label: "Net Balance", value: formatCurrency(netBalance), icon: TrendingUp, trend: "+24%", up: true, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
    { label: "Pending Fees", value: "₹4.8L", icon: Users, trend: "-12%", up: false, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Financial Reports</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of school finances</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
            <FileText className="w-4 h-4" /> Excel
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex gap-3 flex-1">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">From Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">To Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {financeSummary.map((stat) => (
          <div key={stat.label} className={`flex items-center justify-between p-4 rounded-2xl border ${stat.bg}`}>
            <div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {stat.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                <span className={`text-[11px] font-semibold ${stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{stat.trend}</span>
              </div>
            </div>
            <div className={`w-11 h-11 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue vs Expenses */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
            Fee Collection vs Expenses (6 Months)
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFees} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "transparent" }} />
                <Bar dataKey="collected" name="collected" radius={[4, 4, 0, 0]} maxBarSize={24}>
                  {monthlyFees.map((_, i) => <Cell key={i} fill="#10b981" />)}
                </Bar>
                <Bar dataKey="expenses" name="expenses" radius={[4, 4, 0, 0]} maxBarSize={24}>
                  {monthlyFees.map((_, i) => <Cell key={i} fill="#ef4444" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[{ label: "Collected", color: "bg-emerald-500" }, { label: "Expenses", color: "bg-red-500" }].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded ${l.color}`} />
                <span className="text-xs text-slate-500 dark:text-slate-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee Type Breakdown */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">Fee Category Split</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={feeBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {feeBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {feeBreakdown.map((item) => {
              const pct = Math.round((item.value / feeBreakdown.reduce((s, x) => s + x.value, 0)) * 100);
              return (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[12px] text-slate-600 dark:text-slate-400">{item.name}</span>
                  </div>
                  <span className="text-[12px] font-bold text-slate-900 dark:text-white">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Month-wise Financial Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["Month", "Fee Collected", "Expenses", "Net Balance", "Collection %"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {monthlyFees.map((row, i) => {
                const net = row.collected - row.expenses;
                const pct = Math.round((row.collected / 350000) * 100);
                return (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white">{row.month} 2025</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(row.collected)}</td>
                    <td className="px-4 py-3.5 text-sm font-semibold text-red-600 dark:text-red-400">{formatCurrency(row.expenses)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-bold ${net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {net >= 0 ? "+" : ""}{formatCurrency(net)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}