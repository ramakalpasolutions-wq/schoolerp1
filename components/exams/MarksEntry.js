// components/exams/MarksEntry.js
"use client";

import { useState } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";

export default function MarksEntry({
  students  = [],
  subjects  = [],
  maxMarks  = 100,
  examName  = "Exam",
  onSubmit,
  loading   = false,
}) {
  // marks[studentId][subject] = value
  const [marks, setMarks] = useState(() => {
    const m = {};
    students.forEach((s) => {
      m[s.id] = {};
      subjects.forEach((sub) => { m[s.id][sub] = ""; });
    });
    return m;
  });

  const [errors, setErrors] = useState({});

  function setMark(studentId, subject, value) {
    const num = parseInt(value, 10);
    const key = `${studentId}-${subject}`;

    if (value !== "" && (isNaN(num) || num < 0 || num > maxMarks)) {
      setErrors((p) => ({ ...p, [key]: `0–${maxMarks}` }));
    } else {
      setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
    }

    setMarks((p) => ({
      ...p,
      [studentId]: { ...p[studentId], [subject]: value },
    }));
  }

  function handleSubmit() {
    // Validate all filled
    const newErrors = {};
    let valid = true;
    students.forEach((s) => {
      subjects.forEach((sub) => {
        const v = marks[s.id][sub];
        const key = `${s.id}-${sub}`;
        if (v === "") { newErrors[key] = "Required"; valid = false; }
      });
    });
    if (!valid) { setErrors(newErrors); return; }
    onSubmit?.(marks);
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">{examName} — Marks Entry</h3>
          <p className="text-xs text-slate-400 mt-0.5">Max marks per subject: {maxMarks}</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors shadow-lg shadow-blue-500/20"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> Save Marks</>
          }
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-800/60 z-10">
                  Student
                </th>
                {subjects.map((sub) => (
                  <th key={sub} className="px-3 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap min-w-[100px]">
                    {sub}<br/>
                    <span className="text-[10px] font-normal normal-case text-slate-400">/{maxMarks}</span>
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student) => {
                const total = subjects.reduce((sum, sub) => {
                  const v = parseInt(marks[student.id]?.[sub] || "0", 10);
                  return sum + (isNaN(v) ? 0 : v);
                }, 0);
                const maxTotal = subjects.length * maxMarks;
                const pct = Math.round((total / maxTotal) * 100);

                return (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Student name */}
                    <td className="px-4 py-3 sticky left-0 bg-white dark:bg-slate-900 z-10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[10px] font-bold">
                            {student.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-[11px] text-slate-400">{student.rollNo ? `Roll: ${student.rollNo}` : student.admNo || ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* Marks inputs */}
                    {subjects.map((sub) => {
                      const key = `${student.id}-${sub}`;
                      const hasError = !!errors[key];
                      return (
                        <td key={sub} className="px-3 py-3">
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              max={maxMarks}
                              value={marks[student.id]?.[sub] || ""}
                              onChange={(e) => setMark(student.id, sub, e.target.value)}
                              className={`w-20 px-3 py-2 rounded-xl border-2 text-sm font-semibold text-center outline-none transition-all
                                ${hasError
                                  ? "border-red-400 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-blue-500"
                                }`}
                              placeholder="—"
                            />
                            {hasError && (
                              <div className="absolute -top-1 -right-1">
                                <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Total */}
                    <td className="px-4 py-3">
                      <div>
                        <span className={`text-sm font-bold ${pct >= 60 ? "text-emerald-600 dark:text-emerald-400" : pct >= 35 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}>
                          {total}/{maxTotal}
                        </span>
                        <p className="text-[10px] text-slate-400">{pct}%</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}