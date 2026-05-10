// src/app/(dashboard)/admin/timetable/page.js

"use client";

import { useState } from "react";
import { Calendar, ChevronDown, BookOpen, Clock, Plus, Download } from "lucide-react";

const CLASSES = ["6-A", "6-B", "7-A", "7-B", "8-A", "9-A", "9-B", "10-A", "10-B"];
const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];
const DAY_LABELS = { MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday", FRI: "Friday" };

const TIME_SLOTS = [
  "09:00 - 09:45", "09:45 - 10:30", "10:30 - 10:45 (Break)",
  "10:45 - 11:30", "11:30 - 12:15", "12:15 - 01:00 (Lunch)",
  "01:00 - 01:45", "01:45 - 02:30", "02:30 - 03:15",
];

const TIMETABLE_DATA = {
  "MON": [
    { time: "09:00 - 09:45", subject: "Mathematics", teacher: "Suresh Kumar", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { time: "09:45 - 10:30", subject: "Science", teacher: "Radha Devi", color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { time: "10:45 - 11:30", subject: "English", teacher: "Priya Sharma", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    { time: "11:30 - 12:15", subject: "Social Studies", teacher: "Ravi Nair", color: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    { time: "01:00 - 01:45", subject: "Telugu", teacher: "Lakshmi Rao", color: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { time: "01:45 - 02:30", subject: "Hindi", teacher: "Venkatesh N", color: "bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400" },
  ],
  "TUE": [
    { time: "09:00 - 09:45", subject: "Science", teacher: "Radha Devi", color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { time: "09:45 - 10:30", subject: "Mathematics", teacher: "Suresh Kumar", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { time: "10:45 - 11:30", subject: "Hindi", teacher: "Venkatesh N", color: "bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400" },
    { time: "11:30 - 12:15", subject: "English", teacher: "Priya Sharma", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    { time: "01:00 - 01:45", subject: "Social Studies", teacher: "Ravi Nair", color: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    { time: "01:45 - 02:30", subject: "Telugu", teacher: "Lakshmi Rao", color: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  ],
  "WED": [
    { time: "09:00 - 09:45", subject: "English", teacher: "Priya Sharma", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    { time: "09:45 - 10:30", subject: "Telugu", teacher: "Lakshmi Rao", color: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { time: "10:45 - 11:30", subject: "Mathematics", teacher: "Suresh Kumar", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { time: "11:30 - 12:15", subject: "Science", teacher: "Radha Devi", color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { time: "01:00 - 01:45", subject: "Computer Science", teacher: "Kiran Babu", color: "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400" },
    { time: "01:45 - 02:30", subject: "Social Studies", teacher: "Ravi Nair", color: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400" },
  ],
  "THU": [
    { time: "09:00 - 09:45", subject: "Telugu", teacher: "Lakshmi Rao", color: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
    { time: "09:45 - 10:30", subject: "Hindi", teacher: "Venkatesh N", color: "bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400" },
    { time: "10:45 - 11:30", subject: "Social Studies", teacher: "Ravi Nair", color: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400" },
    { time: "11:30 - 12:15", subject: "Mathematics", teacher: "Suresh Kumar", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { time: "01:00 - 01:45", subject: "Science", teacher: "Radha Devi", color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { time: "01:45 - 02:30", subject: "English", teacher: "Priya Sharma", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  ],
  "FRI": [
    { time: "09:00 - 09:45", subject: "Mathematics", teacher: "Suresh Kumar", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
    { time: "09:45 - 10:30", subject: "English", teacher: "Priya Sharma", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    { time: "10:45 - 11:30", subject: "Science", teacher: "Radha Devi", color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
    { time: "11:30 - 12:15", subject: "Hindi", teacher: "Venkatesh N", color: "bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400" },
    { time: "01:00 - 02:30", subject: "Physical Education", teacher: "Ramesh G", color: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400" },
  ],
};

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [view, setView] = useState("weekly");
  const todayDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Timetable</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Class schedule management</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> Add Period
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none transition-all">
            {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        <div className="flex gap-2">
          {["weekly", "daily"].map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${view === v ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Timetable View */}
      {view === "weekly" ? (
        <div className="space-y-4">
          {DAYS.map((day) => {
            const periods = TIMETABLE_DATA[day] || [];
            const isToday = day === todayDay;
            return (
              <div key={day} className={`rounded-2xl border ${isToday ? "border-blue-300 dark:border-blue-500/40" : "border-slate-200 dark:border-slate-800"} bg-white dark:bg-slate-900 overflow-hidden`}>
                <div className={`px-5 py-3 border-b ${isToday ? "bg-blue-600 border-blue-600" : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800"}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isToday ? "text-white" : "text-slate-700 dark:text-slate-300"}`}>
                      {DAY_LABELS[day]} {isToday && <span className="ml-2 text-[11px] bg-white/20 px-2 py-0.5 rounded-full">Today</span>}
                    </span>
                    <span className={`text-[11px] font-semibold ${isToday ? "text-blue-100" : "text-slate-400"}`}>{periods.length} periods</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {periods.map((period, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <div className="flex items-center gap-2 w-36 flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-[12px] font-mono text-slate-400 dark:text-slate-500">{period.time}</span>
                      </div>
                      <span className={`text-sm font-semibold px-3 py-1.5 rounded-xl ${period.color}`}>
                        {period.subject}
                      </span>
                      <span className="text-[12px] text-slate-400 dark:text-slate-500 flex-1">{period.teacher}</span>
                      <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Daily view */
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {DAY_LABELS[todayDay] || "Monday"}&apos;s Schedule — Class {selectedClass}
            </h3>
          </div>
          <div className="space-y-2 p-4">
            {(TIMETABLE_DATA[todayDay] || TIMETABLE_DATA["MON"]).map((period, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl ${period.color} border border-current border-opacity-20`}>
                <div className="text-center w-16 flex-shrink-0">
                  <p className="text-[10px] font-semibold opacity-70">Period {i + 1}</p>
                  <p className="text-[11px] font-mono font-bold">{period.time.split(" - ")[0]}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{period.subject}</p>
                  <p className="text-[11px] opacity-70">{period.teacher}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}