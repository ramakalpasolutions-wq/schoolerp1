// src/app/(dashboard)/teacher/my-classes/page.js

"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, CheckSquare, BookOpenCheck, Calendar, BarChart3, ChevronRight, ArrowLeft } from "lucide-react";

const MY_CLASSES = [
  { id: "cls_9a", class: "9", section: "A", students: 42, subject: "Mathematics", nextPeriod: "09:45 AM", attendanceMarked: true, avgAttendance: 88, recentTopics: ["Quadratic Equations", "Polynomials"], pendingHomework: 2 },
  { id: "cls_9b", class: "9", section: "B", students: 38, subject: "Mathematics", nextPeriod: "11:30 AM", attendanceMarked: false, avgAttendance: 82, recentTopics: ["Number Theory", "Real Numbers"], pendingHomework: 1 },
  { id: "cls_10a", class: "10", section: "A", students: 45, subject: "Mathematics", nextPeriod: "01:00 PM", attendanceMarked: false, avgAttendance: 91, recentTopics: ["Calculus", "Trigonometry"], pendingHomework: 3 },
  { id: "cls_10b", class: "10", section: "B", students: 44, subject: "Mathematics", nextPeriod: "02:45 PM", attendanceMarked: false, avgAttendance: 79, recentTopics: ["Statistics", "Probability"], pendingHomework: 0 },
];

export default function MyClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/teacher" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Classes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{MY_CLASSES.length} classes assigned</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MY_CLASSES.map((cls) => (
          <div key={cls.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white text-xl font-bold">{cls.class}{cls.section}</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Class {cls.class}-{cls.section}</h3>
                  <p className="text-[12px] text-slate-400">{cls.subject} • {cls.students} students</p>
                </div>
              </div>
              {cls.attendanceMarked ? (
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-500/20">✅ Marked</span>
              ) : (
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-200 dark:border-amber-500/20">⚠️ Pending</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className={`text-lg font-bold ${cls.avgAttendance >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{cls.avgAttendance}%</p>
                <p className="text-[10px] text-slate-400">Avg Attend.</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className="text-lg font-bold text-slate-900 dark:text-white">{cls.students}</p>
                <p className="text-[10px] text-slate-400">Students</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                <p className={`text-lg font-bold ${cls.pendingHomework > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>{cls.pendingHomework}</p>
                <p className="text-[10px] text-slate-400">HW Tasks</p>
              </div>
            </div>

            <div className="flex gap-2">
              {!cls.attendanceMarked && (
                <Link href="/teacher/attendance" className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-bold transition-colors">
                  <CheckSquare className="w-3.5 h-3.5" /> Mark Attendance
                </Link>
              )}
              <Link href={`/teacher/homework`} className={`${cls.attendanceMarked ? "flex-1" : ""} flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-semibold transition-colors`}>
                <BookOpenCheck className="w-3.5 h-3.5" /> Homework
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}