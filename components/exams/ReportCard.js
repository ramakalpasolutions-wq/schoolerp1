// components/exams/ReportCard.js
"use client";

import { useRef } from "react";
import {
  X,
  Printer,
  Download,
  Trophy,
  Star,
  CheckCircle2,
  XCircle,
  BookOpen,
  Award,
} from "lucide-react";

// ── Grade calculator ─────────────────────────────────────────────
function getGrade(marks, maxMarks) {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return { grade: "A+", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" };
  if (pct >= 80) return { grade: "A",  color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-500/10" };
  if (pct >= 70) return { grade: "B+", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" };
  if (pct >= 60) return { grade: "B",  color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" };
  if (pct >= 50) return { grade: "C",  color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-500/10" };
  if (pct >= 35) return { grade: "D",  color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/10" };
  return           { grade: "F",  color: "text-red-600 dark:text-red-400",     bg: "bg-red-50 dark:bg-red-500/10" };
}

function getOverallGrade(pct) {
  if (pct >= 90) return { grade: "A+", label: "Outstanding",  color: "text-emerald-600 dark:text-emerald-400" };
  if (pct >= 80) return { grade: "A",  label: "Excellent",    color: "text-blue-600 dark:text-blue-400" };
  if (pct >= 70) return { grade: "B+", label: "Very Good",    color: "text-indigo-600 dark:text-indigo-400" };
  if (pct >= 60) return { grade: "B",  label: "Good",         color: "text-purple-600 dark:text-purple-400" };
  if (pct >= 50) return { grade: "C",  label: "Average",      color: "text-amber-600 dark:text-amber-400" };
  if (pct >= 35) return { grade: "D",  label: "Below Average",color: "text-orange-600 dark:text-orange-400" };
  return           { grade: "F",  label: "Fail",          color: "text-red-600 dark:text-red-400" };
}

// ════════════════════════════════════════════════════════════════
export default function ReportCard({ result, student, onClose }) {
  const printRef = useRef(null);

  if (!result || !student) return null;

  const totalMarks    = result.subjects.reduce((s, sub) => s + sub.marks, 0);
  const totalMax      = result.subjects.reduce((s, sub) => s + sub.maxMarks, 0);
  const percentage    = Math.round((totalMarks / totalMax) * 100);
  const overall       = getOverallGrade(percentage);
  const passedCount   = result.subjects.filter((s) => s.marks >= s.maxMarks * 0.35).length;
  const failedCount   = result.subjects.length - passedCount;

  // ── Print handler ────────────────────────────────────────────
  function handlePrint() {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Report Card — ${student.name}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: Arial, sans-serif; padding: 32px; color: #1e293b; }
            .header { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 24px; }
            .school  { font-size: 24px; font-weight: 800; color: #1e40af; }
            .subtitle{ font-size: 13px; color: #64748b; margin-top: 4px; }
            .exam    { font-size: 16px; font-weight: 700; margin-top: 8px; color: #0f172a; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 24px; }
            .info-row  { display: flex; gap: 8px; font-size: 13px; }
            .info-label{ color: #64748b; min-width: 100px; }
            .info-value{ font-weight: 600; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #f1f5f9; padding: 10px 12px; text-align: left; font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #e2e8f0; }
            td { padding: 10px 12px; font-size: 13px; border: 1px solid #e2e8f0; }
            .pass { color: #059669; font-weight: 700; }
            .fail { color: #dc2626; font-weight: 700; }
            .total-row { background: #eff6ff; font-weight: 800; }
            .summary { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-top: 20px; }
            .summary-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center; }
            .summary-label{ font-size: 11px; color: #64748b; margin-bottom: 4px; }
            .summary-value{ font-size: 20px; font-weight: 800; color: #0f172a; }
            .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
            .grade-badge { display: inline-block; background: #dbeafe; color: #1d4ed8; font-weight: 800; padding: 2px 10px; border-radius: 6px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school">School ERP — Rajyampet</div>
            <div class="subtitle">Official Academic Report Card</div>
            <div class="exam">${result.examName} — ${result.academicYear ?? "2024-25"}</div>
          </div>

          <div class="info-grid">
            <div class="info-row"><span class="info-label">Student Name</span><span class="info-value">${student.name}</span></div>
            <div class="info-row"><span class="info-label">Admission No</span><span class="info-value">${student.admNo}</span></div>
            <div class="info-row"><span class="info-label">Class</span><span class="info-value">${student.class}</span></div>
            <div class="info-row"><span class="info-label">Roll No</span><span class="info-value">${student.rollNo ?? "—"}</span></div>
            <div class="info-row"><span class="info-label">Section</span><span class="info-value">${student.section ?? "—"}</span></div>
            <div class="info-row"><span class="info-label">Date Issued</span><span class="info-value">${new Date().toLocaleDateString("en-IN")}</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Max Marks</th>
                <th>Marks Obtained</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              ${result.subjects.map((sub, i) => {
                const g = getGrade(sub.marks, sub.maxMarks);
                const passed = sub.marks >= sub.maxMarks * 0.35;
                return `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${sub.subject}</td>
                    <td>${sub.maxMarks}</td>
                    <td>${sub.marks}</td>
                    <td><span class="grade-badge">${g.grade}</span></td>
                    <td class="${passed ? "pass" : "fail"}">${passed ? "✓ Pass" : "✗ Fail"}</td>
                  </tr>`;
              }).join("")}
              <tr class="total-row">
                <td colspan="2">Total / Overall</td>
                <td>${totalMax}</td>
                <td>${totalMarks}</td>
                <td><span class="grade-badge">${overall.grade}</span></td>
                <td class="${failedCount === 0 ? "pass" : "fail"}">${failedCount === 0 ? "✓ Pass" : "✗ Fail"}</td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-card">
              <div class="summary-label">Total Marks</div>
              <div class="summary-value">${totalMarks}/${totalMax}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Percentage</div>
              <div class="summary-value">${percentage}%</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Grade</div>
              <div class="summary-value">${overall.grade}</div>
            </div>
            <div class="summary-card">
              <div class="summary-label">Result</div>
              <div class="summary-value">${failedCount === 0 ? "PASS" : "FAIL"}</div>
            </div>
          </div>

          <div class="footer">
            This is a computer generated report card. Generated on ${new Date().toLocaleString("en-IN")}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return (
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Report Card
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {result.examName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div ref={printRef} className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Student Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            {[
              { label: "Student",      value: student.name },
              { label: "Admission No", value: student.admNo },
              { label: "Class",        value: student.class },
              { label: "Roll No",      value: student.rollNo  ?? "—" },
              { label: "Section",      value: student.section ?? "—" },
              { label: "Exam",         value: result.examName },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                  {item.label}
                </p>
                <p className="text-[13px] font-bold text-slate-900 dark:text-white mt-0.5">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Overall Result Banner */}
          <div className={`flex items-center justify-between p-4 rounded-xl border-2 ${
            failedCount === 0
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
              : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
          }`}>
            <div className="flex items-center gap-3">
              {failedCount === 0
                ? <Trophy className="w-8 h-8 text-emerald-500" />
                : <XCircle className="w-8 h-8 text-red-500" />}
              <div>
                <p className={`text-base font-bold ${failedCount === 0 ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>
                  {failedCount === 0 ? "🎉 Congratulations — PASS" : "❌ Result — FAIL"}
                </p>
                <p className={`text-xs mt-0.5 ${failedCount === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                  {overall.label} • {passedCount}/{result.subjects.length} subjects passed
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-black ${overall.color}`}>{overall.grade}</p>
              <p className="text-xs text-slate-400 mt-0.5">{percentage}%</p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total Marks",  value: `${totalMarks}/${totalMax}`, color: "text-blue-600 dark:text-blue-400" },
              { label: "Percentage",   value: `${percentage}%`,            color: overall.color },
              { label: "Subjects Pass",value: `${passedCount}`,            color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Subjects Fail",value: `${failedCount}`,            color: failedCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-400" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Subject-wise Marks Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Subject-wise Performance
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40">
                    {["Subject", "Max Marks", "Obtained", "Grade", "Pass/Fail"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.subjects.map((sub, i) => {
                    const g      = getGrade(sub.marks, sub.maxMarks);
                    const passed = sub.marks >= sub.maxMarks * 0.35;
                    const pct    = Math.round((sub.marks / sub.maxMarks) * 100);
                    return (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {sub.subject}
                          </p>
                          {/* Progress bar */}
                          <div className="mt-1 w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${pct >= 60 ? "bg-emerald-500" : pct >= 35 ? "bg-amber-500" : "bg-red-500"}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-semibold">
                          {sub.maxMarks}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">
                          {sub.marks}
                          <span className="text-xs text-slate-400 font-normal ml-1">({pct}%)</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-bold ${g.bg} ${g.color}`}>
                            {g.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {passed
                            ? <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Pass</span>
                            : <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400"><XCircle className="w-3.5 h-3.5" /> Fail</span>
                          }
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Total row */}
                <tfoot>
                  <tr className="bg-blue-50 dark:bg-blue-500/10 border-t-2 border-blue-200 dark:border-blue-500/30">
                    <td className="px-4 py-3 text-sm font-black text-slate-900 dark:text-white">Total</td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300">{totalMax}</td>
                    <td className="px-4 py-3 text-sm font-black text-blue-600 dark:text-blue-400">{totalMarks}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-black bg-blue-100 dark:bg-blue-500/20 ${overall.color}`}>
                        {overall.grade}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-black ${failedCount === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                        {failedCount === 0 ? "✓ PASS" : "✗ FAIL"}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Remarks */}
          {result.remarks && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
              <Star className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400">Teacher Remarks</p>
                <p className="text-sm text-amber-600 dark:text-amber-400/80 mt-0.5">{result.remarks}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Buttons ── */}
        <div className="flex gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}