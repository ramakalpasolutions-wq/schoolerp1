// src/app/(dashboard)/admin/promotions/[classId]/page.js

"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  ChevronDown,
  Search,
  Users,
  Filter,
  Check,
  ArrowRight,
  PartyPopper,
  Download,
  Eye,
  GraduationCap,
  BookOpen,
  UserCheck,
  UserX,
  Info,
} from "lucide-react";

// ── Mock student data for a class ───────────────────────────────
const generateClassStudents = (classId) => {
  const baseClass = classId.includes("9") ? "9" : classId.includes("8") ? "8" : "5";
  const baseSection = classId.includes("b") ? "B" : "A";

  const names = [
    "Aarav Sharma", "Priya Reddy", "Karthik Kumar", "Sneha Patel", "Ravi Nair",
    "Ananya Singh", "Vikram Rao", "Divya Menon", "Suresh Babu", "Kavya Krishnan",
    "Arjun Gupta", "Meera Iyer", "Rohan Das", "Sonia Thomas", "Akash Joshi",
    "Pooja Verma", "Nikhil Choudhary", "Simran Kaur", "Rahul Mishra", "Deepika Pillai",
    "Varun Agarwal", "Nisha Saxena", "Aditya Bose", "Rani Chakraborty", "Shreyas Patil",
    "Tanvi Kulkarni", "Manish Dubey", "Preeti Tiwari", "Gaurav Yadav", "Anjali Pandey",
    "Lokesh Goud", "Padmavathi R", "Srikanth Babu", "Bhavana Reddy", "Naresh Kumar",
    "Swapna Devi", "Ramakrishna P", "Chandana S", "Venkatesh N", "Sarada Devi",
    "Kiran Babu", "Lavanya S",
  ];

  return names.map((name, i) => ({
    id: `STU_${classId}_${String(i + 1).padStart(3, "0")}`,
    rollNo: i + 1,
    name,
    admissionNo: `ADM/2024/${String(i + 1).padStart(4, "0")}`,
    currentClass: baseClass,
    currentSection: baseSection,
    photo: null,
    attendancePct: Math.floor(70 + Math.random() * 30),
    lastExamMarks: Math.floor(40 + Math.random() * 60),
    decision: "PROMOTE",
    toClass: String(parseInt(baseClass) + 1),
    toSection: baseSection,
    holdReason: "",
    notes: "",
    isPassed: Math.random() > 0.07,
  }));
};

const SECTIONS = ["A", "B", "C", "D"];
const HOLD_REASONS = ["Failed Exam", "Low Attendance", "Medical Leave", "Fees Pending", "Disciplinary Issue", "Other"];
const CLASS_MAP = {
  "cls_5a": { name: "5", section: "A", nextClass: "6", label: "Class 5-A" },
  "cls_5b": { name: "5", section: "B", nextClass: "6", label: "Class 5-B" },
  "cls_8a": { name: "8", section: "A", nextClass: "9", label: "Class 8-A" },
  "cls_9a": { name: "9", section: "A", nextClass: "10", label: "Class 9-A" },
};

// ── Confirm Modal ─────────────────────────────────────────────────
function ConfirmModal({ promoteCount, holdCount, fromClass, toClass, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-7 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
          Confirm Promotion
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          Are you sure you want to promote students from{" "}
          <span className="font-bold text-slate-900 dark:text-white">Class {fromClass}</span> to{" "}
          <span className="font-bold text-slate-900 dark:text-white">Class {toClass}</span>?
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Promoting to Class {toClass}
              </span>
            </div>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {promoteCount}
            </span>
          </div>

          {holdCount > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <div className="flex items-center gap-2.5">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-semibold text-red-700 dark:text-red-300">
                  Held back in Class {fromClass}
                </span>
              </div>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">{holdCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-6">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
            This will permanently update student records. This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
          >
            Yes, Promote
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Progress Screen ───────────────────────────────────────────────
function ProgressScreen({ students, current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  const recentStudents = students.slice(Math.max(0, current - 3), current);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-lg text-center">
        {/* Animated icon */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-700" />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-600 animate-spin"
            style={{ animationDuration: "1.5s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Promoting Students...
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {current} of {total} students processed
        </p>

        {/* Progress bar */}
        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 mx-auto max-w-sm">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-8">{pct}%</p>

        {/* Recent students */}
        <div className="space-y-2 max-w-sm mx-auto">
          {recentStudents.map((student, i) => (
            <div key={student.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-1 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {student.name}
              </span>
              <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex-shrink-0">
                Promoted ✓
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Success Screen ────────────────────────────────────────────────
function SuccessScreen({ promoteCount, holdCount, fromClass, toClass, onViewClass }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-lg text-center animate-in zoom-in-95 duration-500">
        {/* Celebration icon */}
        <div className="relative mx-auto w-28 h-28 mb-8">
          <div className="absolute inset-0 rounded-full bg-emerald-100 dark:bg-emerald-500/10 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl">🎉</div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Promotion Complete!
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg">
          Class {fromClass} promotion has been processed successfully.
        </p>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Promoted</span>
            </div>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">{promoteCount}</p>
            <p className="text-xs text-slate-400 mt-1">→ Class {toClass}</p>
          </div>

          {holdCount > 0 && (
            <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-sm font-bold text-red-700 dark:text-red-300">Held Back</span>
              </div>
              <p className="text-4xl font-bold text-red-600 dark:text-red-400">{holdCount}</p>
              <p className="text-xs text-slate-400 mt-1">→ Class {fromClass} (repeated)</p>
            </div>
          )}
        </div>

        {/* Academic year note */}
        <div className="flex items-center gap-4 justify-center mb-8 text-sm">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">2024-2025</span>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <span className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10 font-semibold text-blue-700 dark:text-blue-300">2025-2026</span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download className="w-4 h-4" /> Download Report
          </button>
          <Link
            href="/admin/promotions"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
          >
            <Eye className="w-4 h-4" /> View All Classes
          </Link>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function ClassPromotionPage() {
  const params = useParams();
  const router = useRouter();
  const classId = params.classId;

  const classInfo = CLASS_MAP[classId] || { name: "5", section: "A", nextClass: "6", label: "Class 5-A" };

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterHeld, setFilterHeld] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phase, setPhase] = useState("editing"); // editing | progress | success
  const [progressCurrent, setProgressCurrent] = useState(0);
  const [targetSection, setTargetSection] = useState("A");

  useEffect(() => {
    const t = setTimeout(() => {
      const data = generateClassStudents(classId);
      // Auto-mark failed students as HOLD
      const withDecisions = data.map((s) => ({
        ...s,
        decision: !s.isPassed ? "HOLD" : "PROMOTE",
        holdReason: !s.isPassed ? "Failed Exam" : "",
      }));
      setStudents(withDecisions);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [classId]);

  // ── Filtered ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...students];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((s) => s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q));
    }
    if (filterHeld) data = data.filter((s) => s.decision === "HOLD");
    return data;
  }, [students, search, filterHeld]);

  // ── Stats ─────────────────────────────────────────────────────
  const promoteCount = students.filter((s) => s.decision === "PROMOTE").length;
  const holdCount = students.filter((s) => s.decision === "HOLD").length;

  // ── Update single student ─────────────────────────────────────
  function updateStudent(id, field, value) {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function toggleDecision(id) {
    setStudents((prev) => prev.map((s) => {
      if (s.id !== id) return s;
      const newDecision = s.decision === "PROMOTE" ? "HOLD" : "PROMOTE";
      return { ...s, decision: newDecision, holdReason: newDecision === "PROMOTE" ? "" : s.holdReason };
    }));
  }

  // ── Bulk actions ──────────────────────────────────────────────
  function markAll(decision) {
    setStudents((prev) => prev.map((s) => ({
      ...s,
      decision,
      holdReason: decision === "PROMOTE" ? "" : s.holdReason || "Failed Exam",
    })));
  }

  // ── Confirm & Process ─────────────────────────────────────────
  async function handleConfirmPromotion() {
    setShowConfirm(false);
    setPhase("progress");
    setProgressCurrent(0);

    const toPromote = students.filter((s) => s.decision === "PROMOTE");
    for (let i = 0; i < toPromote.length; i++) {
      await new Promise((r) => setTimeout(r, 80));
      setProgressCurrent(i + 1);
    }

    await new Promise((r) => setTimeout(r, 500));
    setPhase("success");
  }

  if (phase === "progress") {
    return (
      <ProgressScreen
        students={students.filter((s) => s.decision === "PROMOTE")}
        current={progressCurrent}
        total={promoteCount}
      />
    );
  }

  if (phase === "success") {
    return (
      <SuccessScreen
        promoteCount={promoteCount}
        holdCount={holdCount}
        fromClass={`${classInfo.name}-${classInfo.section}`}
        toClass={`${classInfo.nextClass}-${targetSection}`}
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/promotions"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Promote Class {classInfo.name}-{classInfo.section}
              </h1>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                Class {classInfo.nextClass}-{targetSection}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Academic Year 2024-2025 → 2025-2026 • {students.length} students
            </p>
          </div>
        </div>

        {/* Settings Row */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Promote To Class</label>
            <div className="flex items-center gap-2">
              <div className="px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm">
                Class {classInfo.nextClass}
              </div>
              <X className="w-4 h-4 text-slate-400" />
              <div className="relative">
                <select
                  value={targetSection}
                  onChange={(e) => setTargetSection(e.target.value)}
                  className="pl-3.5 pr-8 py-2.5 rounded-xl border-2 border-blue-300 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold text-sm outline-none appearance-none focus:border-blue-500 transition-all"
                >
                  {SECTIONS.map((s) => <option key={s} value={s}>Section {s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Section Mapping</label>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                {classInfo.section}
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold">
                {targetSection}
              </span>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <UserCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{promoteCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">To Promote</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <UserX className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{holdCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">To Hold</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Users className="w-8 h-8 text-slate-500 flex-shrink-0" />
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{students.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Students</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => markAll("PROMOTE")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
            >
              <UserCheck className="w-4 h-4" /> Mark All Promote
            </button>
            <button
              onClick={() => markAll("HOLD")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <UserX className="w-4 h-4" /> Mark All Hold
            </button>
            <button
              onClick={() => setFilterHeld(!filterHeld)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                filterHeld
                  ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              {filterHeld ? "Show All" : `Show Held (${holdCount})`}
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">#</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attend.</th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Last Exam</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Promote To</th>
                  <th className="px-4 py-3.5 text-center text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Decision</th>
                  <th className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hold Reason / Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  filtered.map((student) => {
                    const isPromote = student.decision === "PROMOTE";
                    return (
                      <tr
                        key={student.id}
                        className={`transition-colors ${
                          isPromote
                            ? "bg-emerald-50/40 dark:bg-emerald-500/5 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                            : "bg-red-50/40 dark:bg-red-500/5 hover:bg-red-50 dark:hover:bg-red-500/10"
                        }`}
                      >
                        {/* Roll */}
                        <td className="px-4 py-3.5">
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            {student.rollNo}
                          </span>
                        </td>

                        {/* Student */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                              isPromote
                                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                                : "bg-gradient-to-br from-red-500 to-rose-600"
                            }`}>
                              <span className="text-white text-[11px] font-bold">
                                {student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-[13px] font-semibold text-slate-900 dark:text-white whitespace-nowrap">{student.name}</p>
                              <p className="text-[11px] text-slate-400">{student.admissionNo}</p>
                            </div>
                          </div>
                        </td>

                        {/* Attendance */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-sm font-bold ${
                            student.attendancePct >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                          }`}>
                            {student.attendancePct}%
                          </span>
                        </td>

                        {/* Last Exam */}
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-sm font-bold ${
                            student.lastExamMarks >= 35 ? "text-slate-900 dark:text-white" : "text-red-600 dark:text-red-400"
                          }`}>
                            {student.lastExamMarks}/100
                          </span>
                        </td>

                        {/* Promote To */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg whitespace-nowrap">
                              Class {student.toClass}
                            </span>
                            <div className="relative">
                              <select
                                value={student.toSection}
                                onChange={(e) => updateStudent(student.id, "toSection", e.target.value)}
                                disabled={!isPromote}
                                className="pl-2.5 pr-6 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold outline-none appearance-none disabled:opacity-40"
                              >
                                {SECTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        </td>

                        {/* Decision Toggle */}
                        <td className="px-4 py-3.5 text-center">
                          <button
                            onClick={() => toggleDecision(student.id)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 mx-auto ${
                              isPromote
                                ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/30 border-2 border-emerald-200 dark:border-emerald-500/30"
                                : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 border-2 border-red-200 dark:border-red-500/30"
                            }`}
                          >
                            {isPromote ? (
                              <><CheckCircle2 className="w-3.5 h-3.5" /> PROMOTE</>
                            ) : (
                              <><XCircle className="w-3.5 h-3.5" /> HOLD</>
                            )}
                          </button>
                        </td>

                        {/* Reason / Notes */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            {!isPromote && (
                              <div className="relative">
                                <select
                                  value={student.holdReason}
                                  onChange={(e) => updateStudent(student.id, "holdReason", e.target.value)}
                                  className="pl-2.5 pr-6 py-1.5 rounded-lg border-2 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold outline-none appearance-none focus:border-red-400"
                                >
                                  <option value="">Select reason</option>
                                  {HOLD_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-red-400 pointer-events-none" />
                              </div>
                            )}
                            <input
                              type="text"
                              value={student.notes}
                              onChange={(e) => updateStudent(student.id, "notes", e.target.value)}
                              placeholder="Notes..."
                              className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs outline-none focus:border-blue-500 transition-all placeholder-slate-300"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center py-12 text-slate-400">
                <Users className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-semibold">No students found</p>
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {(loading ? Array.from({ length: 5 }) : filtered).map((student, i) => {
              if (loading) {
                return (
                  <div key={i} className="p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1 space-y-2">
                        <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                      </div>
                    </div>
                  </div>
                );
              }

              const isPromote = student.decision === "PROMOTE";
              return (
                <div key={student.id} className={`p-4 ${isPromote ? "bg-emerald-50/40 dark:bg-emerald-500/5" : "bg-red-50/40 dark:bg-red-500/5"}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isPromote ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}>
                        <span className="text-white text-xs font-bold">{student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{student.name}</p>
                        <p className="text-[11px] text-slate-400">Roll #{student.rollNo} • {student.attendancePct}% attend.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDecision(student.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold border-2 transition-all ${
                        isPromote
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                          : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
                      }`}
                    >
                      {isPromote ? <><CheckCircle2 className="w-3.5 h-3.5" /> PROMOTE</> : <><XCircle className="w-3.5 h-3.5" /> HOLD</>}
                    </button>
                  </div>
                  {!isPromote && (
                    <div className="relative mt-2">
                      <select
                        value={student.holdReason}
                        onChange={(e) => updateStudent(student.id, "holdReason", e.target.value)}
                        className="w-full pl-3 pr-7 py-2 rounded-xl border-2 border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs font-semibold outline-none appearance-none"
                      >
                        <option value="">Select hold reason</option>
                        {HOLD_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400 pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-4 z-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-200 dark:border-blue-500/30 shadow-xl shadow-blue-500/10 backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{promoteCount}</p>
                <p className="text-xs text-slate-400 font-medium">To Promote</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{holdCount}</p>
                <p className="text-xs text-slate-400 font-medium">To Hold</p>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <ArrowRight className="w-4 h-4 text-blue-500" />
                Class {classInfo.nextClass}-{targetSection}
              </div>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              disabled={promoteCount === 0}
              className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 whitespace-nowrap"
            >
              <TrendingUp className="w-5 h-5" />
              Confirm Promotion
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <ConfirmModal
          promoteCount={promoteCount}
          holdCount={holdCount}
          fromClass={`${classInfo.name}-${classInfo.section}`}
          toClass={`${classInfo.nextClass}-${targetSection}`}
          onConfirm={handleConfirmPromotion}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}