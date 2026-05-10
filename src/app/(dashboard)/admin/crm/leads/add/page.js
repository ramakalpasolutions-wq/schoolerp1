// src/app/(dashboard)/admin/crm/leads/add/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, User, Phone, Mail, GraduationCap, Globe,
  Calendar, MessageSquare, Send, Loader2, CheckCircle2,
  AlertCircle, ChevronDown, UserPlus, Star,
} from "lucide-react";

const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const SOURCES = [
  { value: "GOOGLE", label: "Google", emoji: "🔍" },
  { value: "FACEBOOK", label: "Facebook", emoji: "📘" },
  { value: "INSTAGRAM", label: "Instagram", emoji: "📷" },
  { value: "WALKIN", label: "Walk-in", emoji: "🚶" },
  { value: "REFERENCE", label: "Reference", emoji: "🤝" },
  { value: "NEWSPAPER", label: "Newspaper", emoji: "📰" },
  { value: "OTHER", label: "Other", emoji: "📌" },
];
const COUNSELORS = ["Priya Sharma", "Ravi Kumar", "Anitha Reddy", "Suresh Nair"];
const PRIORITIES = ["HIGH", "MEDIUM", "LOW"];

function InputField({ label, name, value, onChange, type = "text", placeholder, required, error, hint }) {
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
        className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${
          error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
        }`}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-3.5 pr-9 py-3 rounded-xl border-2 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-sm transition-all ${
            error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

export default function AddLeadPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    childName: "",
    childDob: "",
    classInterested: "",
    source: "",
    assignedTo: "",
    followUpDate: "",
    priority: "MEDIUM",
    notes: "",
    siblingInSchool: false,
    previousSchool: "",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.parentName.trim()) errs.parentName = "Parent name is required";
    if (!form.parentPhone.trim()) errs.parentPhone = "Phone number is required";
    else if (!/^\d{10}$/.test(form.parentPhone)) errs.parentPhone = "Enter valid 10-digit phone";
    if (!form.childName.trim()) errs.childName = "Child name is required";
    if (!form.classInterested) errs.classInterested = "Class interested is required";
    if (!form.source) errs.source = "Source is required";
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
    setTimeout(() => router.push("/admin/crm"), 2000);
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lead Added!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">{form.parentName} has been added to the pipeline</p>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecting to CRM...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/crm" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New Lead</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fill in the inquiry details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Parent Details */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Parent Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Parent Name" name="parentName" value={form.parentName} onChange={handleChange} placeholder="e.g. Ramesh Reddy" required error={errors.parentName} />
            <InputField label="Mobile Number" name="parentPhone" value={form.parentPhone} onChange={handleChange} placeholder="10-digit phone" type="tel" required error={errors.parentPhone} />
            <InputField label="Email Address" name="parentEmail" value={form.parentEmail} onChange={handleChange} placeholder="email@example.com" type="email" />
          </div>
        </div>

        {/* Child Details */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Child Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Child Name" name="childName" value={form.childName} onChange={handleChange} placeholder="e.g. Arjun Reddy" required error={errors.childName} />
            <InputField label="Date of Birth" name="childDob" value={form.childDob} onChange={handleChange} type="date" />
            <SelectField label="Class Interested" name="classInterested" value={form.classInterested} onChange={handleChange} options={CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))} required error={errors.classInterested} />
            <InputField label="Previous School" name="previousSchool" value={form.previousSchool} onChange={handleChange} placeholder="e.g. Green Valley School" />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer mt-4 group">
            <div className="relative">
              <input type="checkbox" name="siblingInSchool" checked={form.siblingInSchool} onChange={handleChange} className="sr-only peer" />
              <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all flex items-center justify-center">
                {form.siblingInSchool && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              Sibling already studying in this school
            </span>
          </label>
        </div>

        {/* Lead Info */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lead Information</h3>
          </div>

          {/* Source Selector */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Inquiry Source <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
              {SOURCES.map((src) => (
                <button
                  key={src.value}
                  type="button"
                  onClick={() => { setForm((p) => ({ ...p, source: src.value })); if (errors.source) setErrors((p) => ({ ...p, source: "" })); }}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all text-center ${
                    form.source === src.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="text-lg">{src.emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{src.label}</span>
                </button>
              ))}
            </div>
            {errors.source && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.source}</p>}
          </div>

          {/* Priority */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    form.priority === p
                      ? p === "HIGH" ? "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                        : p === "MEDIUM" ? "border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-slate-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-500"
                  }`}
                >
                  {p === "HIGH" && <Star className="w-3.5 h-3.5 fill-current" />}
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField label="Assigned Counselor" name="assignedTo" value={form.assignedTo} onChange={handleChange} options={COUNSELORS.map((c) => ({ value: c, label: c }))} />
            <InputField label="Follow-up Date" name="followUpDate" value={form.followUpDate} onChange={handleChange} type="date" />
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notes / Remarks</h3>
          </div>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Initial conversation details, special requirements, any important notes..."
            className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/admin/crm" className="flex-1 flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Adding Lead...</>
            ) : (
              <><UserPlus className="w-4 h-4" /> Add Lead to Pipeline</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}