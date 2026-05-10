// src/app/(dashboard)/admin/classes/page.js

"use client";

import { useState } from "react";
import {
  BookOpen, Plus, Users, GraduationCap, Pencil, Trash2,
  X, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react";

const MOCK_CLASSES = [
  { id: "cls_1", name: "6", section: "A", students: 35, classTeacher: "Suresh Kumar", subjects: 6 },
  { id: "cls_2", name: "6", section: "B", students: 33, classTeacher: "Radha Devi", subjects: 6 },
  { id: "cls_3", name: "7", section: "A", students: 38, classTeacher: "Priya Sharma", subjects: 7 },
  { id: "cls_4", name: "7", section: "B", students: 36, classTeacher: "Ravi Nair", subjects: 7 },
  { id: "cls_5", name: "8", section: "A", students: 40, classTeacher: "Lakshmi Rao", subjects: 7 },
  { id: "cls_6", name: "8", section: "B", students: 38, classTeacher: "Venkatesh N", subjects: 7 },
  { id: "cls_7", name: "9", section: "A", students: 45, classTeacher: "Anitha R", subjects: 8 },
  { id: "cls_8", name: "9", section: "B", students: 43, classTeacher: "Kiran Babu", subjects: 8 },
  { id: "cls_9", name: "10", section: "A", students: 48, classTeacher: "Padmaja K", subjects: 8 },
  { id: "cls_10", name: "10", section: "B", students: 46, classTeacher: "Ramesh G", subjects: 8 },
];

const CLASS_COLORS = ["from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-purple-500 to-violet-600", "from-orange-500 to-amber-600", "from-pink-500 to-rose-600"];

function AddClassModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", section: "A", classTeacher: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name) errs.name = "Class name required";
    if (!form.section) errs.section = "Section required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    onAdd({ id: `cls_${Date.now()}`, ...form, students: 0, subjects: 0 });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Add New Class</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Class Name *</label>
            <select value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all appearance-none ${errors.name ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}>
              <option value="">Select class</option>
              {["1","2","3","4","5","6","7","8","9","10"].map((c) => <option key={c} value={c}>Class {c}</option>)}
            </select>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Section *</label>
            <div className="flex gap-2">
              {["A","B","C","D"].map((s) => (
                <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, section: s }))} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${form.section === s ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Class Teacher</label>
            <input value={form.classTeacher} onChange={(e) => setForm((p) => ({ ...p, classTeacher: e.target.value }))} placeholder="e.g. Suresh Kumar" className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-60 transition-all">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : "Add Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalStudents = classes.reduce((s, c) => s + c.students, 0);
  const grouped = classes.reduce((acc, cls) => {
    const key = `Class ${cls.name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cls);
    return acc;
  }, {});

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Classes</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {classes.length} classes • {totalStudents.toLocaleString()} total students
            </p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> Add Class
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Classes", value: classes.length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20" },
            { label: "Total Students", value: totalStudents, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" },
            { label: "Avg Class Size", value: Math.round(totalStudents / classes.length), color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20" },
            { label: "Class Groups", value: Object.keys(grouped).length, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center justify-between p-4 rounded-2xl border ${s.bg}`}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Class Grid */}
        {Object.entries(grouped).map(([grade, sections], gi) => (
          <div key={grade}>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" /> {grade}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sections.map((cls, ci) => {
                const gradient = CLASS_COLORS[(gi + ci) % CLASS_COLORS.length];
                return (
                  <div key={cls.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                    {/* Top colored band */}
                    <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-xl font-black">{cls.name}{cls.section}</span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTarget(cls.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Users className="w-4 h-4" />
                            <span>{cls.students} students</span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{cls.subjects} subjects</span>
                        </div>
                        {cls.classTeacher && (
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <GraduationCap className="w-4 h-4" />
                            <span className="truncate">{cls.classTeacher}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <AddClassModal
          onClose={() => setShowAdd(false)}
          onAdd={(cls) => setClasses((p) => [...p, cls])}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Delete Class</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Are you sure? All associated data will be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm">Cancel</button>
              <button onClick={() => { setClasses((p) => p.filter((c) => c.id !== deleteTarget)); setDeleteTarget(null); }} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}