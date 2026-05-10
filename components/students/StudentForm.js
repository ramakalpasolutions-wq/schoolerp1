// components/students/StudentForm.js
"use client";

import { useState } from "react";
import { Save, Loader2, User, Phone, Mail, MapPin, Calendar, Hash } from "lucide-react";

const CLASSES = ["6-A","6-B","7-A","7-B","8-A","8-B","9-A","9-B","10-A","10-B"];
const GENDERS  = ["Male", "Female", "Other"];
const BLOOD    = ["A+","A-","B+","B-","O+","O-","AB+","AB-"];

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

const INPUT = "w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:border-blue-500 transition-all placeholder-slate-400";
const SELECT = `${INPUT} appearance-none cursor-pointer`;

export default function StudentForm({
  initial  = {},
  onSubmit,
  loading  = false,
  mode     = "add",  // "add" | "edit"
}) {
  const [form, setForm] = useState({
    name:        initial.name        || "",
    admNo:       initial.admNo       || "",
    dob:         initial.dob         || "",
    gender:      initial.gender      || "Male",
    bloodGroup:  initial.bloodGroup  || "O+",
    className:   initial.className   || "6-A",
    rollNo:      initial.rollNo      || "",
    parentName:  initial.parentName  || "",
    parentPhone: initial.parentPhone || "",
    email:       initial.email       || "",
    address:     initial.address     || "",
    status:      initial.status      || "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())        e.name        = "Name is required";
    if (!form.admNo.trim())       e.admNo       = "Admission number is required";
    if (!form.dob)                e.dob         = "Date of birth is required";
    if (!form.parentName.trim())  e.parentName  = "Parent name is required";
    if (!form.parentPhone.trim()) e.parentPhone = "Parent phone is required";
    else if (!/^\d{10}$/.test(form.parentPhone))
      e.parentPhone = "Enter a valid 10-digit phone number";
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

      {/* ── Personal Info ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" /> Personal Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" required>
            <input className={INPUT} placeholder="e.g. Aarav Sharma"
              value={form.name} onChange={(e) => set("name", e.target.value)} />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </Field>

          <Field label="Admission Number" required>
            <input className={INPUT} placeholder="e.g. ADM/2024/0001"
              value={form.admNo} onChange={(e) => set("admNo", e.target.value)} />
            {errors.admNo && <p className="text-red-500 text-xs mt-1">{errors.admNo}</p>}
          </Field>

          <Field label="Date of Birth" required>
            <input type="date" className={INPUT}
              value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
          </Field>

          <Field label="Gender">
            <select className={SELECT}
              value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              {GENDERS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </Field>

          <Field label="Blood Group">
            <select className={SELECT}
              value={form.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)}>
              {BLOOD.map((b) => <option key={b}>{b}</option>)}
            </select>
          </Field>

          <Field label="Email">
            <input type="email" className={INPUT} placeholder="student@school.edu"
              value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>

        <Field label="Address">
          <textarea rows={2} className={INPUT} placeholder="Full address..."
            value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
      </div>

      {/* ── Academic Info ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Hash className="w-4 h-4 text-blue-500" /> Academic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Class" required>
            <select className={SELECT}
              value={form.className} onChange={(e) => set("className", e.target.value)}>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Roll Number">
            <input className={INPUT} placeholder="e.g. 15"
              value={form.rollNo} onChange={(e) => set("rollNo", e.target.value)} />
          </Field>

          <Field label="Status">
            <select className={SELECT}
              value={form.status} onChange={(e) => set("status", e.target.value)}>
              {["ACTIVE","INACTIVE","ALUMNI"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* ── Parent Info ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-500" /> Parent / Guardian
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Parent Name" required>
            <input className={INPUT} placeholder="e.g. Ramesh Sharma"
              value={form.parentName} onChange={(e) => set("parentName", e.target.value)} />
            {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName}</p>}
          </Field>

          <Field label="Parent Phone" required>
            <input className={INPUT} placeholder="10-digit mobile"
              value={form.parentPhone} maxLength={10}
              onChange={(e) => set("parentPhone", e.target.value.replace(/\D/g, ""))} />
            {errors.parentPhone && <p className="text-red-500 text-xs mt-1">{errors.parentPhone}</p>}
          </Field>
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            : <><Save className="w-4 h-4" /> {mode === "edit" ? "Save Changes" : "Add Student"}</>
          }
        </button>
      </div>
    </form>
  );
}