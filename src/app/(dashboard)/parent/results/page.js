// src/app/(dashboard)/parent/results/page.js

"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, FileText } from "lucide-react";
import { useState } from "react";
// import ReportCard from "../../../../components/exams/ReportCard";
import ReportCard from "@/components/exams/ReportCard";


const RESULTS = [
  { id: "R1", examName: "Unit Test 1", month: "August 2024", total: 220, maxTotal: 250, percentage: 88, grade: "A", rank: 3, isPassed: true, attendancePct: 88,
    subjectMarks: [
      { subject: "Mathematics", marks: 46, maxMarks: 50 },
      { subject: "Science", marks: 43, maxMarks: 50 },
      { subject: "English", marks: 45, maxMarks: 50 },
      { subject: "Social Studies", marks: 40, maxMarks: 50 },
      { subject: "Telugu", marks: 46, maxMarks: 50 },
    ],
  },
  { id: "R2", examName: "Half-Yearly", month: "November 2024", total: 840, maxTotal: 1000, percentage: 84, grade: "A", rank: 5, isPassed: true, attendancePct: 88,
    subjectMarks: [
      { subject: "Mathematics", marks: 170, maxMarks: 200 },
      { subject: "Science", marks: 175, maxMarks: 200 },
      { subject: "English", marks: 168, maxMarks: 200 },
      { subject: "Social Studies", marks: 162, maxMarks: 200 },
      { subject: "Telugu", marks: 165, maxMarks: 200 },
    ],
  },
];

const gradeColors = { "A+": "text-emerald-600 dark:text-emerald-400", "A": "text-blue-600 dark:text-blue-400", "B+": "text-indigo-600 dark:text-indigo-400", "B": "text-purple-600 dark:text-purple-400", "F": "text-red-600 dark:text-red-400" };

export default function ParentResultsPage() {
  const [showRC, setShowRC] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  return (
    <>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Link href="/parent" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Arjun&apos;s Results</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Academic Year 2024-2025</p>
          </div>
        </div>

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
                    <p className="text-base font-bold text-slate-900 dark:text-white">{result.total}/{result.maxTotal}</p>
                    <p className={`text-sm font-bold ${gradeColors[result.grade]}`}>{result.percentage}% • {result.grade}</p>
                  </div>
                  <div className="text-center px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">#{result.rank}</p>
                    <p className="text-[10px] text-slate-400">Rank</p>
                  </div>
                  <button onClick={() => { setSelectedResult(result); setShowRC(true); }} className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="px-5 py-3">
                <div className="flex flex-wrap gap-2">
                  {result.subjectMarks.map((sm, i) => {
                    const pct = Math.round((sm.marks / sm.maxMarks) * 100);
                    return (
                      <div key={i} className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 min-w-[80px]">
                        <p className="text-[10px] text-slate-400 truncate max-w-[70px]">{sm.subject.split(" ")[0]}</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{sm.marks}</p>
                        <p className={`text-[10px] font-semibold ${pct >= 80 ? "text-emerald-500" : pct >= 60 ? "text-blue-500" : "text-red-500"}`}>{pct}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRC && selectedResult && (
        <ReportCard
          student={{ ...selectedResult, name: "Arjun Reddy", admissionNo: "ADM/2024/0042" }}
          examName={selectedResult.examName}
          academicYear="2024-2025"
          school={{ name: "Sri Vidya High School", address: "Rajyampet, AP", phone: "9876543210" }}
          onClose={() => setShowRC(false)}
        />
      )}
    </>
  );
}