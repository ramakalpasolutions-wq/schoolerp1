// src/app/(dashboard)/super-admin/subscriptions/page.js

"use client";

import { useState, useMemo } from "react";
import {
  CreditCard, Crown, Shield, Star, TrendingUp, AlertCircle,
  CheckCircle2, Clock, Search, X, ChevronDown, Filter,
  IndianRupee, Calendar, Users, ArrowUpRight,
} from "lucide-react";

const SUBSCRIPTIONS = [
  { id: "1", school: "Sri Vidya High School", plan: "PREMIUM", amount: 14999, status: "ACTIVE", startDate: "2025-01-01", expiry: "2025-12-31", autoRenew: true, students: 1248 },
  { id: "2", school: "Sunrise Academy", plan: "STANDARD", amount: 9999, status: "ACTIVE", startDate: "2025-01-15", expiry: "2025-08-20", autoRenew: false, students: 856 },
  { id: "3", school: "Nalanda International School", plan: "PREMIUM", amount: 14999, status: "ACTIVE", startDate: "2024-11-01", expiry: "2025-11-15", autoRenew: true, students: 2100 },
  { id: "4", school: "Greenfield Public School", plan: "BASIC", amount: 4999, status: "EXPIRING", startDate: "2024-04-01", expiry: "2025-04-10", autoRenew: false, students: 320 },
  { id: "5", school: "Royal Grammar School", plan: "STANDARD", amount: 9999, status: "EXPIRED", startDate: "2024-07-01", expiry: "2025-02-28", autoRenew: false, students: 670 },
  { id: "6", school: "DAV Model School", plan: "PREMIUM", amount: 14999, status: "ACTIVE", startDate: "2025-03-01", expiry: "2026-03-31", autoRenew: true, students: 1580 },
  { id: "7", school: "Little Flower School", plan: "BASIC", amount: 4999, status: "ACTIVE", startDate: "2024-06-01", expiry: "2025-06-30", autoRenew: false, students: 210 },
  { id: "8", school: "Chaitanya Techno School", plan: "PREMIUM", amount: 14999, status: "ACTIVE", startDate: "2024-10-01", expiry: "2025-10-31", autoRenew: true, students: 1890 },
];

const planConfig = {
  BASIC: { label: "Basic", icon: Star, gradient: "from-slate-400 to-slate-500", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300" },
  STANDARD: { label: "Standard", icon: Shield, gradient: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-300" },
  PREMIUM: { label: "Premium", icon: Crown, gradient: "from-amber-500 to-yellow-600", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-300" },
};

const statusConfig = {
  ACTIVE: { label: "Active", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  EXPIRING: { label: "Expiring Soon", bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", dot: "bg-amber-500" },
  EXPIRED: { label: "Expired", bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
};

function formatCurrency(val) {
  return `₹${val.toLocaleString("en-IN")}`;
}

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = useMemo(() => {
    let data = [...SUBSCRIPTIONS];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((s) => s.school.toLowerCase().includes(q));
    }
    if (filterPlan !== "ALL") data = data.filter((s) => s.plan === filterPlan);
    if (filterStatus !== "ALL") data = data.filter((s) => s.status === filterStatus);
    return data;
  }, [search, filterPlan, filterStatus]);

  const stats = {
    totalRevenue: SUBSCRIPTIONS.filter((s) => s.status !== "EXPIRED").reduce((sum, s) => sum + s.amount, 0),
    active: SUBSCRIPTIONS.filter((s) => s.status === "ACTIVE").length,
    expiring: SUBSCRIPTIONS.filter((s) => s.status === "EXPIRING").length,
    expired: SUBSCRIPTIONS.filter((s) => s.status === "EXPIRED").length,
  };

  const planBreakdown = [
    { plan: "PREMIUM", count: SUBSCRIPTIONS.filter((s) => s.plan === "PREMIUM").length, revenue: SUBSCRIPTIONS.filter((s) => s.plan === "PREMIUM").reduce((s, x) => s + x.amount, 0) },
    { plan: "STANDARD", count: SUBSCRIPTIONS.filter((s) => s.plan === "STANDARD").length, revenue: SUBSCRIPTIONS.filter((s) => s.plan === "STANDARD").reduce((s, x) => s + x.amount, 0) },
    { plan: "BASIC", count: SUBSCRIPTIONS.filter((s) => s.plan === "BASIC").length, revenue: SUBSCRIPTIONS.filter((s) => s.plan === "BASIC").reduce((s, x) => s + x.amount, 0) },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage school subscription plans</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Revenue", value: formatCurrency(stats.totalRevenue), icon: IndianRupee, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
          { label: "Active Plans", value: stats.active, icon: CheckCircle2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
          { label: "Expiring Soon", value: stats.expiring, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
          { label: "Expired", value: stats.expired, icon: AlertCircle, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center justify-between p-4 rounded-2xl border ${s.bg}`}>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className={`text-xl font-bold ${s.color} mt-0.5`}>{s.value}</p>
            </div>
            <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Plan Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {planBreakdown.map((item) => {
          const cfg = planConfig[item.plan];
          const PlanIcon = cfg.icon;
          return (
            <div key={item.plan} className={`rounded-2xl p-5 bg-gradient-to-br ${cfg.gradient} text-white`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PlanIcon className="w-5 h-5" />
                  <span className="text-sm font-bold">{cfg.label} Plan</span>
                </div>
                <span className="text-2xl font-black">{item.count}</span>
              </div>
              <p className="text-white/70 text-xs">Schools</p>
              <p className="text-lg font-bold mt-2">{formatCurrency(item.revenue)}/yr</p>
            </div>
          );
        })}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search schools..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["ALL", "BASIC", "STANDARD", "PREMIUM"].map((p) => (
            <button key={p} onClick={() => setFilterPlan(p)} className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${filterPlan === p ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
              {p === "ALL" ? "All Plans" : p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
          <div className="w-px bg-slate-200 dark:bg-slate-700" />
          {["ALL", "ACTIVE", "EXPIRING", "EXPIRED"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${filterStatus === s ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
              {s === "ALL" ? "All Status" : s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                {["School", "Plan", "Amount", "Start", "Expiry", "Auto-Renew", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((sub) => {
                const plan = planConfig[sub.plan];
                const status = statusConfig[sub.status];
                const PlanIcon = plan.icon;
                return (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white text-xs font-bold">{sub.school.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">{sub.school}</p>
                          <p className="text-[11px] text-slate-400">{sub.students.toLocaleString()} students</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${plan.bg} ${plan.text}`}>
                        <PlanIcon className="w-3.5 h-3.5" />
                        {plan.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900 dark:text-white">{formatCurrency(sub.amount)}</td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(sub.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{new Date(sub.expiry).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                    <td className="px-4 py-4 text-center">
                      {sub.autoRenew ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <X className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                          Renew
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
                          Upgrade
                        </button>
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