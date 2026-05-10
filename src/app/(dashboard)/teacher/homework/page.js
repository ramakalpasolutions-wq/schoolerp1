// src/app/(dashboard)/teacher/homework/page.js

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Plus, BookOpenCheck, Calendar, CheckCircle2,
  Clock, XCircle, Users, Loader2, X, ChevronDown, AlertCircle,
} from "lucide-react";

const MY_HW = [
  { id: 1, title: "Quadratic Equations Exercise", class: "9-A", subject: "Mathematics", dueDate: "2025-03-22", createdAt: "2025-03-18", submissions: 38, total: 42, status: "ACTIVE" },
  { id: 2, title: "Calculus - Integration Problems", class: "10-A", subject: "Mathematics", dueDate: "2025-03-25", createdAt: "2025-03-17", submissions: 30, total: 45, status: "ACTIVE" },
  { id: 3, title: "Number Theory Worksheet", class: "9-B", subject: "Mathematics", dueDate: "2025-03-15", createdAt: "2025-03-10", submissions: 36, total: 38, status: "PAST" },
  { id: 4, title: "Trigonometry Practice Set", class: "10-B", subject: "Mathematics", dueDate: "2025-03-20", createdAt: "2025-03-14", submissions: 44, total: 44, status: "COMPLETED" },
];

function AddHWModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", classId: "", dueDate: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.classId || !form.dueDate) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    onAdd({ ...form, id: Date.now(), submissions: 0, total: 40, status: "ACTIVE", createdAt: new Date().toISOString().split("T")[0], subject: "Mathematics" });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Assign Homework</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Title", name: "title", placeholder: "e.g. Exercise 4.3", type: "text" },
            { label: "Due Date", name: "dueDate", type: "date" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{f.label} *</label>
              <input type={f.type} value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} placeholder={f.placeholder} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Class *</label>
            <select value={form.classId} onChange={(e) => setForm((p) => ({ ...p, classId: e.target.value }))} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none appearance-none transition-all">
              <option value="">Select class</option>
              {["9-A", "9-B", "10-A", "10-B"].map((c) => <option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Instructions</label>
            <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Additional instructions..." className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none resize-none transition-all" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Assigning...</> : "Assign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeacherHomeworkPage() {
  const [homework, setHomework] = useState(MY_HW);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? homework : homework.filter((h) => h.status === filter);

  const statusConfig = {
    ACTIVE: { label: "Active", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400" },
    COMPLETED: { label: "Completed", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
    PAST: { label: "Past Due", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400" },
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/teacher" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Homework</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{homework.length} assignments</p>
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> Assign Homework
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", "ACTIVE", "COMPLETED", "PAST"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${filter === f ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase().replace("_", " ")} ({f === "ALL" ? homework.length : homework.filter((h) => h.status === f).length})
            </button>
          ))}
        </div>

        {/* HW Cards */}
        <div className="space-y-4">
          {filtered.map((hw) => {
            const sc = statusConfig[hw.status];
            const pct = Math.round((hw.submissions / hw.total) * 100);
            return (
              <div key={hw.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <BookOpenCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{hw.title}</h3>
                      <p className="text-[12px] text-slate-400 mt-0.5">
                        Class {hw.class} • {hw.subject} • Due: {new Date(hw.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-bold ${sc.bg} ${sc.text} flex-shrink-0`}>
                    {sc.label}
                  </span>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] text-slate-500 dark:text-slate-400">Submissions</span>
                    <span className="text-[12px] font-bold text-slate-900 dark:text-white">{hw.submissions}/{hw.total}</span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{pct}% submitted</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {showAdd && <AddHWModal onClose={() => setShowAdd(false)} onAdd={(hw) => setHomework((p) => [hw, ...p])} />}
    </>
  );
}