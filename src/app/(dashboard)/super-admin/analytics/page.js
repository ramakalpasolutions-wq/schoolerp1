// src/app/(dashboard)/super-admin/analytics/page.js

"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, Users, Building2, IndianRupee, GraduationCap,
  BarChart3, Calendar, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line, Legend,
  PieChart, Pie,
} from "recharts";

const monthlyRevenue = [
  { month: "Oct", revenue: 620000, schools: 480 },
  { month: "Nov", revenue: 710000, schools: 492 },
  { month: "Dec", revenue: 680000, schools: 498 },
  { month: "Jan", revenue: 790000, schools: 504 },
  { month: "Feb", revenue: 720000, schools: 508 },
  { month: "Mar", revenue: 850000, schools: 512 },
];

const planDistribution = [
  { name: "Premium", value: 52, color: "#f59e0b" },
  { name: "Standard", value: 58, color: "#3b82f6" },
  { name: "Basic", value: 40, color: "#94a3b8" },
  { name: "Enterprise", value: 12, color: "#8b5cf6" },
];

const growthData = [
  { month: "Oct", newSchools: 8, churned: 1 },
  { month: "Nov", newSchools: 12, churned: 2 },
  { month: "Dec", newSchools: 6, churned: 1 },
  { month: "Jan", newSchools: 15, churned: 3 },
  { month: "Feb", newSchools: 10, churned: 1 },
  { month: "Mar", newSchools: 12, churned: 2 },
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
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill || p.color || p.stroke }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-bold text-slate-900 dark:text-white">
            {typeof p.value === "number" && p.value > 10000 ? formatCurrency(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Safe chart wrapper ────────────────────────────────────────────
function SafeChart({ children, height = 260 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) {
    return (
      <div style={{ height }} className="flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl animate-pulse">
        <p className="text-xs text-slate-400">Loading chart...</p>
      </div>
    );
  }
  return <div style={{ height }}>{children}</div>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const kpis = [
    { label: "Total Revenue (6mo)", value: formatCurrency(monthlyRevenue.reduce((s, m) => s + m.revenue, 0)), icon: IndianRupee, trend: "+18%", up: true, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
    { label: "Total Schools", value: "512", icon: Building2, trend: "+12 this month", up: true, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
    { label: "Total Students", value: "1,24,500", icon: GraduationCap, trend: "+8.1%", up: true, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
    { label: "Avg Revenue/School", value: formatCurrency(Math.round(monthlyRevenue.reduce((s, m) => s + m.revenue, 0) / 6 / 512)), icon: TrendingUp, trend: "+5%", up: true, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform performance overview — Last 6 months</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) =>
          loading ? (
            <div key={kpi.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 animate-pulse">
              <div className="flex justify-between mb-3"><div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded" /><div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" /></div>
              <div className="w-20 h-7 bg-slate-200 dark:bg-slate-800 rounded mb-1" />
              <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ) : (
            <div key={kpi.label} className={`flex items-center justify-between p-4 rounded-2xl border ${kpi.bg}`}>
              <div>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                <p className={`text-xl font-bold ${kpi.color} mt-0.5`}>{kpi.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {kpi.up ? <ArrowUpRight className="w-3 h-3 text-emerald-500" /> : <ArrowDownRight className="w-3 h-3 text-red-500" />}
                  <span className={`text-[11px] font-semibold ${kpi.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>{kpi.trend}</span>
                </div>
              </div>
              <div className="w-11 h-11 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          )
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">Monthly Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Subscription revenue — Oct 2024 to Mar 2025</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+18% overall</span>
            </div>
          </div>
          <SafeChart height={260}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: -15, bottom: 5 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "transparent" }} />
                <Bar dataKey="revenue" name="Revenue" radius={[8, 8, 2, 2]} maxBarSize={48}>
                  {monthlyRevenue.map((_, i) => (
                    <Cell key={i} fill={i === monthlyRevenue.length - 1 ? "#3b82f6" : "#93c5fd"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SafeChart>
        </div>

        {/* Plan Distribution */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">Plan Distribution</h3>
          <SafeChart height={200}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {planDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value + " schools", name]} />
              </PieChart>
            </ResponsiveContainer>
          </SafeChart>
          <div className="space-y-2 mt-3">
            {planDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[12px] text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-[12px] font-bold text-slate-900 dark:text-white">{item.value} schools</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">School Growth Trend</h3>
        <SafeChart height={220}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-800" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="newSchools" name="New Schools" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="churned" name="Churned" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 4, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </SafeChart>
      </div>
    </div>
  );
}