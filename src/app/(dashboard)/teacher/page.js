// src/app/(dashboard)/teacher/page.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare, BookOpenCheck, Calendar, Users, Clock,
  BarChart3, ChevronRight, Sun, TrendingUp, Bell,
  BookOpen, Award, ArrowRight, Zap,
} from "lucide-react";

const TEACHER_DATA = {
  name: "Suresh Kumar",
  subject: "Mathematics",
  classes: ["9-A", "9-B", "10-A", "10-B"],
  attendanceToday: "PRESENT",
  checkInTime: "09:05 AM",
  myClasses: [
    { class: "9-A", students: 42, section: "A", nextPeriod: "09:45 AM", attendanceMarked: true },
    { class: "9-B", students: 38, section: "B", nextPeriod: "11:30 AM", attendanceMarked: false },
    { class: "10-A", students: 45, section: "A", nextPeriod: "01:00 PM", attendanceMarked: false },
    { class: "10-B", students: 44, section: "B", nextPeriod: "02:45 PM", attendanceMarked: false },
  ],
  pendingHomework: [
    { class: "9-A", subject: "Mathematics", title: "Quadratic Equations", dueDate: "Tomorrow", submissions: 38, total: 42 },
    { class: "10-A", subject: "Mathematics", title: "Calculus Exercise 5", dueDate: "Mar 25", submissions: 30, total: 45 },
  ],
  todaySchedule: [
    { time: "09:00", class: "9-A", room: "R3", subject: "Mathematics" },
    { time: "10:45", class: "10-A", room: "R1", subject: "Mathematics" },
    { time: "01:00", class: "9-B", room: "R3", subject: "Mathematics" },
    { time: "02:45", class: "10-B", room: "R2", subject: "Mathematics" },
  ],
  notifications: [
    { id: 1, title: "Unit Test 1 Schedule Released", message: "Classes 9 & 10 — March 25-27", time: "1 hr ago", read: false },
    { id: 2, title: "PTM on April 5th", message: "Parent-Teacher Meeting — 10 AM to 1 PM", time: "Yesterday", read: true },
  ],
  monthlyAttendance: { present: 18, total: 20 },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good Morning", emoji: "☀️" };
  if (h < 17) return { text: "Good Afternoon", emoji: "🌤️" };
  return { text: "Good Evening", emoji: "🌙" };
}

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [teacher] = useState(TEACHER_DATA);
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const attendancePct = Math.round((teacher.monthlyAttendance.present / teacher.monthlyAttendance.total) * 100);
  const classesNotMarked = teacher.myClasses.filter((c) => !c.attendanceMarked).length;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const quickActions = [
    { label: "Mark Attendance", href: "/teacher/attendance", icon: CheckSquare, gradient: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/20" },
    { label: "My Classes", href: "/teacher/my-classes", icon: Users, gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20" },
    { label: "Homework", href: "/teacher/homework", icon: BookOpenCheck, gradient: "from-purple-500 to-violet-600", shadow: "shadow-purple-500/20" },
    { label: "Timetable", href: "/teacher/timetable", icon: Calendar, gradient: "from-orange-500 to-amber-600", shadow: "shadow-orange-500/20" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm mb-1">{today}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting.text}, {teacher.name.split(" ")[0]}! {greeting.emoji}
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            {teacher.subject} Teacher • {teacher.classes.length} Classes Assigned
          </p>
          {classesNotMarked > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-400/20 border border-amber-300/30">
              <Bell className="w-4 h-4 text-amber-300" />
              <span className="text-amber-100 text-sm font-semibold">
                {classesNotMarked} class{classesNotMarked > 1 ? "es" : ""} need attendance marking
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "My Classes", value: teacher.classes.length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
          { label: "Attendance Due", value: classesNotMarked, color: classesNotMarked > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400", bg: classesNotMarked > 0 ? "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
          { label: "Homework Tasks", value: teacher.pendingHomework.length, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
          { label: "My Attendance %", value: `${attendancePct}%`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
        ].map((s) => (
          <div key={s.label} className={`text-center p-4 rounded-2xl border ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg ${action.shadow} hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95`}>
                <Icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-bold text-white text-center">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Classes */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" /> My Classes Today
            </h3>
            <Link href="/teacher/my-classes" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {teacher.myClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.attendanceMarked ? "bg-emerald-100 dark:bg-emerald-500/10" : "bg-blue-100 dark:bg-blue-500/10"}`}>
                  <span className={`text-sm font-bold ${cls.attendanceMarked ? "text-emerald-600 dark:text-emerald-400" : "text-blue-600 dark:text-blue-400"}`}>
                    {cls.class}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">Class {cls.class}</p>
                  <p className="text-[11px] text-slate-400">{cls.students} students</p>
                </div>
                {cls.attendanceMarked ? (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg">✅ Marked</span>
                ) : (
                  <Link href="/teacher/attendance" className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                    Mark Now
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" /> Today&apos;s Schedule
          </h3>
          <div className="space-y-2">
            {teacher.todaySchedule.map((period, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <span className="text-[11px] font-mono text-slate-400 w-12 flex-shrink-0">{period.time}</span>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white">Class {period.class}</p>
                  <p className="text-[11px] text-slate-400">{period.subject}</p>
                </div>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-semibold">{period.room}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}