// src/app/(dashboard)/student/page.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2, XCircle, BookOpenCheck, FileText, Calendar,
  Clock, Star, ChevronRight, GraduationCap, IndianRupee,
  Zap, Trophy, Sun, Target, AlertCircle,
} from "lucide-react";

const STUDENT_DATA = {
  name: "Aarav Sharma",
  class: "10",
  section: "A",
  rollNo: 5,
  attendanceToday: "PRESENT",
  attendancePct: 88,
  attendancePresent: 141,
  attendanceTotal: 160,
  pendingHomework: 2,
  feeStatus: "CLEAR",
  pendingFees: 0,
  results: [
    { exam: "Unit Test 1", total: 220, maxTotal: 250, pct: 88, grade: "A", rank: 3 },
    { exam: "Quarterly", total: 680, maxTotal: 750, pct: 91, grade: "A+", rank: 2 },
  ],
  upcomingExams: [
    { name: "Unit Test 2", date: "Apr 10, 2025", subjects: ["Mathematics", "Science"] },
    { name: "Mid-Term", date: "Apr 20, 2025", subjects: ["All Subjects"] },
  ],
  timetable: [
    { time: "09:00", subject: "Mathematics", teacher: "Suresh Kumar", room: "R1" },
    { time: "09:45", subject: "Science", teacher: "Radha Devi", room: "Lab" },
    { time: "10:45", subject: "English", teacher: "Priya Sharma", room: "R1" },
    { time: "11:30", subject: "Social Studies", teacher: "Ravi Nair", room: "R2" },
    { time: "01:00", subject: "Telugu", teacher: "Lakshmi Rao", room: "R1" },
  ],
  homework: [
    { subject: "Mathematics", title: "Quadratic Equations - Ex 4.3", dueDate: "Tomorrow", status: "PENDING" },
    { subject: "Science", title: "Chemical Reactions Lab Report", dueDate: "Today", status: "PENDING" },
    { subject: "English", title: "Essay: Climate Change", dueDate: "Mar 25", status: "SUBMITTED" },
  ],
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", emoji: "☀️" };
  if (h < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
}

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [student] = useState(STUDENT_DATA);
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-1">{today}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting.text}, {student.name.split(" ")[0]}! {greeting.emoji}
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Class {student.class}-{student.section} • Roll #{student.rollNo} • Academic Year 2024-25
          </p>
          {/* Quick stats inline */}
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { label: "Attendance", value: `${student.attendancePct}%`, icon: CheckCircle2, color: "text-emerald-300" },
              { label: "Pending HW", value: student.pendingHomework, icon: BookOpenCheck, color: "text-amber-300" },
              { label: "Best Rank", value: "#2", icon: Trophy, color: "text-yellow-300" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-1.5">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-white text-sm font-semibold">{stat.value}</span>
                <span className="text-blue-200 text-xs">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Status Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Attendance Today */}
        <div className={`col-span-2 sm:col-span-1 rounded-2xl p-4 text-center border-2 ${student.attendanceToday === "PRESENT" ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10" : "border-red-300 dark:border-red-500/40 bg-red-50 dark:bg-red-500/10"}`}>
          {student.attendanceToday === "PRESENT"
            ? <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1" />
            : <XCircle className="w-8 h-8 text-red-500 mx-auto mb-1" />
          }
          <p className={`text-sm font-bold ${student.attendanceToday === "PRESENT" ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
            {student.attendanceToday === "PRESENT" ? "✅ Present Today" : "❌ Absent Today"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">{student.attendancePct}% overall</p>
        </div>

        {[
          { label: "Homework Due", value: student.pendingHomework, unit: "tasks", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
          { label: "Upcoming Exams", value: student.upcomingExams.length, unit: "scheduled", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
          { label: "Fee Status", value: student.feeStatus, unit: "", color: student.feeStatus === "CLEAR" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400", bg: student.feeStatus === "CLEAR" ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20" },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl border p-4 text-center ${stat.bg}`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.unit || stat.label}</p>
            <p className="text-[10px] text-slate-400">{stat.unit ? stat.label : ""}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Timetable */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" /> Today&apos;s Classes
            </h3>
            <Link href="/student/timetable" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Full Timetable <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {student.timetable.map((period, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <span className="text-[11px] text-slate-400 font-mono w-12 flex-shrink-0">{period.time}</span>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{period.subject}</p>
                  <p className="text-[10px] text-slate-400">{period.teacher}</p>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded flex-shrink-0">{period.room}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Homework */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpenCheck className="w-4 h-4 text-blue-500" /> Homework
            </h3>
            <Link href="/student/homework" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              All Tasks <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {student.homework.map((hw, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${hw.status === "SUBMITTED" ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20" : "bg-slate-50 dark:bg-slate-800/60"}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${hw.status === "SUBMITTED" ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-amber-100 dark:bg-amber-500/10"}`}>
                  {hw.status === "SUBMITTED" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{hw.subject}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{hw.title}</p>
                  <p className={`text-[10px] font-bold mt-0.5 ${hw.status === "SUBMITTED" ? "text-emerald-600 dark:text-emerald-400" : hw.dueDate === "Today" ? "text-red-500" : "text-amber-600 dark:text-amber-400"}`}>
                    {hw.status === "SUBMITTED" ? "✅ Submitted" : `Due: ${hw.dueDate}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Results */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Recent Results
            </h3>
            <Link href="/student/results" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {student.results.map((result, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{result.exam}</p>
                  <p className="text-[11px] text-slate-400">Rank #{result.rank} in class</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{result.total}/{result.maxTotal}</p>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{result.pct}% • {result.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" /> Upcoming Exams
          </h3>
          <div className="space-y-3">
            {student.upcomingExams.map((exam, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{exam.name}</p>
                  <p className="text-[12px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {exam.date}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{exam.subjects.join(" • ")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}