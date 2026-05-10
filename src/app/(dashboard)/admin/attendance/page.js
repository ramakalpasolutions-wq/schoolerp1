// src/app/(dashboard)/admin/attendance/page.js

"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CheckSquare,
  Users,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Search,
  X,
  BookOpen,
  AlertCircle,
  Info,
  User,
  BarChart3,
} from "lucide-react";

// ── Generate students ────────────────────────────────────────────
const generateClassStudents = (classNo, section) => {
  const names = [
    "Aarav Sharma", "Priya Reddy", "Karthik Kumar", "Sneha Patel",
    "Ravi Nair", "Ananya Singh", "Vikram Rao", "Divya Menon",
    "Suresh Babu", "Kavya Krishnan", "Arjun Gupta", "Meera Iyer",
    "Rohan Das", "Sonia Thomas", "Akash Joshi", "Pooja Verma",
    "Nikhil Choudhary", "Simran Kaur", "Rahul Mishra", "Deepika Pillai",
    "Varun Agarwal", "Nisha Saxena", "Aditya Bose", "Rani Chakraborty",
    "Shreyas Patil", "Tanvi Kulkarni", "Manish Dubey", "Preeti Tiwari",
    "Gaurav Yadav", "Anjali Pandey",
  ];
  return names.slice(0, 30).map((name, i) => ({
    id: `STU${classNo}${section}${String(i + 1).padStart(3, "0")}`,
    rollNo: i + 1,
    name,
    admissionNo: `ADM/2024/${String(i + 1).padStart(4, "0")}`,
    parentPhone: `98765${String(43210 + i).slice(-5)}`,
    photo: null,
    status: "PRESENT",
  }));
};

const CLASSES = ["6", "7", "8", "9", "10"];
const SECTIONS = ["A", "B", "C"];

// ── PAL Toggle ───────────────────────────────────────────────────
function PALToggle({ value, onChange }) {
  const options = [
    { key: "PRESENT", label: "P", fullLabel: "Present", activeClass: "bg-emerald-500 text-white shadow-md shadow-emerald-500/30" },
    { key: "ABSENT", label: "A", fullLabel: "Absent", activeClass: "bg-red-500 text-white shadow-md shadow-red-500/30" },
    { key: "LATE", label: "L", fullLabel: "Late", activeClass: "bg-amber-500 text-white shadow-md shadow-amber-500/30" },
    { key: "HALFDAY", label: "HD", fullLabel: "Half Day", activeClass: "bg-blue-500 text-white shadow-md shadow-blue-500/30" },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          title={opt.fullLabel}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
            value === opt.key
              ? opt.activeClass
              : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Submit Success Modal ─────────────────────────────────────────
function SuccessModal({ stats, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Attendance Submitted! ✅
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">
          Attendance has been saved successfully for all students.
        </p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Present", value: stats.present, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            { label: "Absent", value: stats.absent, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
            { label: "Late", value: stats.late, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          ].map((s) => (
            <div key={s.label} className={`py-3 rounded-xl ${s.bg}`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-center p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-5">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
            SMS sent to {stats.absent + stats.late} parents
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
export default function StudentAttendancePage() {
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [search, setSearch] = useState("");

  // ── Load Students ────────────────────────────────────────────
  async function handleLoadStudents() {
    setLoading(true);
    setLoaded(false);
    setSubmitted(false);
    await new Promise((r) => setTimeout(r, 800));
    const list = generateClassStudents(selectedClass, selectedSection);
    setStudents(list);
    setLoaded(true);
    setLoading(false);
  }

  // ── Change status ────────────────────────────────────────────
  function updateStatus(id, status) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  // ── Bulk ─────────────────────────────────────────────────────
  function markAll(status) {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  }

  // ── Submit ───────────────────────────────────────────────────
  async function handleSubmit() {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
    setShowSuccess(true);
  }

  // ── Stats ────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const present = students.filter((s) => s.status === "PRESENT").length;
    const absent = students.filter((s) => s.status === "ABSENT").length;
    const late = students.filter((s) => s.status === "LATE").length;
    const halfday = students.filter((s) => s.status === "HALFDAY").length;
    return {
      present,
      absent,
      late,
      halfday,
      total: students.length,
      pct: students.length > 0 ? Math.round((present / students.length) * 100) : 0,
    };
  }, [students]);

  // ── Filtered students ────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Student Attendance
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">{today}</p>
            </div>
          </div>
        </div>

        {/* ── Selector Panel ─────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Select Class & Date
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Class */}
            <div className="relative flex-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Class</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => { setSelectedClass(e.target.value); setLoaded(false); }}
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all"
                >
                  {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Section */}
            <div className="relative flex-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Section</label>
              <div className="relative">
                <select
                  value={selectedSection}
                  onChange={(e) => { setSelectedSection(e.target.value); setLoaded(false); }}
                  className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all"
                >
                  {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Date */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setLoaded(false); }}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all"
              />
            </div>

            {/* Load button */}
            <div className="flex-shrink-0 flex items-end">
              <button
                onClick={handleLoadStudents}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</>
                ) : (
                  <><Users className="w-4 h-4" /> Load Students</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Attendance Stats + Bulk Actions (when loaded) ─── */}
        {loaded && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Present", value: stats.present, pct: stats.pct, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
                { label: "Absent", value: stats.absent, pct: Math.round((stats.absent / stats.total) * 100), color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-200 dark:border-red-500/20" },
                { label: "Late", value: stats.late, pct: Math.round((stats.late / stats.total) * 100), color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
                { label: "Total", value: stats.total, pct: 100, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20" },
              ].map((stat) => (
                <div key={stat.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${stat.bg} ${stat.border}`}>
                  <div>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className={`text-sm font-bold ${stat.color}`}>{stat.pct}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bulk actions + search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Bulk */}
              <div className="flex gap-2">
                <button
                  onClick={() => markAll("PRESENT")}
                  disabled={submitted}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckSquare className="w-4 h-4" />
                  All Present
                </button>
                <button
                  onClick={() => markAll("ABSENT")}
                  disabled={submitted}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <X className="w-4 h-4" />
                  All Absent
                </button>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-bold">P</span> = Present &nbsp;•&nbsp;
                <span className="font-bold">A</span> = Absent &nbsp;•&nbsp;
                <span className="font-bold">L</span> = Late &nbsp;•&nbsp;
                <span className="font-bold">HD</span> = Half Day &nbsp;•&nbsp;
                SMS will be sent automatically to parents of Absent/Late students
              </p>
            </div>

            {/* Students list */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <div className="col-span-1 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</div>
                <div className="col-span-5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</div>
                <div className="col-span-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Adm. No.</div>
                <div className="col-span-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendance</div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((student, index) => {
                  const statusColors = {
                    PRESENT: "bg-emerald-50 dark:bg-emerald-500/5",
                    ABSENT: "bg-red-50 dark:bg-red-500/5",
                    LATE: "bg-amber-50 dark:bg-amber-500/5",
                    HALFDAY: "bg-blue-50 dark:bg-blue-500/5",
                  };
                  return (
                    <div
                      key={student.id}
                      className={`flex flex-col sm:grid sm:grid-cols-12 sm:gap-4 items-start sm:items-center px-4 py-3.5 transition-colors ${
                        submitted ? "opacity-75" : ""
                      } ${statusColors[student.status] || ""}`}
                    >
                      {/* Roll */}
                      <div className="hidden sm:block col-span-1">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          {student.rollNo}
                        </span>
                      </div>

                      {/* Name + mobile roll */}
                      <div className="col-span-5 flex items-center gap-3 mb-2 sm:mb-0 w-full sm:w-auto">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-[11px] font-bold">
                            {student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-[11px] text-slate-400">
                            <span className="sm:hidden">Roll #{student.rollNo} • </span>
                            {student.parentPhone}
                          </p>
                        </div>
                      </div>

                      {/* Admission no */}
                      <div className="col-span-3 hidden sm:block">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {student.admissionNo}
                        </span>
                      </div>

                      {/* PAL toggle */}
                      <div className="col-span-3">
                        <PALToggle
                          value={student.status}
                          onChange={(status) => updateStatus(student.id, status)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            {!submitted && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Ready to submit attendance?
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Class {selectedClass}-{selectedSection} • {new Date(selectedDate).toLocaleDateString("en-IN")} •{" "}
                    SMS will be sent to {stats.absent + stats.late} parents
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || students.length === 0}
                  className="flex items-center gap-2.5 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving & Sending SMS...
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-4 h-4" />
                      Submit Attendance
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Already submitted notice */}
            {submitted && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 animate-in slide-in-from-bottom-2 duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                    Attendance submitted successfully!
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                    SMS sent to {stats.absent + stats.late} parents of absent/late students
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Empty state ─────────────────────────────────────── */}
        {!loaded && !loading && (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <Users className="w-14 h-14 mb-4 opacity-30" />
            <p className="text-base font-semibold text-slate-500 dark:text-slate-400">
              Select class and load students
            </p>
            <p className="text-sm mt-1">
              Choose class, section, and date above then click &quot;Load Students&quot;
            </p>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          stats={stats}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}