// src/app/(dashboard)/admin/exams/page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus, FileText, Calendar, Users, CheckCircle2, Clock,
  XCircle, Filter, Search, ChevronDown, Eye, Pencil,
  BarChart3, BookOpen, Loader2, AlertCircle, X, GraduationCap,
  Star, Trophy,
} from "lucide-react";

const EXAMS_DATA = [
  { id: "EX001", name: "Unit Test 1", type: "UNIT_TEST", startDate: "2025-03-25", endDate: "2025-03-27", classes: ["9-A", "9-B", "10-A", "10-B"], status: "UPCOMING", academicYear: "2024-2025", totalStudents: 180 },
  { id: "EX002", name: "Mid-Term Examination", type: "MID_TERM", startDate: "2025-02-10", endDate: "2025-02-20", classes: ["6-A", "7-A", "8-A", "9-A", "10-A"], status: "COMPLETED", academicYear: "2024-2025", totalStudents: 420 },
  { id: "EX003", name: "Quarterly Assessment", type: "QUARTERLY", startDate: "2025-01-15", endDate: "2025-01-22", classes: ["8-A", "8-B", "9-A"], status: "COMPLETED", academicYear: "2024-2025", totalStudents: 140 },
  { id: "EX004", name: "Unit Test 2", type: "UNIT_TEST", startDate: "2025-04-10", endDate: "2025-04-12", classes: ["6-A", "6-B", "7-A"], status: "UPCOMING", academicYear: "2024-2025", totalStudents: 110 },
  { id: "EX005", name: "Annual Final Examination", type: "ANNUAL", startDate: "2025-04-25", endDate: "2025-05-10", classes: ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B"], status: "UPCOMING", academicYear: "2024-2025", totalStudents: 480 },
  { id: "EX006", name: "Half-Yearly Exam", type: "HALF_YEARLY", startDate: "2024-10-05", endDate: "2024-10-15", classes: ["9-A", "9-B", "10-A"], status: "COMPLETED", academicYear: "2024-2025", totalStudents: 130 },
];

const STATUS_CONFIG = {
  UPCOMING: { label: "Upcoming", bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", dot: "bg-blue-500", icon: Clock },
  ONGOING: { label: "Ongoing", bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500", icon: CheckCircle2 },
  COMPLETED: { label: "Completed", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", dot: "bg-red-500", icon: XCircle },
};

const TYPE_LABELS = {
  UNIT_TEST: "Unit Test", MID_TERM: "Mid-Term", QUARTERLY: "Quarterly",
  HALF_YEARLY: "Half-Yearly", ANNUAL: "Annual", FINAL: "Final", MOCK: "Mock Test",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function ExamsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterYear, setFilterYear] = useState("2024-2025");
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = useMemo(() => {
    let data = [...EXAMS_DATA];
    if (search.trim()) data = data.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
    if (filterStatus !== "ALL") data = data.filter((e) => e.status === filterStatus);
    if (filterYear !== "ALL") data = data.filter((e) => e.academicYear === filterYear);
    return data;
  }, [search, filterStatus, filterYear]);

  const stats = {
    total: EXAMS_DATA.length,
    upcoming: EXAMS_DATA.filter((e) => e.status === "UPCOMING").length,
    completed: EXAMS_DATA.filter((e) => e.status === "COMPLETED").length,
    ongoing: EXAMS_DATA.filter((e) => e.status === "ONGOING").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Examinations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage exams, marks, and results</p>
        </div>
        <Link
          href="/admin/exams/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Exam
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Exams", value: stats.total, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700" },
          { label: "Upcoming", value: stats.upcoming, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
          { label: "Completed", value: stats.completed, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
          { label: "Ongoing", value: stats.ongoing, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
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
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams..."
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${filterStatus !== "ALL" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900"}`}
            >
              <Filter className="w-4 h-4" />
              {filterStatus === "ALL" ? "All Status" : filterStatus.replace("_", " ")}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {["ALL", "UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].map((s) => (
                    <button key={s} onClick={() => { setFilterStatus(s); setStatusOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterStatus === s ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      {s === "ALL" ? "All Status" : s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((exam) => {
          const sc = STATUS_CONFIG[exam.status] || STATUS_CONFIG.UPCOMING;
          const StatusIcon = sc.icon;
          return (
            <div key={exam.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{exam.name}</h3>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{TYPE_LABELS[exam.type] || exam.type}</span>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold flex-shrink-0 ${sc.bg} ${sc.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formatDate(exam.startDate)} — {formatDate(exam.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{exam.classes.length} classes</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{exam.totalStudents} students</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {exam.classes.slice(0, 4).map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">{c}</span>
                ))}
                {exam.classes.length > 4 && <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold">+{exam.classes.length - 4}</span>}
              </div>
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link href={`/admin/exams/${exam.id}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[12px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View
                </Link>
                <Link href={`/admin/exams/${exam.id}/marks`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[12px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Enter Marks
                </Link>
                <Link href={`/admin/exams/${exam.id}/results`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[12px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                  <BarChart3 className="w-3.5 h-3.5" /> Results
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <FileText className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-semibold text-slate-500 dark:text-slate-400">No exams found</p>
          <Link href="/admin/exams/create" className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">+ Create your first exam</Link>
        </div>
      )}
    </div>
  );
}