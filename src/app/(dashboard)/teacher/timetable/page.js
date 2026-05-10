// src/app/(dashboard)/teacher/timetable/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

const TIMETABLE = {
  MON: [
    { time: "09:00 - 09:45", class: "9-A", room: "R3", subject: "Mathematics" },
    { time: "10:45 - 11:30", class: "10-A", room: "R1", subject: "Mathematics" },
    { time: "01:00 - 01:45", class: "9-B", room: "R3", subject: "Mathematics" },
  ],
  TUE: [
    { time: "09:00 - 09:45", class: "10-B", room: "R2", subject: "Mathematics" },
    { time: "11:30 - 12:15", class: "9-A", room: "R3", subject: "Mathematics" },
    { time: "02:45 - 03:30", class: "10-A", room: "R1", subject: "Mathematics" },
  ],
  WED: [
    { time: "09:45 - 10:30", class: "9-B", room: "R3", subject: "Mathematics" },
    { time: "01:00 - 01:45", class: "10-B", room: "R2", subject: "Mathematics" },
  ],
  THU: [
    { time: "09:00 - 09:45", class: "9-A", room: "R3", subject: "Mathematics" },
    { time: "10:45 - 11:30", class: "10-A", room: "R1", subject: "Mathematics" },
    { time: "01:45 - 02:30", class: "9-B", room: "R3", subject: "Mathematics" },
  ],
  FRI: [
    { time: "09:00 - 09:45", class: "10-B", room: "R2", subject: "Mathematics" },
    { time: "11:30 - 12:15", class: "9-A", room: "R3", subject: "Mathematics" },
    { time: "01:00 - 01:45", class: "10-A", room: "R1", subject: "Mathematics" },
  ],
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_LABELS = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };
const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];

const CLASS_COLORS = {
  "9-A": "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
  "9-B": "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30",
  "10-A": "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  "10-B": "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30",
};

export default function TeacherTimetablePage() {
  const totalPeriods = Object.values(TIMETABLE).reduce((s, periods) => s + periods.length, 0);
  const todayPeriods = TIMETABLE[todayDay] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Timetable</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{totalPeriods} periods per week</p>
        </div>
      </div>

      {/* Today */}
      {todayPeriods.length > 0 && (
        <div className="rounded-2xl border-2 border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 p-5">
          <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Today&apos;s Classes ({DAY_LABELS[todayDay]})
          </h3>
          <div className="space-y-2">
            {todayPeriods.map((period, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${CLASS_COLORS[period.class] || ""}`}>
                <Clock className="w-4 h-4 flex-shrink-0 opacity-60" />
                <span className="text-[12px] font-mono font-semibold">{period.time}</span>
                <div className="w-px h-4 bg-current opacity-20 flex-shrink-0" />
                <span className="text-sm font-bold">Class {period.class}</span>
                <span className="text-[11px] opacity-70 ml-auto">{period.room}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Weekly Timetable */}
      <div className="space-y-4">
        {DAYS.map((day) => {
          const periods = TIMETABLE[day] || [];
          const isToday = day === todayDay;
          return (
            <div key={day} className={`rounded-2xl border ${isToday ? "border-blue-300 dark:border-blue-500/40" : "border-slate-200 dark:border-slate-800"} bg-white dark:bg-slate-900 overflow-hidden`}>
              <div className={`px-5 py-3 border-b ${isToday ? "bg-blue-600 border-blue-600" : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isToday ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                    {DAY_LABELS[day]} {isToday && "(Today)"}
                  </span>
                  <span className={`text-[11px] font-semibold ${isToday ? "text-blue-100" : "text-slate-400"}`}>
                    {periods.length} period{periods.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              {periods.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {periods.map((period, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <span className="text-[12px] font-mono text-slate-400 w-32 flex-shrink-0">{period.time}</span>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-xl border ${CLASS_COLORS[period.class] || ""}`}>Class {period.class}</span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{period.subject}</span>
                      <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold">{period.room}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-5 py-4 text-center text-sm text-slate-400">No classes on this day</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}