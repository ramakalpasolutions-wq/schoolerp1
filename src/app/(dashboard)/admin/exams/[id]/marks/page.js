// src/app/(dashboard)/admin/exams/[id]/marks/page.js

"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, CheckCircle2, ChevronDown,
  Users, BookOpen, AlertCircle, Star, Award, RotateCcw,
} from "lucide-react";

const CLASSES = ["9-A", "9-B", "10-A", "10-B", "8-A"];
const SUBJECTS = ["Mathematics", "Science", "English", "Social Studies", "Telugu", "Hindi"];

const generateStudents = () => {
  const names = [
    "Aarav Sharma", "Priya Reddy", "Karthik Kumar", "Sneha Patel", "Ravi Nair",
    "Ananya Singh", "Vikram Rao", "Divya Menon", "Suresh Babu", "Kavya Krishnan",
    "Arjun Gupta", "Meera Iyer", "Rohan Das", "Sonia Thomas", "Akash Joshi",
    "Pooja Verma", "Nikhil C", "Simran Kaur", "Rahul Mishra", "Deepika P",
    "Varun Agarwal", "Nisha Saxena", "Aditya Bose", "Rani C", "Shreyas Patil",
  ];
  return names.map((name, i) => ({
    id: `STU${String(i + 1).padStart(3, "0")}`,
    rollNo: i + 1,
    name,
    admissionNo: `ADM/2024/${String(i + 1).padStart(4, "0")}`,
    marks: 0,
    saved: false,
  }));
};

function getGrade(marks, maxMarks) {
  const pct = maxMarks > 0 ? (marks / maxMarks) * 100 : 0;
  if (pct >= 90) return { grade: "A+", color: "text-emerald-600 dark:text-emerald-400 font-bold" };
  if (pct >= 80) return { grade: "A", color: "text-blue-600 dark:text-blue-400 font-bold" };
  if (pct >= 70) return { grade: "B+", color: "text-indigo-600 dark:text-indigo-400 font-bold" };
  if (pct >= 60) return { grade: "B", color: "text-purple-600 dark:text-purple-400 font-bold" };
  if (pct >= 50) return { grade: "C", color: "text-amber-600 dark:text-amber-400 font-bold" };
  if (pct >= 35) return { grade: "D", color: "text-orange-600 dark:text-orange-400 font-bold" };
  return { grade: "F", color: "text-red-600 dark:text-red-400 font-bold" };
}

export default function MarksEntryPage() {
  const params = useParams();
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [maxMarks, setMaxMarks] = useState(100);
  const [students, setStudents] = useState(generateStudents());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const stats = useMemo(() => {
    const entered = students.filter((s) => s.marks > 0);
    const passed = entered.filter((s) => (s.marks / maxMarks) * 100 >= 35);
    const avg = entered.length > 0 ? Math.round(entered.reduce((s, st) => s + st.marks, 0) / entered.length) : 0;
    const highest = Math.max(...students.map((s) => s.marks), 0);
    return { entered: entered.length, passed: passed.length, failed: entered.length - passed.length, avg, highest };
  }, [students, maxMarks]);

  function updateMarks(id, val) {
    const numVal = Math.min(Math.max(0, parseInt(val) || 0), maxMarks);
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, marks: numVal, saved: false } : s));
    setHasChanges(true);
    setSaved(false);
  }

  function resetAll() {
    setStudents((prev) => prev.map((s) => ({ ...s, marks: 0, saved: false })));
    setHasChanges(false);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setStudents((prev) => prev.map((s) => ({ ...s, saved: true })));
    setSaving(false);
    setSaved(true);
    setHasChanges(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Link href={`/admin/exams/${params.id}`} className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Enter Marks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Mid-Term Examination 2025</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Marks Saved</span>
          </div>
        )}
      </div>

      {/* Selectors */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Class */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Class</label>
            <div className="relative">
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all">
                {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Subject</label>
            <div className="relative">
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all">
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          {/* Max Marks */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Max Marks</label>
            <input
              type="number"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Math.max(1, parseInt(e.target.value) || 100))}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all font-bold"
              min="1" max="1000"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Entered", value: stats.entered, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Passed", value: stats.passed, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Failed", value: stats.failed, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
          { label: "Average", value: stats.avg, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
          { label: "Highest", value: stats.highest, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
        ].map((stat) => (
          <div key={stat.label} className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 ${stat.bg}`}>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-slate-400 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Marks Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {selectedClass} — {selectedSubject} ({students.length} students)
          </h3>
          <div className="flex gap-2">
            {hasChanges && (
              <button onClick={resetAll} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marks (/{maxMarks})</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">%</th>
                <th className="px-4 py-3 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                const pct = maxMarks > 0 ? Math.round((student.marks / maxMarks) * 100) : 0;
                const { grade, color } = getGrade(student.marks, maxMarks);
                const isPassed = pct >= 35;
                return (
                  <tr key={student.id} className={`transition-colors ${!isPassed && student.marks > 0 ? "bg-red-50/40 dark:bg-red-500/5" : student.marks > 0 && pct >= 90 ? "bg-amber-50/40 dark:bg-amber-500/5" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"}`}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{student.rollNo}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-bold">{student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.admissionNo}</p>
                        </div>
                        {pct >= 90 && student.marks > 0 && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={student.marks || ""}
                          onChange={(e) => updateMarks(student.id, e.target.value)}
                          min="0"
                          max={maxMarks}
                          placeholder="0"
                          className="w-20 px-3 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold text-center outline-none transition-all"
                        />
                        <span className="text-xs text-slate-400">/{maxMarks}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm font-bold ${isPassed ? "text-emerald-600 dark:text-emerald-400" : student.marks > 0 ? "text-red-600 dark:text-red-400" : "text-slate-300 dark:text-slate-700"}`}>
                        {student.marks > 0 ? `${pct}%` : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-sm ${student.marks > 0 ? color : "text-slate-300 dark:text-slate-700"}`}>
                        {student.marks > 0 ? grade : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs text-slate-400">
            Auto-grading: ≥90%→A+ | ≥80%→A | ≥70%→B+ | ≥60%→B | ≥50%→C | ≥35%→D | &lt;35%→F
          </p>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Marks</>}
          </button>
        </div>
      </div>
    </div>
  );
}