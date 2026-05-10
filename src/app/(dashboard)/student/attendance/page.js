// src/app/(dashboard)/student/attendance/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Clock, BarChart3 } from "lucide-react";

const ATTENDANCE_DATA = {
  present: 141, total: 160,
  monthly: [
    { month: "June 2024", present: 22, total: 24, pct: 92 },
    { month: "July 2024", present: 20, total: 26, pct: 77 },
    { month: "August 2024", present: 25, total: 27, pct: 93 },
    { month: "September 2024", present: 24, total: 25, pct: 96 },
    { month: "October 2024", present: 18, total: 24, pct: 75 },
    { month: "November 2024", present: 20, total: 24, pct: 83 },
    { month: "December 2024", present: 12, total: 14, pct: 86 },
    { month: "January 2025", present: 20, total: 22, pct: 91 },
    { month: "February 2025", present: 18, total: 20, pct: 90 },
    { month: "March 2025", present: 18, total: 20, pct: 90 },
  ],
};

export default function StudentAttendancePage() {
  const overall = Math.round((ATTENDANCE_DATA.present / ATTENDANCE_DATA.total) * 100);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/student" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Academic Year 2024-2025</p>
        </div>
      </div>

      {/* Overall */}
      <div className={`rounded-2xl border-2 p-6 text-center ${overall >= 75 ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10" : "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"}`}>
        <p className={`text-6xl font-black ${overall >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{overall}%</p>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Overall Attendance</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: "Present", value: ATTENDANCE_DATA.present, color: "text-emerald-600 dark:text-emerald-400" },
            { label: "Absent", value: ATTENDANCE_DATA.total - ATTENDANCE_DATA.present, color: "text-red-600 dark:text-red-400" },
            { label: "Total Days", value: ATTENDANCE_DATA.total, color: "text-slate-900 dark:text-white" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
        {overall < 75 && (
          <div className="mt-4 p-3 rounded-xl bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">⚠️ Below minimum 75% attendance. Please regularize attendance.</p>
          </div>
        )}
      </div>

      {/* Monthly */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2"><BarChart3 className="w-4 h-4 text-blue-500" /> Month-wise Attendance</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {ATTENDANCE_DATA.monthly.map((m, i) => (
            <div key={i} className="px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{m.month}</span>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-400">{m.present}/{m.total}</span>
                  <span className={`font-bold ${m.pct >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{m.pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-700 ${m.pct >= 90 ? "bg-emerald-500" : m.pct >= 75 ? "bg-blue-500" : "bg-red-500"}`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}