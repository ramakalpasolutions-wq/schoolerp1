// src/app/(dashboard)/admin/promotions/page.js

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  Loader2,
  X,
  Info,
  BarChart3,
  BookOpen,
  Zap,
} from "lucide-react";

// ── Mock class data ──────────────────────────────────────────────
const CLASSES_DATA = [
  { id: "cls_1a", name: "1", section: "A", totalStudents: 38, promoted: 38, status: "COMPLETED" },
  { id: "cls_2a", name: "2", section: "A", totalStudents: 35, promoted: 35, status: "COMPLETED" },
  { id: "cls_2b", name: "2", section: "B", totalStudents: 33, promoted: 33, status: "COMPLETED" },
  { id: "cls_3a", name: "3", section: "A", totalStudents: 40, promoted: 40, status: "COMPLETED" },
  { id: "cls_4a", name: "4", section: "A", totalStudents: 36, promoted: 36, status: "COMPLETED" },
  { id: "cls_5a", name: "5", section: "A", totalStudents: 42, promoted: 0, status: "PENDING" },
  { id: "cls_5b", name: "5", section: "B", totalStudents: 39, promoted: 0, status: "PENDING" },
  { id: "cls_6a", name: "6", section: "A", totalStudents: 44, promoted: 44, status: "COMPLETED" },
  { id: "cls_7a", name: "7", section: "A", totalStudents: 41, promoted: 41, status: "COMPLETED" },
  { id: "cls_8a", name: "8", section: "A", totalStudents: 38, promoted: 0, status: "PENDING" },
  { id: "cls_9a", name: "9", section: "A", totalStudents: 45, promoted: 0, status: "PENDING" },
  { id: "cls_10a", name: "10", section: "A", totalStudents: 48, promoted: 48, status: "GRADUATED", graduated: true },
];

// ── Promote All Warning Modal ─────────────────────────────────────
function PromoteAllModal({ onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-7 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
          Promote All Pending Classes?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
          This will promote all students in 4 pending classes to the next class automatically.
          <span className="block mt-2 font-semibold text-amber-600 dark:text-amber-400">
            This action cannot be undone.
          </span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 transition-all active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Promoting...
              </span>
            ) : (
              "Yes, Promote All"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Class Card ────────────────────────────────────────────────────
function ClassCard({ cls }) {
  const isCompleted = cls.status === "COMPLETED";
  const isGraduated = cls.status === "GRADUATED";
  const isPending = cls.status === "PENDING";

  const nextClass = isGraduated ? null : parseInt(cls.name) + 1;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border-2 bg-white dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
      isCompleted ? "border-emerald-200 dark:border-emerald-500/30" :
      isGraduated ? "border-purple-200 dark:border-purple-500/30" :
      "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50"
    }`}>
      {/* Top accent */}
      <div className={`h-1.5 w-full ${
        isCompleted ? "bg-gradient-to-r from-emerald-400 to-teal-500" :
        isGraduated ? "bg-gradient-to-r from-purple-400 to-indigo-500" :
        "bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 group-hover:from-blue-400 group-hover:to-indigo-500"
      } transition-all duration-300`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Class {cls.name}-{cls.section}
            </h3>
            {!isGraduated && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                Class {nextClass}-{cls.section}
              </p>
            )}
          </div>

          {/* Status badge */}
          {isCompleted && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Completed
            </span>
          )}
          {isGraduated && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-[11px] font-bold">
              <GraduationCap className="w-3.5 h-3.5" /> Graduated
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
              <Clock className="w-3.5 h-3.5" /> Pending
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{cls.totalStudents}</p>
            <p className="text-[11px] text-slate-400 font-medium">Total</p>
          </div>
          <div className={`rounded-xl p-3 text-center ${
            isCompleted || isGraduated
              ? "bg-emerald-50 dark:bg-emerald-500/10"
              : "bg-slate-50 dark:bg-slate-800/60"
          }`}>
            <p className={`text-2xl font-bold ${
              isCompleted || isGraduated
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-slate-400 dark:text-slate-600"
            }`}>
              {cls.promoted}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              {isGraduated ? "Graduated" : "Promoted"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isCompleted || isGraduated ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            }`}
            style={{ width: `${(cls.promoted / cls.totalStudents) * 100}%` }}
          />
        </div>

        {/* Action Button */}
        {isPending ? (
          <Link
            href={`/admin/promotions/${cls.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
          >
            <TrendingUp className="w-4 h-4" /> Start Promotion
          </Link>
        ) : isGraduated ? (
          <div className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 font-semibold text-sm">
            <GraduationCap className="w-4 h-4" /> Final Year Completed
          </div>
        ) : (
          <Link
            href={`/admin/promotions/${cls.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> View Promotion
          </Link>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function PromotionsPage() {
  const [loading, setLoading] = useState(true);
  const [showPromoteAll, setShowPromoteAll] = useState(false);
  const [promotingAll, setPromotingAll] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const stats = {
    total: CLASSES_DATA.length,
    completed: CLASSES_DATA.filter((c) => c.status === "COMPLETED").length,
    graduated: CLASSES_DATA.filter((c) => c.status === "GRADUATED").length,
    pending: CLASSES_DATA.filter((c) => c.status === "PENDING").length,
  };

  const totalStudents = CLASSES_DATA.reduce((s, c) => s + c.totalStudents, 0);
  const totalPromoted = CLASSES_DATA.reduce((s, c) => s + c.promoted, 0);
  const overallPct = Math.round((totalPromoted / totalStudents) * 100);

  async function handlePromoteAll() {
    setPromotingAll(true);
    await new Promise((r) => setTimeout(r, 2500));
    setPromotingAll(false);
    setShowPromoteAll(false);
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              Student Promotion
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Year End</span>
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Promote students to the next academic year
            </p>
          </div>
          <button
            onClick={() => setShowPromoteAll(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4" />
            Promote All Pending
          </button>
        </div>

        {/* Info Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                Academic Year 2024-2025 is Ending
              </h2>
              <p className="text-blue-100 text-sm">
                Promote eligible students from Academic Year 2024-2025 to 2025-2026.
                Review each class and confirm promotions.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <p className="text-white font-bold text-base">2024-2025</p>
                <p className="text-blue-100 text-[11px]">Current Year</p>
              </div>
              <ArrowRight className="w-5 h-5 text-white/60 hidden sm:block" />
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <p className="text-white font-bold text-base">2025-2026</p>
                <p className="text-blue-100 text-[11px]">Next Year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Classes", value: stats.total, icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-200 dark:border-blue-500/20" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-200 dark:border-emerald-500/20" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-200 dark:border-amber-500/20" },
            { label: "Graduated", value: stats.graduated, icon: GraduationCap, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10", border: "border-purple-200 dark:border-purple-500/20" },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center gap-4 p-4 rounded-2xl border ${stat.bg} ${stat.border}`}>
              <div className="w-11 h-11 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Progress */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Overall Promotion Progress
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
                {totalPromoted.toLocaleString()} of {totalStudents.toLocaleString()} students promoted
              </p>
            </div>
            <span className={`text-2xl font-bold ${overallPct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {overallPct}%
            </span>
          </div>
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-1000"
              style={{ width: `${overallPct}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Promoted: <span className="font-bold text-slate-900 dark:text-white">{totalPromoted}</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Pending: <span className="font-bold text-slate-900 dark:text-white">{totalStudents - totalPromoted}</span></span>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-500" />
            Classes Overview
          </h3>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 animate-pulse">
                  <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                    <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-4" />
                  <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {CLASSES_DATA.map((cls) => (
                <ClassCard key={cls.id} cls={cls} />
              ))}
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Note:</span> Class 10-A students are marked as Graduated since 10th is the final year.
            Students with failed exams or medical holds can be manually marked as &quot;Hold&quot; during the promotion process.
          </div>
        </div>
      </div>

      {/* Modal */}
      {showPromoteAll && (
        <PromoteAllModal
          loading={promotingAll}
          onConfirm={handlePromoteAll}
          onCancel={() => setShowPromoteAll(false)}
        />
      )}
    </>
  );
}