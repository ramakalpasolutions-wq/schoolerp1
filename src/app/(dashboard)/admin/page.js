// src/app/(dashboard)/admin/page.js

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  GraduationCap,
  IndianRupee,
  CheckSquare,
  AlertCircle,
  UserPlus,
  Bell,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Calendar,
  CalendarDays,
  Megaphone,
  BarChart3,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  ChevronRight,
  Eye,
  Sparkles,
  BookOpen,
  Award,
  Target,
  Zap,
  CircleDollarSign,
  ClipboardCheck,
  PartyPopper,
  Sun,
  Moon as MoonIcon,
  CloudSun,
  BadgeCheck,
  ExternalLink,
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
  LineChart,
  Line,
  Legend,
} from "recharts";

// ══════════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════════

const attendanceByClass = [
  { class: "1-A", present: 32, total: 35, pct: 91 },
  { class: "2-A", present: 28, total: 33, pct: 85 },
  { class: "3-A", present: 30, total: 38, pct: 79 },
  { class: "4-A", present: 34, total: 36, pct: 94 },
  { class: "5-A", present: 25, total: 34, pct: 74 },
  { class: "6-A", present: 38, total: 40, pct: 95 },
  { class: "7-A", present: 29, total: 37, pct: 78 },
  { class: "8-A", present: 36, total: 39, pct: 92 },
  { class: "9-A", present: 31, total: 42, pct: 74 },
  { class: "10-A", present: 40, total: 44, pct: 91 },
  { class: "9-B", present: 33, total: 38, pct: 87 },
  { class: "10-B", present: 30, total: 34, pct: 88 },
];

const feeCollectionMonthly = [
  { month: "Oct", collected: 280000, target: 350000 },
  { month: "Nov", collected: 320000, target: 350000 },
  { month: "Dec", collected: 190000, target: 350000 },
  { month: "Jan", collected: 410000, target: 400000 },
  { month: "Feb", collected: 360000, target: 400000 },
  { month: "Mar", collected: 450000, target: 400000 },
];

const recentAdmissions = [
  {
    id: 1,
    name: "Priya Sharma",
    class: "8-A",
    date: "2025-03-18",
    status: "CONFIRMED",
    photo: null,
  },
  {
    id: 2,
    name: "Ravi Kumar",
    class: "6-B",
    date: "2025-03-17",
    status: "CONFIRMED",
    photo: null,
  },
  {
    id: 3,
    name: "Ananya Reddy",
    class: "10-A",
    date: "2025-03-16",
    status: "PENDING",
    photo: null,
  },
  {
    id: 4,
    name: "Karthik Nair",
    class: "5-A",
    date: "2025-03-15",
    status: "CONFIRMED",
    photo: null,
  },
  {
    id: 5,
    name: "Sneha Patel",
    class: "9-A",
    date: "2025-03-14",
    status: "COUNSELING",
    photo: null,
  },
];

const upcomingEvents = [
  {
    id: 1,
    title: "Unit Test 1 — Classes 9 & 10",
    date: "Mar 25, 2025",
    type: "exam",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    icon: FileText,
  },
  {
    id: 2,
    title: "Fee Due — Q4 Tuition",
    date: "Mar 31, 2025",
    type: "fee",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    icon: IndianRupee,
  },
  {
    id: 3,
    title: "Ugadi Holiday",
    date: "Apr 2, 2025",
    type: "holiday",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    icon: PartyPopper,
  },
  {
    id: 4,
    title: "Parent-Teacher Meeting",
    date: "Apr 5, 2025",
    type: "event",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: Users,
  },
  {
    id: 5,
    title: "Mid-Term Exams Begin",
    date: "Apr 14, 2025",
    type: "exam",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    icon: FileText,
  },
];

const quickActions = [
  {
    label: "Add Student",
    icon: UserPlus,
    href: "/admin/students/add",
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    emoji: "📝",
  },
  {
    label: "Mark Attendance",
    icon: CheckSquare,
    href: "/admin/attendance",
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    emoji: "✅",
  },
  {
    label: "Collect Fee",
    icon: IndianRupee,
    href: "/accountant/fees/collect",
    gradient: "from-purple-500 to-violet-600",
    shadow: "shadow-purple-500/20",
    emoji: "💰",
  },
  {
    label: "Send Notification",
    icon: Megaphone,
    href: "/admin/notifications",
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-orange-500/20",
    emoji: "📢",
  },
  {
    label: "View Reports",
    icon: BarChart3,
    href: "/admin/fees/reports",
    gradient: "from-cyan-500 to-blue-600",
    shadow: "shadow-cyan-500/20",
    emoji: "📊",
  },
  {
    label: "Promote Students",
    icon: Award,
    href: "/admin/promotions",
    gradient: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
    emoji: "🎓",
  },
];

const notificationStats = [
  {
    channel: "SMS",
    count: 145,
    icon: Smartphone,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
  },
  {
    channel: "WhatsApp",
    count: 89,
    icon: MessageSquare,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
  },
  {
    channel: "Email",
    count: 52,
    icon: Mail,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-100 dark:border-purple-500/20",
  },
];

const admissionStatusConfig = {
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  COUNSELING: {
    label: "Counseling",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};

// ══════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12)
    return { text: "Good Morning", icon: Sun, emoji: "☀️" };
  if (hour < 17)
    return { text: "Good Afternoon", icon: CloudSun, emoji: "🌤️" };
  return { text: "Good Evening", icon: MoonIcon, emoji: "🌙" };
}

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// ── Circular Progress Ring ───────────────────────────────────────
function CircularProgress({ percentage, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color =
    percentage >= 90
      ? "#10b981"
      : percentage >= 80
        ? "#3b82f6"
        : percentage >= 70
          ? "#f59e0b"
          : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-100 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {percentage}%
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          Present
        </span>
      </div>
    </div>
  );
}

// ── Custom Tooltips ──────────────────────────────────────────────
function AttendanceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl min-w-[160px]">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
        Class {label}
      </p>
      <div className="space-y-1">
        <div className="flex justify-between gap-6">
          <span className="text-xs text-slate-400">Attendance</span>
          <span
            className={`text-xs font-bold ${data.pct >= 80 ? "text-emerald-600" : "text-red-600"}`}
          >
            {data.pct}%
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span className="text-xs text-slate-400">Present</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {data.present}/{data.total}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeeTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl min-w-[180px]">
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
        {label} 2025
      </p>
      {payload.map((entry) => (
        <div
          key={entry.name}
          className="flex items-center justify-between gap-6 mt-1"
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.stroke }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {entry.name === "collected" ? "Collected" : "Target"}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [school, setSchool] = useState({});
  const greeting = getGreeting();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.school) setSchool(parsed.school);
      }
    } catch {}

    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const todayStr = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Overall attendance stats
  const totalPresent = attendanceByClass.reduce((s, c) => s + c.present, 0);
  const totalStudents = attendanceByClass.reduce((s, c) => s + c.total, 0);
  const overallPct = Math.round((totalPresent / totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* ════════════════════════════════════════════════════════
          WELCOME BANNER
          ════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 blur-2xl" />
        <div className="absolute top-4 right-6 text-6xl opacity-10 pointer-events-none select-none hidden sm:block">
          🏫
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 flex-wrap">
                {greeting.text}, {user?.name?.split(" ")[0] || "Admin"}!
                <span className="text-2xl">{greeting.emoji}</span>
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <div className="flex items-center gap-1.5 text-blue-100">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm">{todayStr}</span>
                </div>
                <span className="text-blue-300 hidden sm:inline">•</span>
                <div className="flex items-center gap-1.5 text-blue-100">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">
                    {school?.name || "School ERP"} — Academic Year 2024-25
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/students/add"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white/25 transition-all active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Student</span>
              </Link>
              <Link
                href="/admin/fees/reports"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-bold hover:bg-blue-50 transition-all shadow-lg shadow-black/10 active:scale-95"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">View Reports</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          STATS CARDS
          ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* ── Card 1: Today's Attendance (Special) ──────────── */}
        {loading ? (
          <div className="sm:col-span-2 xl:col-span-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 animate-pulse">
            <div className="flex items-center gap-6">
              <div className="w-[120px] h-[120px] rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-3">
                <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="w-40 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
              </div>
            </div>
          </div>
        ) : (
          <div className="group sm:col-span-2 xl:col-span-1 relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-[0.04] dark:opacity-[0.06] rounded-full blur-2xl" />

            <div className="flex items-center gap-5">
              <CircularProgress percentage={overallPct} size={120} stroke={10} />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                  Today&apos;s Attendance
                </p>
                <p className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
                  {overallPct}%
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[12px] text-slate-500 dark:text-slate-400">
                      Present:{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {totalPresent.toLocaleString()}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[12px] text-slate-500 dark:text-slate-400">
                      Absent:{" "}
                      <span className="font-bold text-slate-900 dark:text-white">
                        {(totalStudents - totalPresent).toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Cards 2-6 ────────────────────────────────────────── */}
        {[
          {
            title: "Total Students",
            value: "1,250",
            icon: Users,
            gradient: "from-purple-500 to-violet-600",
            iconBg:
              "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
            trend: "up",
            trendValue: "+24 this month",
            sub: "Active enrollments",
          },
          {
            title: "Total Teachers",
            value: "68",
            icon: GraduationCap,
            gradient: "from-orange-500 to-amber-600",
            iconBg:
              "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400",
            trend: null,
            trendValue: null,
            sub: "Full-time faculty",
          },
          {
            title: "Fee Collected Today",
            value: "₹45,000",
            icon: CircleDollarSign,
            gradient: "from-emerald-500 to-teal-600",
            iconBg:
              "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            trend: "up",
            trendValue: "₹12K above avg",
            sub: "28 transactions",
          },
          {
            title: "Pending Fees",
            value: "₹85,000",
            icon: AlertCircle,
            gradient: "from-red-500 to-rose-600",
            iconBg:
              "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400",
            trend: "down",
            trendValue: "42 students due",
            sub: null,
            hasAction: true,
          },
          {
            title: "New Admissions",
            value: "12",
            icon: UserPlus,
            gradient: "from-cyan-500 to-blue-600",
            iconBg:
              "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
            trend: "up",
            trendValue: "This month",
            sub: "5 confirmed • 4 pending • 3 counseling",
          },
        ].map((card, i) =>
          loading ? (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 animate-pulse"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                  <div className="w-20 h-7 bg-slate-200 dark:bg-slate-800 rounded" />
                </div>
                <div className="w-11 h-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="w-36 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
            </div>
          ) : (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5"
            >
              {/* Top accent */}
              <div
                className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
              {/* Glow */}
              <div
                className={`absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br ${card.gradient} opacity-[0.04] dark:opacity-[0.06] rounded-full blur-2xl group-hover:opacity-[0.1] dark:group-hover:opacity-[0.12] transition-opacity`}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                      {card.title}
                    </p>
                    <p className="text-[26px] font-bold text-slate-900 dark:text-white tracking-tight leading-none mt-1">
                      {card.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Trend */}
                {card.trendValue && (
                  <div className="flex items-center gap-1.5 mb-1">
                    {card.trend === "up" ? (
                      <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                    ) : card.trend === "down" ? (
                      <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                    ) : null}
                    <span
                      className={`text-[12px] font-semibold ${
                        card.trend === "up"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : card.trend === "down"
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-400"
                      }`}
                    >
                      {card.trendValue}
                    </span>
                  </div>
                )}

                {/* Sub text */}
                {card.sub && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    {card.sub}
                  </p>
                )}

                {/* Quick action button for pending fees */}
                {card.hasAction && (
                  <button className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors active:scale-95">
                    <Send className="w-3 h-3" />
                    Send Reminder
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          CHARTS ROW
          ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Attendance Bar Chart ──────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Class-wise Attendance Today
              </h2>
              <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">
                Green ≥ 80% • Red &lt; 80%
              </p>
            </div>
            <Link
              href="/admin/attendance/reports"
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Full Report <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="h-[280px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={attendanceByClass}
                  margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
                  barCategoryGap="18%"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-slate-800"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="class"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<AttendanceTooltip />} cursor={{ fill: "transparent" }} />
                  <Bar dataKey="pct" radius={[6, 6, 2, 2]} maxBarSize={36}>
                    {attendanceByClass.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.pct >= 80 ? "#10b981" : "#ef4444"}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Attendance summary */}
          {!loading && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 justify-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-[12px] text-slate-500 dark:text-slate-400">
                  ≥ 80%:{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {attendanceByClass.filter((c) => c.pct >= 80).length} classes
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500" />
                <span className="text-[12px] text-slate-500 dark:text-slate-400">
                  &lt; 80%:{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {attendanceByClass.filter((c) => c.pct < 80).length} classes
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── Fee Collection Line Chart ────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Fee Collection Trend
              </h2>
              <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">
                Collected vs Target — Last 6 months
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                +12.5% this quarter
              </span>
            </div>
          </div>

          {loading ? (
            <div className="h-[280px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={feeCollectionMonthly}
                  margin={{ top: 5, right: 10, left: -15, bottom: 5 }}
                >
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
                    tick={{ fontSize: 11, fontWeight: 600, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    className="text-slate-400 dark:text-slate-500"
                    tickFormatter={(v) => formatCurrency(v)}
                  />
                  <Tooltip content={<FeeTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    formatter={(value) =>
                      value === "collected" ? "Collected" : "Target"
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#94a3b8"
                    strokeWidth={2}
                    strokeDasharray="6 3"
                    dot={{ r: 4, fill: "#94a3b8", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="collected"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Fee summary */}
          {!loading && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-3 text-center">
              {[
                {
                  label: "Total Collected",
                  value: formatCurrency(
                    feeCollectionMonthly.reduce((s, m) => s + m.collected, 0)
                  ),
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  label: "Total Target",
                  value: formatCurrency(
                    feeCollectionMonthly.reduce((s, m) => s + m.target, 0)
                  ),
                  color: "text-slate-500 dark:text-slate-400",
                },
                {
                  label: "Collection Rate",
                  value: `${Math.round(
                    (feeCollectionMonthly.reduce((s, m) => s + m.collected, 0) /
                      feeCollectionMonthly.reduce((s, m) => s + m.target, 0)) *
                      100
                  )}%`,
                  color: "text-emerald-600 dark:text-emerald-400",
                },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    {item.label}
                  </p>
                  <p className={`text-sm font-bold ${item.color} mt-0.5`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          QUICK ACTIONS
          ════════════════════════════════════════════════════════ */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
              Quick Actions
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Gradient icon circle */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {action.label}
                </span>

                {/* Hover glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-[0.04] dark:group-hover:opacity-[0.08] transition-opacity duration-300`}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BOTTOM ROW: Admissions + Events + Notifications
          ════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Recent Admissions ─────────────────────────────────── */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
              Recent Admissions
            </h3>
            <Link
              href="/admin/crm/leads"
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="px-5 pb-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="w-28 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                  <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentAdmissions.map((student) => {
                const statusCfg = admissionStatusConfig[student.status];
                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-[12px] font-bold">
                        {student.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        Class {student.class} • {formatDate(student.date)}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${statusCfg.bg} ${statusCfg.text}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                      />
                      {statusCfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Upcoming Events ──────────────────────────────────── */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Upcoming Events
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="px-5 pb-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="w-32 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="w-20 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingEvents.map((event) => {
                const Icon = event.icon;
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${event.bg} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className={`w-4 h-4 ${event.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-snug">
                        {event.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">
                          {event.date}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Notifications Sent Today ─────────────────────────── */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Notifications Today
              </h3>
            </div>
            <Link
              href="/admin/notifications"
              className="flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              History <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="w-full h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Channel stats */}
              <div className="space-y-3 mb-5">
                {notificationStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.channel}
                      className={`flex items-center justify-between p-3.5 rounded-xl ${stat.bg} border ${stat.border}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
                        >
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300">
                          {stat.channel}
                        </span>
                      </div>
                      <span
                        className={`text-xl font-bold ${stat.color}`}
                      >
                        {stat.count}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-blue-500" />
                    <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
                      Total Sent
                    </span>
                  </div>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {notificationStats.reduce((s, n) => s + n.count, 0)}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                  {notificationStats.map((stat, i) => {
                    const total = notificationStats.reduce(
                      (s, n) => s + n.count,
                      0
                    );
                    const pct = (stat.count / total) * 100;
                    const colors = [
                      "bg-blue-500",
                      "bg-emerald-500",
                      "bg-purple-500",
                    ];
                    return (
                      <div
                        key={stat.channel}
                        className={`h-full ${colors[i]} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center justify-between mt-2">
                  {notificationStats.map((stat, i) => {
                    const total = notificationStats.reduce(
                      (s, n) => s + n.count,
                      0
                    );
                    const dotColors = [
                      "bg-blue-500",
                      "bg-emerald-500",
                      "bg-purple-500",
                    ];
                    return (
                      <div
                        key={stat.channel}
                        className="flex items-center gap-1.5"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${dotColors[i]}`}
                        />
                        <span className="text-[10px] text-slate-400">
                          {stat.channel}{" "}
                          {Math.round((stat.count / total) * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Send Now CTA */}
              <Link
                href="/admin/notifications"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[13px] font-semibold shadow-lg shadow-blue-500/15 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
              >
                <Megaphone className="w-4 h-4" />
                Send New Notification
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}