// src/app/(dashboard)/admin/academic-years/page.js

"use client";

import { useState } from "react";
import {
  CalendarDays, Plus, CheckCircle2, Clock, ArrowRight,
  X, Loader2, AlertCircle, Users, BookOpen, Pencil,
} from "lucide-react";

const ACADEMIC_YEARS = [
  { id: "AY001", name: "2024-2025", startDate: "2024-06-01", endDate: "2025-04-30", isActive: true, totalStudents: 1248, totalClasses: 10 },
  { id: "AY002", name: "2023-2024", startDate: "2023-06-01", endDate: "2024-04-30", isActive: false, totalStudents: 1180, totalClasses: 10 },
  { id: "AY003", name: "2022-2023", startDate: "2022-06-01", endDate: "2023-04-30", isActive: false, totalStudents: 1120, totalClasses: 9 },
  { id: "AY004", name: "2025-2026", startDate: "2025-06-01", endDate: "2026-04-30", isActive: false, totalStudents: 0, totalClasses: 0 },
];

function AddYearModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Year name required (e.g. 2025-2026)";
    if (!form.startDate) errs.startDate = "Start date required";
    if (!form.endDate) errs.endDate = "End date required";
    if (form.startDate && form.endDate && form.endDate <= form.startDate) errs.endDate = "End date must be after start date";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    onAdd({ id: `AY${Date.now()}`, ...form, isActive: false, totalStudents: 0, totalClasses: 0 });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Academic Year</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Year Name", name: "name", type: "text", placeholder: "e.g. 2025-2026" },
            { label: "Start Date", name: "startDate", type: "date" },
            { label: "End Date", name: "endDate", type: "date" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{f.label} *</label>
              <input type={f.type} value={form[f.name]} onChange={(e) => setForm((p) => ({ ...p, [f.name]: e.target.value }))} placeholder={f.placeholder} className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${errors[f.name] ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`} />
              {errors[f.name] && <p className="mt-1 text-xs text-red-500">{errors[f.name]}</p>}
            </div>
          ))}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-md disabled:opacity-60 transition-all">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Year"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AcademicYearsPage() {
  const [years, setYears] = useState(ACADEMIC_YEARS);
  const [showAdd, setShowAdd] = useState(false);
  const [activating, setActivating] = useState(null);

  async function handleActivate(id) {
    setActivating(id);
    await new Promise((r) => setTimeout(r, 1000));
    setYears((prev) => prev.map((y) => ({ ...y, isActive: y.id === id })));
    setActivating(null);
  }

  const activeYear = years.find((y) => y.isActive);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Academic Years</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage academic year cycles</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> New Academic Year
          </button>
        </div>

        {/* Active Year Banner */}
        {activeYear && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider">Currently Active</span>
                </div>
                <h2 className="text-2xl font-bold text-white">{activeYear.name}</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {new Date(activeYear.startDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} →{" "}
                  {new Date(activeYear.endDate).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-white font-bold text-lg">{activeYear.totalStudents.toLocaleString()}</p>
                  <p className="text-blue-100 text-[11px]">Students</p>
                </div>
                <div className="text-center bg-white/10 rounded-xl px-4 py-2">
                  <p className="text-white font-bold text-lg">{activeYear.totalClasses}</p>
                  <p className="text-blue-100 text-[11px]">Classes</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Years List */}
        <div className="space-y-4">
          {years.map((year) => {
            const isActive = year.isActive;
            const isUpcoming = new Date(year.startDate) > new Date();
            const isPast = new Date(year.endDate) < new Date() && !isActive;

            return (
              <div key={year.id} className={`rounded-2xl border-2 ${isActive ? "border-blue-300 dark:border-blue-500/40 bg-blue-50/30 dark:bg-blue-950/10" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"} p-6 transition-all duration-300`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-blue-600 shadow-lg shadow-blue-500/25" : isPast ? "bg-slate-200 dark:bg-slate-700" : "bg-slate-100 dark:bg-slate-800"}`}>
                      <CalendarDays className={`w-6 h-6 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{year.name}</h3>
                        {isActive && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            ACTIVE
                          </span>
                        )}
                        {isUpcoming && !isActive && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold">UPCOMING</span>
                        )}
                        {isPast && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-bold">PAST</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(year.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} →{" "}
                        {new Date(year.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {year.totalStudents > 0 && (
                      <div className="flex gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{year.totalStudents.toLocaleString()}</p>
                          <p className="text-[11px] text-slate-400">Students</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{year.totalClasses}</p>
                          <p className="text-[11px] text-slate-400">Classes</p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {!isActive && (
                        <button
                          onClick={() => handleActivate(year.id)}
                          disabled={activating === year.id}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all active:scale-95"
                        >
                          {activating === year.id ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Activating...</>
                          ) : (
                            <><CheckCircle2 className="w-4 h-4" /> Set Active</>
                          )}
                        </button>
                      )}
                      <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <span className="font-semibold">Note:</span> Only one academic year can be active at a time. Activating a new year will deactivate the current one. Student records and promotions are tracked per academic year.
          </div>
        </div>
      </div>

      {showAdd && (
        <AddYearModal
          onClose={() => setShowAdd(false)}
          onAdd={(year) => setYears((p) => [...p, year])}
        />
      )}
    </>
  );
}