// src/app/(dashboard)/parent/page.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2, XCircle, IndianRupee, FileText, BookOpenCheck,
  Calendar, Bell, Clock, Users, AlertCircle, ChevronRight,
  BarChart3, GraduationCap, Star, Phone, Heart,
} from "lucide-react";

const CHILD_DATA = {
  name: "Arjun Reddy",
  class: "8",
  section: "A",
  rollNo: 5,
  admissionNo: "ADM/2024/0042",
  photo: null,
  attendanceToday: "PRESENT",
  attendanceMonth: { present: 22, total: 25 },
  pendingFees: 8000,
  feeStatus: "PENDING",
  recentResults: [
    { exam: "Unit Test 1", subject: "Mathematics", marks: 42, maxMarks: 50, grade: "A+" },
    { exam: "Unit Test 1", subject: "Science", marks: 38, maxMarks: 50, grade: "A" },
    { exam: "Unit Test 1", subject: "English", marks: 44, maxMarks: 50, grade: "A+" },
  ],
  todayHomework: [
    { subject: "Mathematics", title: "Quadratic Equations Exercise", dueDate: "Tomorrow" },
    { subject: "Science", title: "Chemical Reactions Lab Report", dueDate: "Today" },
  ],
  timetableToday: [
    { time: "09:00 - 09:45", subject: "Mathematics", teacher: "Suresh Kumar" },
    { time: "09:45 - 10:30", subject: "Science", teacher: "Radha Devi" },
    { time: "10:45 - 11:30", subject: "English", teacher: "Priya Sharma" },
    { time: "11:30 - 12:15", subject: "Social Studies", teacher: "Ravi Nair" },
    { time: "01:00 - 01:45", subject: "Telugu", teacher: "Lakshmi Rao" },
  ],
  notifications: [
    { id: 1, title: "PTM Scheduled", message: "Parent-Teacher Meeting on April 5th at 10 AM", time: "2 hours ago", type: "info" },
    { id: 2, title: "Holiday Notice", message: "School closed on March 31st for Ugadi", time: "Yesterday", type: "holiday" },
    { id: 3, title: "Fee Reminder", message: "Q4 tuition fee due on March 31st", time: "2 days ago", type: "fee" },
  ],
};

function AttendanceBadge({ status }) {
  const cfg = {
    PRESENT: { label: "PRESENT TODAY ✅", bg: "bg-emerald-500", text: "text-white", ring: "ring-emerald-400/30", sub: "Great! Arjun is in school today." },
    ABSENT: { label: "ABSENT TODAY ❌", bg: "bg-red-500", text: "text-white", ring: "ring-red-400/30", sub: "Arjun is marked absent. Please contact school if needed." },
    LATE: { label: "LATE TODAY ⚠️", bg: "bg-amber-500", text: "text-white", ring: "ring-amber-400/30", sub: "Arjun arrived late today." },
  };
  const s = cfg[status] || cfg.PRESENT;
  return (
    <div className={`text-center py-6 px-4 rounded-2xl ${s.bg} ring-8 ${s.ring}`}>
      <p className={`text-3xl font-black ${s.text} tracking-wide`}>{s.label}</p>
      <p className={`mt-2 text-sm ${s.text} opacity-80`}>{s.sub}</p>
    </div>
  );
}

export default function ParentDashboard() {
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState(CHILD_DATA);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const attendancePct = Math.round((child.attendanceMonth.present / child.attendanceMonth.total) * 100);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Parent Dashboard</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{today}</p>
      </div>

      {/* Child Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 to-rose-700 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">{child.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-pink-200" />
              <span className="text-pink-200 text-sm font-medium">My Child</span>
            </div>
            <h2 className="text-2xl font-bold text-white">{child.name}</h2>
            <p className="text-pink-100 text-sm mt-0.5">
              Class {child.class}-{child.section} • Roll #{child.rollNo} • {child.admissionNo}
            </p>
          </div>
        </div>
      </div>

      {/* Attendance Status */}
      <AttendanceBadge status={child.attendanceToday} />

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Monthly Attendance */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">This Month</p>
          <p className={`text-3xl font-bold ${attendancePct >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{attendancePct}%</p>
          <p className="text-[12px] text-slate-400 mt-1">{child.attendanceMonth.present}/{child.attendanceMonth.total} days</p>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
            <div className={`h-full rounded-full ${attendancePct >= 75 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${attendancePct}%` }} />
          </div>
        </div>

        {/* Fee Status */}
        {child.pendingFees > 0 ? (
          <div className="rounded-2xl border-2 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-center">
            <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2">⚠️ Fee Pending</p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₹{(child.pendingFees / 1000).toFixed(0)}K</p>
            <Link href="/parent/fees" className="mt-2 inline-block text-[11px] font-bold text-red-600 dark:text-red-400 hover:underline">Pay Now →</Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-4 text-center">
            <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2">Fee Status</p>
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-[12px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">All Clear</p>
          </div>
        )}

        {/* Homework */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Homework</p>
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{child.todayHomework.length}</p>
          <p className="text-[12px] text-slate-400 mt-1">tasks pending</p>
          <Link href="/parent/results" className="mt-2 inline-block text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">View All →</Link>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Results */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" /> Recent Results
            </h3>
            <Link href="/parent/results" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {child.recentResults.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{result.subject}</p>
                  <p className="text-[11px] text-slate-400">{result.exam}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{result.marks}/{result.maxMarks}</p>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{result.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Homework */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-blue-500" /> Today&apos;s Homework
            </h3>
          </div>
          <div className="space-y-2.5">
            {child.todayHomework.map((hw, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <BookOpenCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{hw.subject}</p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 truncate">{hw.title}</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Due: {hw.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Timetable */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" /> Today&apos;s Timetable
          </h3>
          <div className="space-y-2">
            {child.timetableToday.map((period, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="text-right w-24 flex-shrink-0">
                  <p className="text-[10px] text-slate-400 font-mono">{period.time}</p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{period.subject}</p>
                  <p className="text-[11px] text-slate-400">{period.teacher}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" /> School Notifications
          </h3>
          <div className="space-y-2.5">
            {child.notifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <span className="text-xl flex-shrink-0">
                  {notif.type === "fee" ? "💰" : notif.type === "holiday" ? "🎉" : "📢"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{notif.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />{notif.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}