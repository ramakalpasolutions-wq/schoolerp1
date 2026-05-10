// src/app/(dashboard)/admin/exams/create/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, FileText, Calendar, Users, CheckCircle2,
  Loader2, AlertCircle, ChevronDown, BookOpen, Plus, X,
  GraduationCap,
} from "lucide-react";

const EXAM_TYPES = [
  { value: "UNIT_TEST", label: "Unit Test" },
  { value: "MID_TERM", label: "Mid-Term" },
  { value: "QUARTERLY", label: "Quarterly" },
  { value: "HALF_YEARLY", label: "Half-Yearly" },
  { value: "ANNUAL", label: "Annual" },
  { value: "MOCK", label: "Mock Test" },
  { value: "FINAL", label: "Final Exam" },
];

const ALL_CLASSES = [
  { id: "cls_1a", label: "Class 1-A", students: 35 },
  { id: "cls_2a", label: "Class 2-A", students: 33 },
  { id: "cls_3a", label: "Class 3-A", students: 38 },
  { id: "cls_4a", label: "Class 4-A", students: 36 },
  { id: "cls_5a", label: "Class 5-A", students: 42 },
  { id: "cls_5b", label: "Class 5-B", students: 39 },
  { id: "cls_6a", label: "Class 6-A", students: 44 },
  { id: "cls_7a", label: "Class 7-A", students: 41 },
  { id: "cls_8a", label: "Class 8-A", students: 38 },
  { id: "cls_9a", label: "Class 9-A", students: 45 },
  { id: "cls_9b", label: "Class 9-B", students: 43 },
  { id: "cls_10a", label: "Class 10-A", students: 48 },
  { id: "cls_10b", label: "Class 10-B", students: 46 },
];

function InputField({ label, name, value, onChange, type = "text", placeholder, required, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

export default function CreateExamPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedClasses, setSelectedClasses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    status: "UPCOMING",
    academicYear: "2024-2025",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function toggleClass(id) {
    setSelectedClasses((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
    if (errors.classes) setErrors((p) => ({ ...p, classes: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Exam name is required";
    if (!form.type) errs.type = "Exam type is required";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.endDate) errs.endDate = "End date is required";
    if (form.startDate && form.endDate && form.endDate < form.startDate) errs.endDate = "End date must be after start date";
    if (selectedClasses.length === 0) errs.classes = "Select at least one class";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => router.push("/admin/exams"), 2000);
  }

  const totalStudents = ALL_CLASSES.filter((c) => selectedClasses.includes(c.id)).reduce((s, c) => s + c.students, 0);

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Exam Created!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">{form.name} has been scheduled successfully</p>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/exams" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Exam</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Schedule a new examination</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Exam Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <InputField label="Exam Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Unit Test 1 - March 2025" required error={errors.name} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Exam Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select name="type" value={form.type} onChange={handleChange} className={`w-full pl-3.5 pr-9 py-3 rounded-xl border-2 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all ${errors.type ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}>
                  <option value="">Select type</option>
                  {EXAM_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {errors.type && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.type}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Academic Year</label>
              <div className="relative">
                <select name="academicYear" value={form.academicYear} onChange={handleChange} className="w-full pl-3.5 pr-9 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all">
                  <option value="2024-2025">2024-2025</option>
                  <option value="2025-2026">2025-2026</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <InputField label="Start Date" name="startDate" value={form.startDate} onChange={handleChange} type="date" required error={errors.startDate} />
            <InputField label="End Date" name="endDate" value={form.endDate} onChange={handleChange} type="date" required error={errors.endDate} />
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description (Optional)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Additional instructions or details..." className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all" />
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Classes</h3>
            </div>
            <div className="flex items-center gap-3">
              {selectedClasses.length > 0 && (
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {selectedClasses.length} selected • {totalStudents} students
                </span>
              )}
              <button type="button" onClick={() => setSelectedClasses(selectedClasses.length === ALL_CLASSES.length ? [] : ALL_CLASSES.map((c) => c.id))} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                {selectedClasses.length === ALL_CLASSES.length ? "Deselect All" : "Select All"}
              </button>
            </div>
          </div>
          {errors.classes && <div className="mb-3 flex items-center gap-2 text-sm text-red-500"><AlertCircle className="w-4 h-4" />{errors.classes}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {ALL_CLASSES.map((cls) => {
              const selected = selectedClasses.includes(cls.id);
              return (
                <button
                  key={cls.id}
                  type="button"
                  onClick={() => toggleClass(cls.id)}
                  className={`flex flex-col items-center gap-1 p-3.5 rounded-xl border-2 transition-all ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
                >
                  <span className={`text-sm font-bold ${selected ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>{cls.label}</span>
                  <span className="text-[10px] text-slate-400">{cls.students} students</span>
                  {selected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/admin/exams" className="flex-1 flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Exam</>}
          </button>
        </div>
      </form>
    </div>
  );
}