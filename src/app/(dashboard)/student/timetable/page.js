// src/app/(dashboard)/student/timetable/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

const TIMETABLE = {
  MON: [
    { time: "09:00 - 09:45", subject: "Mathematics", teacher: "Suresh Kumar", room: "R3" },
    { time: "09:45 - 10:30", subject: "Science", teacher: "Radha Devi", room: "Lab" },
    { time: "10:45 - 11:30", subject: "English", teacher: "Priya Sharma", room: "R1" },
    { time: "11:30 - 12:15", subject: "Social Studies", teacher: "Ravi Nair", room: "R2" },
    { time: "01:00 - 01:45", subject: "Telugu", teacher: "Lakshmi Rao", room: "R1" },
    { time: "01:45 - 02:30", subject: "Hindi", teacher: "Venkatesh N", room: "R3" },
  ],
  TUE: [
    { time: "09:00 - 09:45", subject: "Science", teacher: "Radha Devi", room: "Lab" },
    { time: "09:45 - 10:30", subject: "Mathematics", teacher: "Suresh Kumar", room: "R3" },
    { time: "10:45 - 11:30", subject: "Hindi", teacher: "Venkatesh N", room: "R3" },
    { time: "11:30 - 12:15", subject: "English", teacher: "Priya Sharma", room: "R1" },
    { time: "01:00 - 01:45", subject: "Social Studies", teacher: "Ravi Nair", room: "R2" },
    { time: "01:45 - 02:30", subject: "Telugu", teacher: "Lakshmi Rao", room: "R1" },
  ],
  WED: [
    { time: "09:00 - 09:45", subject: "English", teacher: "Priya Sharma", room: "R1" },
    { time: "09:45 - 10:30", subject: "Telugu", teacher: "Lakshmi Rao", room: "R1" },
    { time: "10:45 - 11:30", subject: "Mathematics", teacher: "Suresh Kumar", room: "R3" },
    { time: "11:30 - 12:15", subject: "Science", teacher: "Radha Devi", room: "Lab" },
    { time: "01:00 - 01:45", subject: "Computer", teacher: "Kiran Babu", room: "CompLab" },
    { time: "01:45 - 02:30", subject: "Social Studies", teacher: "Ravi Nair", room: "R2" },
  ],
  THU: [
    { time: "09:00 - 09:45", subject: "Telugu", teacher: "Lakshmi Rao", room: "R1" },
    { time: "09:45 - 10:30", subject: "Hindi", teacher: "Venkatesh N", room: "R3" },
    { time: "10:45 - 11:30", subject: "Social Studies", teacher: "Ravi Nair", room: "R2" },
    { time: "11:30 - 12:15", subject: "Mathematics", teacher: "Suresh Kumar", room: "R3" },
    { time: "01:00 - 01:45", subject: "Science", teacher: "Radha Devi", room: "Lab" },
    { time: "01:45 - 02:30", subject: "English", teacher: "Priya Sharma", room: "R1" },
  ],
  FRI: [
    { time: "09:00 - 09:45", subject: "Mathematics", teacher: "Suresh Kumar", room: "R3" },
    { time: "09:45 - 10:30", subject: "English", teacher: "Priya Sharma", room: "R1" },
    { time: "10:45 - 11:30", subject: "Science", teacher: "Radha Devi", room: "Lab" },
    { time: "11:30 - 12:15", subject: "Hindi", teacher: "Venkatesh N", room: "R3" },
    { time: "01:00 - 02:30", subject: "Physical Education", teacher: "Ramesh G", room: "Ground" },
  ],
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_LABELS = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };

const SUBJECT_COLORS = {
  Mathematics: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Science: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  English: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
  "Social Studies": "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400",
  Telugu: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Hindi: "bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400",
  Computer: "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
  "Physical Education": "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
};

const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];

export default function StudentTimetablePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/student" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Timetable</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Class 10-A • Weekly Schedule</p>
        </div>
      </div>

      {DAYS.map((day) => {
        const periods = TIMETABLE[day] || [];
        const isToday = day === todayDay;
        return (
          <div key={day} className={`rounded-2xl border ${isToday ? "border-blue-300 dark:border-blue-500/40" : "border-slate-200 dark:border-slate-800"} bg-white dark:bg-slate-900 overflow-hidden`}>
            <div className={`px-5 py-3 border-b ${isToday ? "bg-blue-600 border-blue-600" : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800"}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-bold ${isToday ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                  {DAY_LABELS[day]} {isToday && <span className="ml-2 text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">Today</span>}
                </span>
                <span className={`text-[11px] font-semibold ${isToday ? "text-blue-100" : "text-slate-400"}`}>{periods.length} periods</span>
              </div>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {periods.map((period, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <span className="text-[12px] font-mono text-slate-400 w-36 flex-shrink-0">{period.time}</span>
                  <span className={`text-sm font-semibold px-2.5 py-1 rounded-xl ${SUBJECT_COLORS[period.subject] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                    {period.subject}
                  </span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400 flex-1">{period.teacher}</span>
                  <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-semibold">{period.room}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}