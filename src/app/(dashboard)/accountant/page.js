// src/app/(dashboard)/accountant/page.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IndianRupee, TrendingUp, Clock, AlertCircle, Receipt,
  Users, ChevronRight, ArrowUpRight, Wallet, BarChart3,
  CheckCircle2, Calendar, Download, Plus, Loader2, Target,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const weeklyData = [
  { day: "Mon", amount: 42000 },
  { day: "Tue", amount: 38000 },
  { day: "Wed", amount: 65000 },
  { day: "Thu", amount: 28000 },
  { day: "Fri", amount: 45000 },
];

const RECENT_TRANSACTIONS = [
  { id: 1, student: "Aarav Sharma", class: "10-A", amount: 12000, method: "UPI", category: "Tuition", time: "10:30 AM", type: "collection" },
  { id: 2, student: "Priya Reddy", class: "9-B", amount: 8500, method: "Cash", category: "Tuition", time: "09:15 AM", type: "collection" },
  { id: 3, student: "Karthik Kumar", class: "8-A", amount: 2000, method: "Online", category: "Transport", time: "11:00 AM", type: "collection" },
  { id: 4, student: "Sneha Patel", class: "7-A", amount: 14000, method: "Cheque", category: "Tuition", time: "12:30 PM", type: "collection" },
  { id: 5, student: "Ravi Nair", class: "10-B", amount: 1000, method: "Cash", category: "Library", time: "02:00 PM", type: "collection" },
  { id: 6, title: "Electricity Bill", amount: 8500, method: "Bank Transfer", category: "Utilities", time: "09:00 AM", type: "expense" },
];

const PENDING_BY_CLASS = [
  { class: "10-A", students: 12, amount: 145000 },
  { class: "9-A", students: 8, amount: 92000 },
  { class: "8-A", students: 15, amount: 178000 },
  { class: "7-A", students: 6, amount: 65000 },
];

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function AccountantDashboard() {
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const todayCollection = 45000;
  const monthTarget = 350000;
  const monthCollected = 245000;
  const collectionPct = Math.round((monthCollected / monthTarget) * 100);
  const totalExpenses = 32000;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Accountant Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{today}</p>
        </div>
        <Link
          href="/accountant/fees/collect"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Quick Collect Fee
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Today's Collection", value: formatCurrency(todayCollection), icon: IndianRupee, gradient: "from-emerald-500 to-teal-600", iconBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", sub: "28 transactions", trend: "+18% vs yesterday" },
          { title: "Monthly Collected", value: formatCurrency(monthCollected), icon: TrendingUp, gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", sub: `${collectionPct}% of target`, trend: `${formatCurrency(monthTarget - monthCollected)} remaining` },
          { title: "Pending Fees", value: "₹4.8L", icon: Clock, gradient: "from-amber-500 to-orange-600", iconBg: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", sub: "41 students", trend: "Due this month" },
          { title: "Monthly Expenses", value: formatCurrency(totalExpenses), icon: Wallet, gradient: "from-red-500 to-rose-600", iconBg: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400", sub: "8 transactions", trend: "This month" },
        ].map((card, i) =>
          loading ? (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 animate-pulse">
              <div className="flex justify-between mb-3"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" /><div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" /></div>
              <div className="w-20 h-7 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ) : (
            <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${card.gradient} opacity-[0.04] rounded-full blur-2xl`} />
              <div className="flex items-start justify-between mb-3">
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[26px] font-bold text-slate-900 dark:text-white tracking-tight">{card.value}</p>
              <p className="text-[11px] text-slate-400 mt-1">{card.sub}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">{card.trend}</p>
            </div>
          )
        )}
      </div>

      {/* Collection Progress */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-500" />
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Monthly Collection Target</h3>
          </div>
          <span className={`text-xl font-bold ${collectionPct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {collectionPct}%
          </span>
        </div>
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000" style={{ width: `${collectionPct}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{formatCurrency(monthCollected)} collected</span>
          <span className="text-slate-400">Target: {formatCurrency(monthTarget)}</span>
        </div>
      </div>

      {/* Charts + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">This Week&apos;s Collections</h3>
          {loading ? (
            <div className="h-[200px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar dataKey="amount" radius={[6, 6, 2, 2]} maxBarSize={40}>
                    {weeklyData.map((entry, i) => (
                      <Cell key={i} fill={i === weeklyData.length - 1 ? "#10b981" : "#6ee7b7"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pending by Class */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Pending by Class</h3>
            <Link href="/accountant/fees" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {PENDING_BY_CLASS.map((item) => (
              <div key={item.class} className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Class {item.class}</p>
                  <p className="text-[11px] text-slate-400">{item.students} students</p>
                </div>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(item.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Today&apos;s Transactions</h3>
          <Link href="/accountant/fees" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {RECENT_TRANSACTIONS.map((txn) => (
            <div key={txn.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${txn.type === "expense" ? "bg-red-100 dark:bg-red-500/10" : "bg-emerald-100 dark:bg-emerald-500/10"}`}>
                {txn.type === "expense" ? <Wallet className="w-4 h-4 text-red-600 dark:text-red-400" /> : <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                  {txn.student || txn.title}
                </p>
                <p className="text-[11px] text-slate-400">
                  {txn.class ? `Class ${txn.class} • ` : ""}{txn.category} • {txn.method} • {txn.time}
                </p>
              </div>
              <p className={`text-sm font-bold flex-shrink-0 ${txn.type === "expense" ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {txn.type === "expense" ? "-" : "+"}{formatCurrency(txn.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}