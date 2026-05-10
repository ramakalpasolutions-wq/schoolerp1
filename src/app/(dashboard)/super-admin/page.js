// src/app/(dashboard)/super-admin/page.js

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2, Users, IndianRupee, GraduationCap, TrendingUp,
  AlertCircle, Search, Filter, Plus, Megaphone, Download,
  ChevronLeft, ChevronRight, MoreHorizontal, Eye, Pencil,
  Power, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2,
  XCircle, CreditCard, UserPlus, Activity, BarChart3, X,
  Sparkles, ChevronDown, Calendar, Zap, Crown, Star, Shield,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

// ── Revenue chart data ───────────────────────────────────────────
const revenueData = [
  { month: "Oct", revenue: 620000 },
  { month: "Nov", revenue: 710000 },
  { month: "Dec", revenue: 680000 },
  { month: "Jan", revenue: 790000 },
  { month: "Feb", revenue: 720000 },
  { month: "Mar", revenue: 850000 },
];

// ── Schools mock data ────────────────────────────────────────────
const allSchools = [
  { id: "1", name: "Sri Vidya High School", location: "Rajyampet, AP", logo: null, plan: "PREMIUM", students: 1248, teachers: 68, status: "ACTIVE", expiry: "2025-12-31", revenue: 14999, joinedDate: "2023-06-15" },
  { id: "2", name: "Sunrise Academy", location: "Guntur, AP", logo: null, plan: "STANDARD", students: 856, teachers: 42, status: "ACTIVE", expiry: "2025-08-20", revenue: 9999, joinedDate: "2023-09-01" },
  { id: "3", name: "Nalanda International", location: "Hyderabad, TS", logo: null, plan: "PREMIUM", students: 2100, teachers: 95, status: "ACTIVE", expiry: "2025-11-15", revenue: 14999, joinedDate: "2022-04-10" },
  { id: "4", name: "Greenfield Public School", location: "Vijayawada, AP", logo: null, plan: "BASIC", students: 320, teachers: 18, status: "ACTIVE", expiry: "2025-04-10", revenue: 4999, joinedDate: "2024-01-20" },
  { id: "5", name: "Royal Grammar School", location: "Tirupati, AP", logo: null, plan: "STANDARD", students: 670, teachers: 35, status: "INACTIVE", expiry: "2025-02-28", revenue: 9999, joinedDate: "2023-07-05" },
  { id: "6", name: "DAV Model School", location: "Nellore, AP", logo: null, plan: "PREMIUM", students: 1580, teachers: 72, status: "ACTIVE", expiry: "2026-03-31", revenue: 14999, joinedDate: "2022-08-15" },
  { id: "7", name: "Little Flower School", location: "Kadapa, AP", logo: null, plan: "BASIC", students: 210, teachers: 12, status: "ACTIVE", expiry: "2025-06-30", revenue: 4999, joinedDate: "2024-06-01" },
  { id: "8", name: "Vidya Bharathi School", location: "Kurnool, AP", logo: null, plan: "STANDARD", students: 540, teachers: 28, status: "INACTIVE", expiry: "2025-01-15", revenue: 9999, joinedDate: "2023-11-10" },
  { id: "9", name: "Chaitanya Techno School", location: "Warangal, TS", logo: null, plan: "PREMIUM", students: 1890, teachers: 88, status: "ACTIVE", expiry: "2025-10-31", revenue: 14999, joinedDate: "2022-06-20" },
  { id: "10", name: "Bhashyam Public School", location: "Karimnagar, TS", logo: null, plan: "STANDARD", students: 720, teachers: 38, status: "ACTIVE", expiry: "2025-09-30", revenue: 9999, joinedDate: "2023-03-01" },
  { id: "11", name: "Vignan School of Excellence", location: "Ongole, AP", logo: null, plan: "BASIC", students: 280, teachers: 15, status: "ACTIVE", expiry: "2025-05-15", revenue: 4999, joinedDate: "2024-04-10" },
  { id: "12", name: "Rainbow International", location: "Anantapur, AP", logo: null, plan: "PREMIUM", students: 1340, teachers: 62, status: "ACTIVE", expiry: "2026-01-31", revenue: 14999, joinedDate: "2023-01-15" },
];

// ── Recent activity data ─────────────────────────────────────────
const recentActivities = [
  { id: 1, type: "school_added", icon: Building2, iconBg: "bg-blue-100 dark:bg-blue-500/10", iconColor: "text-blue-600 dark:text-blue-400", title: "Sunrise Academy registered", description: "New school from Guntur, Andhra Pradesh", time: "5 minutes ago" },
  { id: 2, type: "payment", icon: IndianRupee, iconBg: "bg-emerald-100 dark:bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400", title: "Payment received — ₹14,999", description: "Sri Vidya High School — Premium Plan", time: "32 minutes ago" },
  { id: 3, type: "renewal", icon: CreditCard, iconBg: "bg-purple-100 dark:bg-purple-500/10", iconColor: "text-purple-600 dark:text-purple-400", title: "Plan renewed — Standard", description: "Bhashyam Public School — 1 year extension", time: "2 hours ago" },
  { id: 4, type: "deactivated", icon: XCircle, iconBg: "bg-red-100 dark:bg-red-500/10", iconColor: "text-red-600 dark:text-red-400", title: "Vidya Bharathi School deactivated", description: "Subscription expired — auto-deactivated", time: "5 hours ago" },
  { id: 5, type: "user_added", icon: UserPlus, iconBg: "bg-amber-100 dark:bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400", title: "New admin account created", description: "Rajam Public School — admin@rajam.edu", time: "Yesterday" },
  { id: 6, type: "payment", icon: IndianRupee, iconBg: "bg-emerald-100 dark:bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400", title: "Payment received — ₹9,999", description: "Greenfield Public School — Standard upgrade", time: "Yesterday" },
];

// ── Plan config ──────────────────────────────────────────────────
const planConfig = {
  BASIC: { label: "Basic", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", border: "border-slate-200 dark:border-slate-700", icon: Star },
  STANDARD: { label: "Standard", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-500/30", icon: Shield },
  PREMIUM: { label: "Premium", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-500/30", icon: Crown },
};

const statusConfig = {
  ACTIVE: { label: "Active", dot: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
  INACTIVE: { label: "Inactive", dot: "bg-red-500", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400" },
};

// ── Helpers ──────────────────────────────────────────────────────
function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function isExpiringSoon(dateStr) {
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff > 0;
}

function isExpired(dateStr) {
  return new Date(dateStr) < new Date();
}

// ── Safe Chart Wrapper — Fixes "width -1 height -1" warning ──────
// Delays rendering until the DOM container has actual dimensions.
function SafeChart({ children, height = 300 }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // requestAnimationFrame ensures the layout paint is done
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/50"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[11px] text-slate-400 font-medium">
            Loading chart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      {children}
    </div>
  );
}

// ── Custom chart tooltip ─────────────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label} 2025</p>
      <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, trend, trendValue, gradient, iconBg, urgent, loading }) {
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
          </div>
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5">
      {/* Gradient top accent */}
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Background glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${gradient} opacity-[0.06] dark:opacity-[0.08] rounded-full blur-2xl group-hover:opacity-[0.12] dark:group-hover:opacity-[0.15] transition-opacity duration-500`} />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
          <p className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mb-2">{value}</p>
          {trendValue && (
            <div className="flex items-center gap-1.5">
              {trend === "up" ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              ) : trend === "down" ? (
                <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
              ) : null}
              <span className={`text-[12px] font-semibold ${trend === "up" ? "text-emerald-600 dark:text-emerald-400" : trend === "down" ? "text-red-600 dark:text-red-400" : "text-slate-400"}`}>
                {trendValue}
              </span>
            </div>
          )}
          {urgent && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-[11px] font-bold text-red-600 dark:text-red-400">Urgent</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════

export default function SuperAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPlanFilter, setShowPlanFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [sendingReminder, setSendingReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // ── Filtered & Paginated Schools ─────────────────────────────
  const filteredSchools = useMemo(() => {
    let result = [...allSchools];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
      );
    }
    if (filterPlan !== "ALL") result = result.filter((s) => s.plan === filterPlan);
    if (filterStatus !== "ALL") result = result.filter((s) => s.status === filterStatus);
    return result;
  }, [searchQuery, filterPlan, filterStatus]);

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchQuery, filterPlan, filterStatus]);

  // ── Bulk Reminder ─────────────────────────────────────────────
  async function handleBulkReminder() {
    setSendingReminder(true);
    await new Promise((r) => setTimeout(r, 2500));
    setSendingReminder(false);
    setReminderSent(true);
    setTimeout(() => setReminderSent(false), 4000);
  }

  // ── Stats config ──────────────────────────────────────────────
  const stats = [
    { title: "Total Schools", value: "150", icon: Building2, gradient: "from-blue-500 to-indigo-600", iconBg: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", trend: "up", trendValue: "+12 this month" },
    { title: "Total Students", value: "45,000", icon: Users, gradient: "from-purple-500 to-violet-600", iconBg: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400", trend: "up", trendValue: "+1,250 this month" },
    { title: "Monthly Revenue", value: "₹8,50,000", icon: IndianRupee, gradient: "from-emerald-500 to-teal-600", iconBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", trend: "up", trendValue: "+18% vs last month" },
    { title: "Active Teachers", value: "3,200", icon: GraduationCap, gradient: "from-orange-500 to-amber-600", iconBg: "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400", trend: null, trendValue: null },
    { title: "New Schools", value: "12", icon: TrendingUp, gradient: "from-cyan-500 to-blue-600", iconBg: "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400", trend: "up", trendValue: "This month" },
    { title: "Renewals Due", value: "8", icon: AlertCircle, gradient: "from-red-500 to-rose-600", iconBg: "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400", trend: "down", trendValue: "Within 30 days", urgent: true },
  ];

  return (
    <div className="space-y-6">

      {/* ════ PAGE HEADER ════════════════════════════════════════ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Super Admin Dashboard
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">ADMIN</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Platform overview •{" "}
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All systems operational</span>
        </div>
      </div>

      {/* ════ STATS CARDS ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} loading={loading} />
        ))}
      </div>

      {/* ════ REVENUE CHART + QUICK ACTIONS ══════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Revenue Chart — uses SafeChart wrapper */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Monthly Revenue 2025</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Subscription revenue trend over last 6 months</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+18% overall growth</span>
            </div>
          </div>

          {loading ? (
            <div className="h-[300px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            // ✅ SafeChart prevents the "width -1 height -1" warning
            <SafeChart height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barCategoryGap="25%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 600, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                    tickFormatter={(val) => formatCurrency(val)}
                  />
                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={{ fill: "rgba(148,163,184,0.08)", radius: 8 }}
                  />
                  <Bar dataKey="revenue" radius={[8, 8, 4, 4]} maxBarSize={56}>
                    {revenueData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === revenueData.length - 1 ? "#3b82f6" : "#93c5fd"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </SafeChart>
          )}

          {/* Chart footer */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4">
            {[
              { label: "Total Revenue", value: "₹43.7L", color: "text-blue-600 dark:text-blue-400" },
              { label: "Avg Monthly", value: "₹7.3L", color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Best Month", value: "Mar (₹8.5L)", color: "text-purple-600 dark:text-purple-400" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{item.label}</p>
                <p className={`text-sm font-bold ${item.color} mt-0.5`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Plan Distribution */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-2.5">
              <Link href="/super-admin/schools/add" className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 active:scale-[0.98] group">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Add New School</span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>

              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold text-sm hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-all duration-200 active:scale-[0.98] group">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span>Send Announcement</span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-70 transition-opacity" />
              </button>

              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-[0.98] group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                  <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span>Download Reports</span>
                <ArrowUpRight className="w-4 h-4 ml-auto opacity-40 group-hover:opacity-70 transition-opacity" />
              </button>
            </div>
          </div>

          {/* Plan Distribution */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4">Plan Distribution</h3>
            <div className="space-y-3.5">
              {[
                { name: "Premium", count: 52, pct: 35, color: "bg-amber-500" },
                { name: "Standard", count: 58, pct: 39, color: "bg-blue-500" },
                { name: "Basic", count: 40, pct: 26, color: "bg-slate-400" },
              ].map((p) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">{p.name}</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-bold text-slate-900 dark:text-white">{p.count}</span>
                      <span className="text-[11px] text-slate-400">({p.pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${p.color} transition-all duration-700 ease-out`} style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════ SCHOOLS TABLE ══════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">All Schools</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                {filteredSchools.length} school{filteredSchools.length !== 1 ? "s" : ""} found
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schools..."
                  className="w-full sm:w-56 pl-9 pr-9 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Plan filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowPlanFilter(!showPlanFilter); setShowStatusFilter(false); }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-all ${filterPlan !== "ALL" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <CreditCard className="w-4 h-4" />
                  {filterPlan === "ALL" ? "Plan" : filterPlan}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPlanFilter ? "rotate-180" : ""}`} />
                </button>
                {showPlanFilter && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {["ALL", "BASIC", "STANDARD", "PREMIUM"].map((plan) => (
                      <button
                        key={plan}
                        onClick={() => { setFilterPlan(plan); setShowPlanFilter(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterPlan === plan ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        {plan === "ALL" ? "All Plans" : plan.charAt(0) + plan.slice(1).toLowerCase()}
                        {filterPlan === plan && <CheckCircle2 className="inline w-3.5 h-3.5 ml-2" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowStatusFilter(!showStatusFilter); setShowPlanFilter(false); }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 text-sm font-medium transition-all ${filterStatus !== "ALL" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <Filter className="w-4 h-4" />
                  {filterStatus === "ALL" ? "Status" : filterStatus}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStatusFilter ? "rotate-180" : ""}`} />
                </button>
                {showStatusFilter && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    {["ALL", "ACTIVE", "INACTIVE"].map((status) => (
                      <button
                        key={status}
                        onClick={() => { setFilterStatus(status); setShowStatusFilter(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterStatus === status ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                      >
                        {status === "ALL" ? "All Status" : status.charAt(0) + status.slice(1).toLowerCase()}
                        {filterStatus === status && <CheckCircle2 className="inline w-3.5 h-3.5 ml-2" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear filters */}
              {(filterPlan !== "ALL" || filterStatus !== "ALL" || searchQuery) && (
                <button
                  onClick={() => { setFilterPlan("ALL"); setFilterStatus("ALL"); setSearchQuery(""); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Desktop Table ─────────────────────────────────────── */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                {["School", "Plan", "Students", "Status", "Expiry", "Actions"].map((h, i) => (
                  <th key={h} className={`px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ${i === 2 || i === 3 ? "text-center" : i === 5 ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                          <div className="w-36 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                      </td>
                    ))}
                    <td className="px-5 py-4 text-right">
                      <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))
              ) : (
                paginatedSchools.map((school) => {
                  const plan = planConfig[school.plan];
                  const status = statusConfig[school.status];
                  const PlanIcon = plan.icon;
                  const expiringSoon = isExpiringSoon(school.expiry);
                  const expired = isExpired(school.expiry);

                  return (
                    <tr key={school.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      {/* School */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/10">
                            <span className="text-white font-bold text-sm">{school.name.charAt(0)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{school.name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">{school.location}</p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${plan.bg} ${plan.text} border ${plan.border}`}>
                          <PlanIcon className="w-3.5 h-3.5" />
                          {plan.label}
                        </span>
                      </td>

                      {/* Students */}
                      <td className="px-5 py-4 text-center">
                        <span className="text-[13px] font-bold text-slate-900 dark:text-white">
                          {school.students.toLocaleString()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className={`text-[12px] font-medium ${expired ? "text-red-600 dark:text-red-400" : expiringSoon ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}`}>
                            {formatDate(school.expiry)}
                          </span>
                          {expiringSoon && !expired && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-500/10 text-[10px] font-bold text-amber-700 dark:text-amber-400">SOON</span>
                          )}
                          {expired && (
                            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-[10px] font-bold text-red-700 dark:text-red-400">EXPIRED</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            href={`/super-admin/schools/${school.id}`}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/super-admin/schools/${school.id}?edit=true`}
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            className={`p-2 rounded-lg transition-colors ${school.status === "ACTIVE" ? "text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"}`}
                            title={school.status === "ACTIVE" ? "Deactivate" : "Activate"}
                          >
                            <Power className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {!loading && paginatedSchools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
              <Building2 className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No schools found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* ── Mobile Cards ──────────────────────────────────────── */}
        <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="w-40 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-28 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              </div>
            ))
          ) : (
            paginatedSchools.map((school) => {
              const plan = planConfig[school.plan];
              const status = statusConfig[school.status];
              const PlanIcon = plan.icon;
              const expiringSoon = isExpiringSoon(school.expiry);
              const expired = isExpired(school.expiry);

              return (
                <div key={school.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-bold text-sm">{school.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{school.name}</p>
                        <p className="text-[11px] text-slate-400">{school.location}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold ${status.bg} ${status.text} flex-shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${plan.bg} ${plan.text} border ${plan.border}`}>
                      <PlanIcon className="w-3 h-3" />
                      {plan.label}
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className="text-[12px] font-medium text-slate-600 dark:text-slate-400">
                      {school.students.toLocaleString()} students
                    </span>
                    <span className="text-[11px] text-slate-400">•</span>
                    <span className={`text-[12px] font-medium ${expired ? "text-red-600 dark:text-red-400" : expiringSoon ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`}>
                      Exp: {formatDate(school.expiry)}{expiringSoon && !expired && " ⚠️"}{expired && " ❌"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/super-admin/schools/${school.id}`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[12px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> View
                    </Link>
                    <Link href={`/super-admin/schools/${school.id}?edit=true`} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[12px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
                      <Pencil className="w-3.5 h-3.5" /> Edit
                    </Link>
                    <button className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${school.status === "ACTIVE" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`}>
                      <Power className="w-3.5 h-3.5" />
                      {school.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {!loading && paginatedSchools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Building2 className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm font-medium">No schools found</p>
            </div>
          )}
        </div>

        {/* ── Pagination ─────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredSchools.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {filteredSchools.length}
              </span>{" "}
              schools
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"}`}
                    >
                      {page}
                    </button>
                  );
                }
                if ((page === currentPage - 2 && page > 1) || (page === currentPage + 2 && page < totalPages)) {
                  return <span key={page} className="w-9 h-9 flex items-center justify-center text-slate-400">…</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ════ RECENT ACTIVITY ════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Latest platform events and updates</p>
          </div>
          <Link href="/super-admin/analytics" className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
            View all <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-1/2 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                </div>
                <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-0.5">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${activity.iconBg} group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-[18px] h-[18px] ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-snug">{activity.title}</p>
                    <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-600 flex-shrink-0 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span className="whitespace-nowrap">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ════ BULK REMINDER CTA ══════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="text-xl font-bold text-white">8 schools have renewals due within 30 days</h3>
            <p className="text-red-100 text-sm mt-1">Send automated renewal reminders with one click</p>
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
              className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white text-red-600 font-bold text-sm shadow-xl hover:shadow-2xl hover:bg-red-50 transition-all active:scale-95 whitespace-nowrap flex-shrink-0 disabled:opacity-70"
            >
              {sendingReminder ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Send Renewal Reminders
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Close dropdowns on outside click ─────────────────────── */}
      {(showPlanFilter || showStatusFilter) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => { setShowPlanFilter(false); setShowStatusFilter(false); }}
        />
      )}
    </div>
  );
}