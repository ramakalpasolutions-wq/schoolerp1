// src/app/(dashboard)/student/homework/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock, XCircle, Upload, Calendar } from "lucide-react";

const HOMEWORK = [
  { id: 1, subject: "Mathematics", title: "Quadratic Equations Ex 4.3", dueDate: "Mar 22, 2025", teacher: "Suresh Kumar", status: "PENDING", description: "Complete exercises 1-15 from the textbook." },
  { id: 2, subject: "Science", title: "Chemical Reactions Lab Report", dueDate: "Mar 20, 2025", teacher: "Radha Devi", status: "LATE", submittedDate: "Mar 21, 2025", description: "Write a detailed lab report on the experiments conducted." },
  { id: 3, subject: "English", title: "Essay on Climate Change", dueDate: "Mar 25, 2025", teacher: "Priya Sharma", status: "PENDING", description: "Write a 500-word essay with examples from current events." },
  { id: 4, subject: "Social Studies", title: "Map Activity — India", dueDate: "Mar 12, 2025", teacher: "Ravi Nair", status: "SUBMITTED", submittedDate: "Mar 12, 2025", description: "Complete the map labeling activity from Chapter 5." },
  { id: 5, subject: "Telugu", title: "Grammar Exercises Chapter 8", dueDate: "Mar 18, 2025", teacher: "Lakshmi Rao", status: "SUBMITTED", submittedDate: "Mar 17, 2025", description: "Complete all grammar exercises." },
];

const statusConfig = {
  SUBMITTED: { label: "Submitted", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  LATE: { label: "Late Submitted", bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", icon: Clock },
  PENDING: { label: "Pending", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", icon: XCircle },
};

export default function StudentHomeworkPage() {
  const pending = HOMEWORK.filter((h) => h.status === "PENDING").length;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/student" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Homework</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{pending} tasks pending</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Submitted", value: HOMEWORK.filter((h) => h.status === "SUBMITTED").length, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Pending", value: pending, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Late", value: HOMEWORK.filter((h) => h.status === "LATE").length, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
        ].map((s) => (
          <div key={s.label} className={`text-center p-4 rounded-2xl border border-slate-200 dark:border-slate-700 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {HOMEWORK.map((hw) => {
          const sc = statusConfig[hw.status];
          const Icon = sc.icon;
          const isPending = hw.status === "PENDING";
          return (
            <div key={hw.id} className={`rounded-2xl border ${isPending ? "border-amber-200 dark:border-amber-500/30" : "border-slate-200 dark:border-slate-800"} bg-white dark:bg-slate-900 p-5`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${sc.bg}`}>
                    <Icon className={`w-4 h-4 ${sc.text}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{hw.title}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">{hw.subject} • {hw.teacher}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${sc.bg} ${sc.text} flex-shrink-0`}>
                  {sc.label}
                </span>
              </div>
              {hw.description && <p className="text-[12px] text-slate-500 dark:text-slate-400 mb-3 pl-12">{hw.description}</p>}
              <div className="flex items-center justify-between pl-12">
                <div className="flex items-center gap-1.5 text-[12px]">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className={`font-semibold ${isPending ? "text-amber-600 dark:text-amber-400" : "text-slate-500 dark:text-slate-400"}`}>Due: {hw.dueDate}</span>
                  {hw.submittedDate && <span className="text-slate-400 ml-2">• Submitted: {hw.submittedDate}</span>}
                </div>
                {isPending && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                    <Upload className="w-3 h-3" /> Submit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}