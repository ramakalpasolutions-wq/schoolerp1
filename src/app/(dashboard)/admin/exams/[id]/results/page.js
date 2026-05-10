// src/app/(dashboard)/admin/exams/[id]/results/page.js

"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Trophy, Star, Download, Printer, ChevronDown,
  Users, CheckCircle2, XCircle, BarChart3, Award, FileText,
  Search, X,
} from "lucide-react";
import ReportCard from "../../../../../components/exams/ReportCard";

const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Telugu"];
const MAX_MARKS = 100;

const generateResults = () => {
  const names = [
    "Aarav Sharma", "Priya Reddy", "Karthik Kumar", "Sneha Patel", "Ravi Nair",
    "Ananya Singh", "Vikram Rao", "Divya Menon", "Suresh Babu", "Kavya Krishnan",
    "Arjun Gupta", "Meera Iyer", "Rohan Das", "Sonia Thomas", "Akash Joshi",
    "Pooja Verma", "Nikhil C", "Simran Kaur", "Rahul Mishra", "Deepika P",
  ];
  return names.map((name, i) => {
    const subjectMarks = SUBJECTS.map((sub) => {
      const base = Math.floor(40 + Math.random() * 60);
      return { subject: sub, marks: Math.min(base, MAX_MARKS), maxMarks: MAX_MARKS };
    });
    if (i === 3) { subjectMarks[0].marks = 28; subjectMarks[2].marks = 25; }
    if (i === 12) { subjectMarks[1].marks = 30; }
    const total = subjectMarks.reduce((s, m) => s + m.marks, 0);
    const maxTotal = SUBJECTS.length * MAX_MARKS;
    const pct = Math.round((total / maxTotal) * 100);
    return {
      id: `STU${String(i + 1).padStart(3, "0")}`,
      rollNo: i + 1,
      name,
      admissionNo: `ADM/2024/${String(i + 1).padStart(4, "0")}`,
      subjectMarks,
      total,
      maxTotal,
      percentage: pct,
      grade: pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : pct >= 35 ? "D" : "F",
      isPassed: pct >= 35 && subjectMarks.every((m) => (m.marks / m.maxMarks) * 100 >= 35),
      rank: 0,
      attendancePct: Math.floor(75 + Math.random() * 25),
    };
  }).sort((a, b) => b.total - a.total).map((s, i) => ({ ...s, rank: i + 1 }));
};

const RESULTS_DATA = generateResults();

const gradeColors = {
  "A+": "text-emerald-600 dark:text-emerald-400",
  "A": "text-blue-600 dark:text-blue-400",
  "B+": "text-indigo-600 dark:text-indigo-400",
  "B": "text-purple-600 dark:text-purple-400",
  "C": "text-amber-600 dark:text-amber-400",
  "D": "text-orange-600 dark:text-orange-400",
  "F": "text-red-600 dark:text-red-400",
};

export default function ResultsPage() {
  const params = useParams();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReportCard, setShowReportCard] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return RESULTS_DATA;
    const q = search.toLowerCase();
    return RESULTS_DATA.filter((r) => r.name.toLowerCase().includes(q) || r.admissionNo.toLowerCase().includes(q));
  }, [search]);

  const stats = {
    passed: RESULTS_DATA.filter((r) => r.isPassed).length,
    failed: RESULTS_DATA.filter((r) => !r.isPassed).length,
    total: RESULTS_DATA.length,
    avg: Math.round(RESULTS_DATA.reduce((s, r) => s + r.percentage, 0) / RESULTS_DATA.length),
    topScore: RESULTS_DATA[0]?.percentage || 0,
  };

  const topper = RESULTS_DATA[0];

  function openReportCard(student) {
    setSelectedStudent(student);
    setShowReportCard(true);
  }

  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href={`/admin/exams/${params.id}`} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Exam Results</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Mid-Term Examination 2025 — Class 10-A</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all active:scale-95">
              <FileText className="w-4 h-4" /> Generate All Report Cards
            </button>
          </div>
        </div>

        {/* Topper Banner */}
        {topper && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-amber-100 text-xs font-bold uppercase tracking-wider">🏆 Class Topper</p>
                <p className="text-white text-xl font-bold">{topper.name}</p>
                <p className="text-amber-100 text-sm mt-0.5">
                  {topper.total}/{topper.maxTotal} marks • {topper.percentage}% • Grade {topper.grade}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Total Students", value: stats.total, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800" },
            { label: "Passed", value: stats.passed, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            { label: "Failed", value: stats.failed, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
            { label: "Class Avg %", value: `${stats.avg}%`, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
            { label: "Top Score", value: `${stats.topScore}%`, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          ].map((stat) => (
            <div key={stat.label} className={`flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-medium text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>

        {/* Results Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                  {SUBJECTS.map((s) => (
                    <th key={s} className="px-3 py-3.5 text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      {s.slice(0, 5)}
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">%</th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grade</th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">RC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((result) => {
                  const isTopper = result.rank === 1;
                  const isFailed = !result.isPassed;
                  return (
                    <tr key={result.id} className={`transition-colors ${isTopper ? "bg-amber-50/50 dark:bg-amber-500/5" : isFailed ? "bg-red-50/50 dark:bg-red-500/5" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"}`}>
                      <td className="px-4 py-3.5">
                        {result.rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${result.rank === 1 ? "bg-amber-400 text-white" : result.rank === 2 ? "bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200" : "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200"}`}>
                            {result.rank}
                          </span>
                        ) : (
                          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{result.rank}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isTopper ? "bg-gradient-to-br from-amber-400 to-yellow-500" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}>
                            <span className="text-white text-[10px] font-bold">{result.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">{result.name}</p>
                            <p className="text-[10px] text-slate-400">{result.admissionNo}</p>
                          </div>
                          {isTopper && <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                        </div>
                      </td>
                      {result.subjectMarks.map((sm, i) => {
                        const subPct = (sm.marks / sm.maxMarks) * 100;
                        const subPassed = subPct >= 35;
                        return (
                          <td key={i} className={`px-3 py-3.5 text-center text-sm font-bold ${!subPassed ? "text-red-600 dark:text-red-400" : subPct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-700 dark:text-slate-300"}`}>
                            {sm.marks}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3.5 text-center text-sm font-bold text-slate-900 dark:text-white">{result.total}/{result.maxTotal}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-sm font-bold ${result.percentage >= 75 ? "text-emerald-600 dark:text-emerald-400" : result.percentage >= 35 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                          {result.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`text-sm ${gradeColors[result.grade] || ""}`}>{result.grade}</span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${result.isPassed ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"}`}>
                          {result.isPassed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {result.isPassed ? "Pass" : "Fail"}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <button
                          onClick={() => openReportCard(result)}
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                          title="View Report Card"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showReportCard && selectedStudent && (
        <ReportCard
          student={selectedStudent}
          examName="Mid-Term Examination 2025"
          academicYear="2024-2025"
          school={{ name: "Sri Vidya High School", address: "Main Road, Rajyampet, AP - 516115", phone: "9876543210" }}
          onClose={() => setShowReportCard(false)}
        />
      )}
    </>
  );
}