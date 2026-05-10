// components/teachers/TeacherForm.js
"use client";

import { useState } from "react";
import { Save, Loader2, User, Phone, BookOpen } from "lucide-react";

const SUBJECTS = [
  "Mathematics","Physics","Chemistry","Biology",
  "English","Telugu","Hindi","Social Studies",
  "Computer Science","Physical Education","Arts","Music",
];
const QUALIFICATIONS = ["B.Ed","M.Ed","B.Sc B.Ed","M.Sc","Ph.D","Other"];

const INPUT  = "w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all placeholder-slate-400";
const SELECT = `${INPUT} appearance-none cursor-pointer`;

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function TeacherForm({
  initial = {},
  onSubmit,
  loading = false,
  mode    = "add",
}) {
  const [form, setForm] = useState({
    name:          initial.name          || "",
    empId:         initial.empId         || "",
    email:         initial.email         || "",
    phone:         initial.phone         || "",
    subject:       initial.subject       || "Mathematics",
    qualification: initial.qualification || "B.Ed",
    dob:           initial.dob           || "",
    gender:        initial.gender        || "Male",
    joiningDate:   initial.joiningDate   || "",
    salary:        initial.salary        || "",
    address:       initial.address       || "",
    status:        initial.status        || "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    onSubmit?.(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Personal */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-500" /> Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <input className={INPUT} placeholder="e.g. Suresh Kumar"
              value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </Field>
          <Field label="Employee ID">
            <input className={INPUT} placeholder="e.g. EMP/001"
              value={form.empId} onChange={(e) => set("empId", e.target.value)} />
          </Field>
          <Field label="Email" required>
            <input type="email" className={INPUT} placeholder="teacher@school.edu"
              value={form.email} onChange={(e) => set("email", e.target.value)} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </Field>
          <Field label="Phone" required>
            <input className={INPUT} placeholder="10-digit mobile" maxLength={10}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </Field>
          <Field label="Date of Birth">
            <input type="date" className={INPUT}
              value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </Field>
          <Field label="Gender">
            <select className={SELECT}
              value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {["Male","Female","Other"].map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Address">
          <textarea rows={2} className={INPUT} placeholder="Full address..."
            value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </div>

      {/* Academic */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" /> Academic Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Subject">
            <select className={SELECT}
              value={form.subject} onChange={(e) => set("subject", e.target.value)}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Qualification">
            <select className={SELECT}
              value={form.qualification} onChange={(e) => set("qualification", e.target.value)}>
              {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
            </select>
          </Field>
          <Field label="Joining Date">
            <input type="date" className={INPUT}
              value={form.joiningDate} onChange={(e) => set("joiningDate", e.target.value)} />
          </Field>
          <Field label="Monthly Salary (₹)">
            <input type="number" className={INPUT} placeholder="e.g. 35000"
              value={form.salary} onChange={(e) => set("salary", e.target.value)} />
          </Field>
          <Field label="Status">
            <select className={SELECT}
              value={form.status} onChange={(e) => set("status", e.target.value)}>
              {["ACTIVE","INACTIVE"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button type="submit" disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-500/20">
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> {mode === "edit" ? "Save Changes" : "Add Teacher"}</>
          }
        </button>
      </div>
    </form>
  );
}