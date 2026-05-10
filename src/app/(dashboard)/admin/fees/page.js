// src/app/(dashboard)/admin/fees/page.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Clock,
  Target,
  Send,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  FileText,
  ChevronRight,
  Wallet,
  BarChart3,
  Users,
  Bell,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

// ── Data ────────────────────────────────────────────────────────
const monthlyData = [
  { month: "Oct", collected: 210000, target: 350000 },
  { month: "Nov", collected: 280000, target: 350000 },
  { month: "Dec", collected: 190000, target: 350000 },
  { month: "Jan", collected: 320000, target: 350000 },
  { month: "Feb", collected: 295000, target: 350000 },
  { month: "Mar", collected: 245000, target: 350000 },
];

const pieData = [
  { name: "Paid", value: 245000, color: "#10b981" },
  { name: "Pending", value: 85000, color: "#f59e0b" },
  { name: "Overdue", value: 35000, color: "#ef4444" },
];

const recentTransactions = [
  { id: 1, student: "Aarav Sharma", class: "10-A", amount: 12000, method: "UPI", date: "Today, 10:30 AM", type: "TUITION" },
  { id: 2, student: "Priya Reddy", class: "9-B", amount: 8500, method: "Cash", date: "Today, 9:15 AM", type: "TUITION" },
  { id: 3, student: "Karthik Kumar", class: "8-A", amount: 2000, method: "Online", date: "Yesterday", type: "TRANSPORT" },
  { id: 4, student: "Sneha Patel", class: "7-A", amount: 14000, method: "Cheque", date: "Yesterday", type: "TUITION" },
  { id: 5, student: "Ravi Nair", class: "10-B", amount: 1000, method: "Cash", date: "2 days ago", type: "LIBRARY" },
];

const categoryBreakdown = [
  { category: "Tuition Fee", collected: 180000, pending: 65000, target: 250000 },
  { category: "Transport Fee", collected: 42000, pending: 12000, target: 60000 },
  { category: "Lab Fee", collected: 18000, pending: 5000, target: 25000 },
  { category: "Library Fee", collected: 5000, pending: 3000, target: 15000 },
];

// ── Helpers ──────────────────────────────────────────────────────
function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">{label} 2025</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill || p.stroke }} />
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
      <p className="text-xs font-bold" style={{ color: payload[0].payload.color }}>{payload[0].name}</p>
      <p className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function FeesOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const totalCollected = 245000;
  const pending = 85000;
  const overdue = 35000;
  const target = 350000;
  const collectionPct = Math.round((totalCollected / target) * 100);

  async function handleBulkReminder() {
    setSendingReminder(true);
    await new Promise((r) => setTimeout(r, 2500));
    setSendingReminder(false);
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  }

  const statCards = [
    {
      title: "Collected This Month",
      value: formatCurrency(totalCollected),
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      trend: "up",
      trendText: "+18% vs last month",
      border: "border-emerald-200 dark:border-emerald-500/20",
    },
    {
      title: "Pending Fees",
      value: formatCurrency(pending),
      icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
      trend: null,
      trendText: "42 students",
      border: "border-amber-200 dark:border-amber-500/20",
    },
    {
      title: "Overdue Fees",
      value: formatCurrency(overdue),
      icon: AlertCircle,
      gradient: "from-red-500 to-rose-600",
      iconBg: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
      trend: "down",
      trendText: "18 students — 30+ days",
      border: "border-red-200 dark:border-red-500/20",
      urgent: true,
    },
    {
      title: "Collection Target",
      value: formatCurrency(target),
      icon: Target,
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
      trend: null,
      trendText: `${collectionPct}% achieved`,
      border: "border-blue-200 dark:border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Fee Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Academic Year 2024-25 • March 2025
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            href="/admin/fees/pending"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold shadow-lg shadow-red-500/20 hover:from-red-700 hover:to-rose-700 transition-all active:scale-95"
          >
            <Bell className="w-4 h-4" />
            Send Reminders
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) =>
          loading ? (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="space-y-2">
                  <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-20 h-7 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="w-36 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ) : (
            <div key={i} className={`group relative overflow-hidden rounded-2xl border ${card.border} bg-white dark:bg-slate-900 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}>
              <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${card.gradient} opacity-[0.05] rounded-full blur-2xl`} />
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                  <p className="text-[26px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {card.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
                {card.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />}
                <span className={`text-[12px] font-semibold ${
                  card.trend === "up" ? "text-emerald-600 dark:text-emerald-400" :
                  card.urgent ? "text-red-600 dark:text-red-400" :
                  "text-slate-400"
                }`}>
                  {card.trendText}
                </span>
              </div>
              {card.urgent && (
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-red-500" />
                </span>
              )}
            </div>
          )
        )}
      </div>

      {/* Collection Progress */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
              Monthly Collection Progress
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {formatCurrency(totalCollected)} of {formatCurrency(target)} target
            </p>
          </div>
          <span className={`text-2xl font-bold ${collectionPct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
            {collectionPct}%
          </span>
        </div>
        <div className="relative h-5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000 ease-out"
            style={{ width: `${collectionPct}%` }}
          />
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-amber-400 opacity-40 transition-all duration-1000"
            style={{ width: `${(pending / target) * 100 + collectionPct}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
          {[
            { label: "Collected", color: "bg-emerald-500", pct: collectionPct },
            { label: "Pending", color: "bg-amber-400", pct: Math.round((pending / target) * 100) },
            { label: "Overdue", color: "bg-red-500", pct: Math.round((overdue / target) * 100) },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400">{l.label}: <span className="font-bold">{l.pct}%</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Monthly Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
            6-Month Collection Trend
          </h3>
          {loading ? (
            <div className="h-[260px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} barCategoryGap="25%">
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" tickFormatter={(v) => formatCurrency(v)} />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar dataKey="target" fill="#e2e8f0" radius={[6, 6, 2, 2]} maxBarSize={28} name="target" />
                  <Bar dataKey="collected" radius={[6, 6, 2, 2]} maxBarSize={28} name="collected">
                    {monthlyData.map((entry, i) => (
                      <Cell key={i} fill={i === monthlyData.length - 1 ? "#10b981" : "#34d399"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
            Fee Status Breakdown
          </h3>
          {loading ? (
            <div className="h-[220px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
            Category-wise Collection
          </h3>
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => {
              const pct = Math.round((cat.collected / cat.target) * 100);
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat.category}</span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(cat.collected)}</span>
                      <span className="text-red-500 font-semibold">+{formatCurrency(cat.pending)} due</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-400" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{pct}% of ₹{(cat.target / 1000).toFixed(0)}K target</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
              Recent Collections
            </h3>
            <Link href="/accountant/fees" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <IndianRupee className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{txn.student}</p>
                  <p className="text-[11px] text-slate-400">Class {txn.class} • {txn.method} • {txn.type}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(txn.amount)}</p>
                  <p className="text-[11px] text-slate-400">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Reminder CTA */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold text-white">
              60 students have pending/overdue fees
            </h3>
            <p className="text-red-100 text-sm mt-1">
              Send automated reminders via SMS and WhatsApp with one click
            </p>
          </div>
          {reminderSent ? (
            <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/20 border border-white/30 text-white font-bold">
              <CheckCircle2 className="w-5 h-5" />
              Reminders Sent!
            </div>
          ) : (
            <button
              onClick={handleBulkReminder}
              disabled={sendingReminder}
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-red-600 font-bold text-sm shadow-xl hover:shadow-2xl hover:bg-red-50 transition-all active:scale-95 whitespace-nowrap flex-shrink-0"
            >
              {sendingReminder ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <><Send className="w-4 h-4" /> Send Bulk Reminder</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}