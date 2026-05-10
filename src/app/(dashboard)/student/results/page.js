// src/app/(dashboard)/student/results/page.js

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  Star,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  BarChart3,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  ChevronDown,
  Download,
  Printer,
  GraduationCap,
  Medal,
} from "lucide-react";
import { useState } from "react";
import ReportCard from "@/components/exams/ReportCard";

const RESULTS = [
  {
    id: "R1", examName: "Unit Test 1", type: "UNIT_TEST", month: "August 2024",
    total: 220, maxTotal: 250, percentage: 88, grade: "A", rank: 3, isPassed: true,
    attendancePct: 88,
    subjectMarks: [
      { subject: "Mathematics", marks: 46, maxMarks: 50 },
      { subject: "Science", marks: 43, maxMarks: 50 },
      { subject: "English", marks: 45, maxMarks: 50 },
      { subject: "Social Studies", marks: 40, maxMarks: 50 },
      { subject: "Telugu", marks: 46, maxMarks: 50 },
    ],
  },
  {
    id: "R2", examName: "Quarterly Exam", type: "QUARTERLY", month: "October 2024",
    total: 682, maxTotal: 750, percentage: 91, grade: "A+", rank: 2, isPassed: true,
    attendancePct: 88,
    subjectMarks: [
      { subject: "Mathematics", marks: 135, maxMarks: 150 },
      { subject: "Science", marks: 140, maxMarks: 150 },
      { subject: "English", marks: 142, maxMarks: 150 },
      { subject: "Social Studies", marks: 130, maxMarks: 150 },
      { subject: "Telugu", marks: 135, maxMarks: 150 },
    ],
  },
  {
    id: "R3", examName: "Half-Yearly", type: "HALF_YEARLY", month: "November 2024",
    total: 840, maxTotal: 1000, percentage: 84, grade: "A", rank: 5, isPassed: true,
    attendancePct: 88,
    subjectMarks: [
      { subject: "Mathematics", marks: 170, maxMarks: 200 },
      { subject: "Science", marks: 175, maxMarks: 200 },
      { subject: "English", marks: 168, maxMarks: 200 },
      { subject: "Social Studies", marks: 162, maxMarks: 200 },
      { subject: "Telugu", marks: 165, maxMarks: 200 },
    ],
  },
];

const gradeColors = { "A+": "text-emerald-600 dark:text-emerald-400", "A": "text-blue-600 dark:text-blue-400", "B+": "text-indigo-600 dark:text-indigo-400", "B": "text-purple-600 dark:text-purple-400", "C": "text-amber-600 dark:text-amber-400", "F": "text-red-600 dark:text-red-400" };

export default function StudentResultsPage() {
  const [selectedResult, setSelectedResult] = useState(null);
  const [showRC, setShowRC] = useState(false);

  const bestRank = Math.min(...RESULTS.map((r) => r.rank));
  const avgPct = Math.round(RESULTS.reduce((s, r) => s + r.percentage, 0) / RESULTS.length);

  return (
    <>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/student" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Results</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Academic Year 2024-2025</p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Best Rank", value: `#${bestRank}`, color: "text-amber-600 dark:text-amber-400", icon: Trophy },
            { label: "Average %", value: `${avgPct}%`, color: "text-blue-600 dark:text-blue-400", icon: BarChart3 },
            { label: "Exams Taken", value: RESULTS.length, color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
          ].map((s) => (
            <div key={s.label} className="text-center p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Results Cards */}
        <div className="space-y-4">
          {RESULTS.map((result) => (
            <div key={result.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{result.examName}</h3>
                  <p className="text-[12px] text-slate-400">{result.month}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.total}/{result.maxTotal}</p>
                    <p className={`text-sm font-bold ${gradeColors[result.grade]}`}>{result.percentage}% • {result.grade}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">#{result.rank}</p>
                    <p className="text-[10px] text-slate-400">Rank</p>
                  </div>
                  <button onClick={() => { setSelectedResult(result); setShowRC(true); }} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors" title="View Report Card">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {["Subject", "Marks", "Max", "%", "Grade"].map((h) => <th key={h} className="px-4 py-2.5 text-left text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {result.subjectMarks.map((sm, i) => {
                      const pct = Math.round((sm.marks / sm.maxMarks) * 100);
                      const g = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B+" : pct >= 60 ? "B" : pct >= 50 ? "C" : "F";
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300">{sm.subject}</td>
                          <td className="px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white">{sm.marks}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-500 dark:text-slate-400">{sm.maxMarks}</td>
                          <td className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">{pct}%</td>
                          <td className="px-4 py-2.5"><span className={`text-sm font-bold ${gradeColors[g]}`}>{g}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRC && selectedResult && (
        <ReportCard
          student={{ ...selectedResult, name: "Aarav Sharma", admissionNo: "ADM/2024/0001" }}
          examName={selectedResult.examName}
          academicYear="2024-2025"
          school={{ name: "Sri Vidya High School", address: "Rajyampet, AP", phone: "9876543210" }}
          onClose={() => setShowRC(false)}
        />
      )}
    </>
  );
}