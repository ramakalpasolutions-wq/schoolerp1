// src/app/(dashboard)/admin/teachers/add/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, GraduationCap, Save, Loader2, CheckCircle2,
  AlertCircle, ChevronDown, Camera, Upload,
} from "lucide-react";

const SUBJECTS = ["Mathematics", "Science", "Physics", "Chemistry", "Biology", "English", "Hindi", "Telugu", "Social Studies", "Computer Science", "Physical Education", "Arts", "Music"];
const QUALIFICATIONS = ["B.Ed", "M.Sc + B.Ed", "MA + B.Ed", "MCA + B.Ed", "M.Phil + B.Ed", "Ph.D", "Other"];
const CLASSES = ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B"];

function InputField({ label, name, value, onChange, type = "text", placeholder, required, error, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`} />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

export default function AddTeacherPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", employeeId: "", qualification: "",
    joiningDate: "", salary: "", designation: "Teacher", photo: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) errs.phone = "Enter valid 10-digit phone";
    if (!form.joiningDate) errs.joiningDate = "Joining date is required";
    if (!form.salary) errs.salary = "Salary is required";
    if (selectedSubjects.length === 0) errs.subjects = "Select at least one subject";
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
    setTimeout(() => router.push("/admin/teachers"), 2000);
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Teacher Added!</h2>
          <p className="text-slate-500 dark:text-slate-400">{form.name} has been enrolled successfully</p>
          <div className="flex items-center justify-center gap-2 mt-4 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/teachers" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Teacher</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fill in the details to enroll a teacher</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Personal */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" /> Personal Details
          </h3>
          <div className="flex items-start gap-5 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Suresh Kumar" required error={errors.name} />
              <InputField label="Employee ID" name="employeeId" value={form.employeeId} onChange={handleChange} placeholder="e.g. EMP001" hint="Leave blank to auto-generate" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Mobile Number" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone" type="tel" required error={errors.phone} />
            <InputField label="Email Address" name="email" value={form.email} onChange={handleChange} placeholder="teacher@school.com" type="email" />
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Qualification</label>
              <div className="relative">
                <select name="qualification" value={form.qualification} onChange={handleChange} className="w-full pl-3.5 pr-9 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all">
                  <option value="">Select qualification</option>
                  {QUALIFICATIONS.map((q) => <option key={q} value={q}>{q}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <InputField label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Senior Teacher" />
            <InputField label="Joining Date" name="joiningDate" value={form.joiningDate} onChange={handleChange} type="date" required error={errors.joiningDate} />
            <InputField label="Monthly Salary (₹)" name="salary" value={form.salary} onChange={handleChange} type="number" placeholder="e.g. 30000" required error={errors.salary} />
          </div>
        </div>

        {/* Subjects */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Subjects</h3>
          {errors.subjects && <p className="mb-3 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.subjects}</p>}
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((sub) => {
              const selected = selectedSubjects.includes(sub);
              return (
                <button key={sub} type="button" onClick={() => setSelectedSubjects((p) => selected ? p.filter((s) => s !== sub) : [...p, sub])}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
                  {sub}
                </button>
              );
            })}
          </div>
        </div>

        {/* Classes */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Assigned Classes</h3>
            <button type="button" onClick={() => setSelectedClasses(selectedClasses.length === CLASSES.length ? [] : CLASSES)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
              {selectedClasses.length === CLASSES.length ? "Deselect All" : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {CLASSES.map((c) => {
              const selected = selectedClasses.includes(c);
              return (
                <button key={c} type="button" onClick={() => setSelectedClasses((p) => selected ? p.filter((x) => x !== c) : [...p, c])}
                  className={`py-2 rounded-xl text-sm font-semibold border-2 transition-all text-center ${selected ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"}`}>
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/admin/teachers" className="flex-1 flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : <><Save className="w-4 h-4" /> Add Teacher</>}
          </button>
        </div>
      </form>
    </div>
  );
}