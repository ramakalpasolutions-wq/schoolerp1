// src/app/(dashboard)/parent/attendance/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, BarChart3 } from "lucide-react";

const DATA = {
  childName: "Arjun Reddy",
  present: 22, total: 25,
  records: [
    { date: "Mar 18", day: "Tuesday", status: "PRESENT" },
    { date: "Mar 17", day: "Monday", status: "PRESENT" },
    { date: "Mar 16", day: "Sunday", status: "WEEKEND" },
    { date: "Mar 15", day: "Saturday", status: "WEEKEND" },
    { date: "Mar 14", day: "Friday", status: "ABSENT" },
    { date: "Mar 13", day: "Thursday", status: "PRESENT" },
    { date: "Mar 12", day: "Wednesday", status: "PRESENT" },
    { date: "Mar 11", day: "Tuesday", status: "PRESENT" },
    { date: "Mar 10", day: "Monday", status: "LATE" },
    { date: "Mar 09", day: "Sunday", status: "WEEKEND" },
    { date: "Mar 08", day: "Saturday", status: "WEEKEND" },
    { date: "Mar 07", day: "Friday", status: "PRESENT" },
  ],
};

export default function ParentAttendancePage() {
  const pct = Math.round((DATA.present / DATA.total) * 100);
  const sc = {
    PRESENT: { label: "Present", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
    ABSENT: { label: "Absent", bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", icon: XCircle },
    LATE: { label: "Late", bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", icon: CheckCircle2 },
    WEEKEND: { label: "Weekend", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-400", icon: null },
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/parent" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{DATA.childName}&apos;s Attendance</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">March 2025</p>
        </div>
      </div>

      <div className={`rounded-2xl border-2 p-6 text-center ${pct >= 75 ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10" : "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10"}`}>
        <p className={`text-6xl font-black ${pct >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{pct}%</p>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{DATA.present} Present / {DATA.total} Working Days</p>
        {pct < 75 && <p className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300">⚠️ Below 75% minimum requirement</p>}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Attendance</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {DATA.records.map((r, i) => {
            const config = sc[r.status] || sc.PRESENT;
            const Icon = config.icon;
            return (
              <div key={i} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{r.date}</p>
                  <p className="text-[11px] text-slate-400">{r.day}</p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${config.bg} ${config.text}`}>
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}