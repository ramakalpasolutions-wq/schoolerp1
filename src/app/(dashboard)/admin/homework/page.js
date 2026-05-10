// src/app/(dashboard)/admin/homework/page.js

"use client";

import { useState, useMemo } from "react";
import {
  BookOpenCheck, Plus, Search, X, CheckCircle2, Clock,
  XCircle, ChevronDown, Filter, Eye, Trash2, Users,
  Calendar, FileText,
} from "lucide-react";

const HOMEWORK_DATA = [
  { id: "HW001", title: "Quadratic Equations Exercise", subject: "Mathematics", class: "10-A", teacher: "Suresh Kumar", dueDate: "2025-03-22", assignedDate: "2025-03-18", totalStudents: 45, submitted: 38, status: "ACTIVE" },
  { id: "HW002", title: "Chemical Reactions Lab Report", subject: "Science", class: "10-B", teacher: "Radha Devi", dueDate: "2025-03-20", assignedDate: "2025-03-17", totalStudents: 44, submitted: 44, status: "COMPLETED" },
  { id: "HW003", title: "Essay on Climate Change", subject: "English", class: "9-A", teacher: "Priya Sharma", dueDate: "2025-03-25", assignedDate: "2025-03-15", totalStudents: 42, submitted: 12, status: "ACTIVE" },
  { id: "HW004", title: "Map Activity India Chapter 5", subject: "Social Studies", class: "8-A", teacher: "Ravi Nair", dueDate: "2025-03-12", assignedDate: "2025-03-10", totalStudents: 40, submitted: 38, status: "PAST" },
  { id: "HW005", title: "Grammar Exercises Chapter 8", subject: "Telugu", class: "7-A", teacher: "Lakshmi Rao", dueDate: "2025-03-18", assignedDate: "2025-03-12", totalStudents: 38, submitted: 38, status: "COMPLETED" },
  { id: "HW006", title: "Trigonometry Practice Set 3", subject: "Mathematics", class: "9-B", teacher: "Suresh Kumar", dueDate: "2025-03-28", assignedDate: "2025-03-19", totalStudents: 43, submitted: 5, status: "ACTIVE" },
  { id: "HW007", title: "Computer Networking Assignment", subject: "Computer Science", class: "10-A", teacher: "Kiran Babu", dueDate: "2025-03-30", assignedDate: "2025-03-20", totalStudents: 45, submitted: 0, status: "ACTIVE" },
  { id: "HW008", title: "Hindi Poem Recitation", subject: "Hindi", class: "6-A", teacher: "Venkatesh N", dueDate: "2025-03-15", assignedDate: "2025-03-08", totalStudents: 35, submitted: 30, status: "PAST" },
];

const STATUS_CONFIG = {
  ACTIVE: { label: "Active", bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400" },
  COMPLETED: { label: "Completed", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
  PAST: { label: "Past Due", bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400" },
};

const SUBJECT_COLORS = {
  Mathematics: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Science: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  English: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400",
  "Social Studies": "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400",
  Telugu: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Hindi: "bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400",
  "Computer Science": "bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",
};

export default function HomeworkPage() {
  const [homework, setHomework] = useState(HOMEWORK_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterSubject, setFilterSubject] = useState("All");

  const subjects = ["All", ...new Set(HOMEWORK_DATA.map((h) => h.subject))];

  const filtered = useMemo(() => {
    let data = [...homework];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((h) => h.title.toLowerCase().includes(q) || h.subject.toLowerCase().includes(q) || h.class.toLowerCase().includes(q));
    }
    if (filterStatus !== "ALL") data = data.filter((h) => h.status === filterStatus);
    if (filterSubject !== "All") data = data.filter((h) => h.subject === filterSubject);
    return data.sort((a, b) => new Date(b.assignedDate) - new Date(a.assignedDate));
  }, [homework, search, filterStatus, filterSubject]);

  const stats = {
    total: homework.length,
    active: homework.filter((h) => h.status === "ACTIVE").length,
    completed: homework.filter((h) => h.status === "COMPLETED").length,
    totalSubmissions: homework.reduce((s, h) => s + h.submitted, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Homework</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filtered.length} assignments across all classes
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Assign Homework
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Assigned", value: stats.total, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
          { label: "Active", value: stats.active, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
          { label: "Completed", value: stats.completed, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
          { label: "Total Submissions", value: stats.totalSubmissions, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center justify-between p-4 rounded-2xl border ${s.bg}`}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title, subject, class..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2">
          {["ALL", "ACTIVE", "COMPLETED", "PAST"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all whitespace-nowrap ${filterStatus === s ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ")}
            </button>
          ))}
          <div className="relative">
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 appearance-none transition-all">
              {subjects.map((s) => <option key={s} value={s}>{s === "All" ? "All Subjects" : s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Homework Cards */}
      <div className="space-y-4">
        {filtered.map((hw) => {
          const sc = STATUS_CONFIG[hw.status];
          const subjectColor = SUBJECT_COLORS[hw.subject] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
          const submissionPct = hw.totalStudents > 0 ? Math.round((hw.submitted / hw.totalStudents) * 100) : 0;

          return (
            <div key={hw.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${subjectColor} flex items-center justify-center flex-shrink-0`}>
                    <BookOpenCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{hw.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-lg ${subjectColor}`}>{hw.subject}</span>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Class {hw.class}</span>
                      <span className="text-[11px] text-slate-400">by {hw.teacher}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                    {sc.label}
                  </span>
                  <button className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Assigned: {new Date(hw.assignedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
                <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {hw.totalStudents} students
                </div>
                <div className="flex items-center gap-2 text-[12px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{hw.submitted}/{hw.totalStudents} submitted</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[11px] text-slate-400">Submission Rate</span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{submissionPct}%</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${submissionPct >= 80 ? "bg-emerald-500" : submissionPct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${submissionPct}%` }} />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-16 text-slate-400 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <BookOpenCheck className="w-14 h-14 mb-3 opacity-30" />
            <p className="font-semibold text-slate-500 dark:text-slate-400">No homework found</p>
            <p className="text-sm mt-1">Try adjusting filters or assign new homework</p>
          </div>
        )}
      </div>
    </div>
  );
}