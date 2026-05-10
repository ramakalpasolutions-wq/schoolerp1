// src/app/(dashboard)/admin/students/add/page.js

"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  GraduationCap,
  Users,
  MapPin,
  FileText,
  Eye,
  Upload,
  X,
  CheckCircle2,
  Loader2,
  Camera,
  ChevronDown,
  AlertCircle,
  Pencil,
  PartyPopper,
} from "lucide-react";
import { generateAdmissionNumber } from "../../../../../lib/utils";

// ── Steps Config ─────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: "Personal", icon: User, short: "Personal" },
  { id: 2, title: "Academic", icon: GraduationCap, short: "Academic" },
  { id: 3, title: "Parents", icon: Users, short: "Parents" },
  { id: 4, title: "Address", icon: MapPin, short: "Address" },
  { id: 5, title: "Documents", icon: FileText, short: "Docs" },
  { id: 6, title: "Review", icon: Eye, short: "Review" },
];

// ── Select Field ─────────────────────────────────────────────────
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
          className={`w-full px-3.5 py-3 rounded-xl border-2 appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all text-sm ${
            error
              ? "border-red-300 dark:border-red-700"
              : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
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
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

// ── Input Field ──────────────────────────────────────────────────
function InputField({ label, name, value, onChange, type = "text", placeholder, required, error, readOnly, hint }) {
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
        readOnly={readOnly}
        className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all text-sm ${
          readOnly ? "bg-slate-50 dark:bg-slate-800 cursor-not-allowed opacity-70" : ""
        } ${
          error
            ? "border-red-300 dark:border-red-700"
            : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
        }`}
      />
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}

// ── Photo Upload ─────────────────────────────────────────────────
function PhotoUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    onChange(url);
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
      className={`relative flex flex-col items-center justify-center w-32 h-32 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${
        drag
          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
          : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {value ? (
        <>
          <img src={value} alt="Student" className="w-full h-full object-cover rounded-2xl" />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <div className="text-center">
          <Camera className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-[11px] text-slate-400 dark:text-slate-500">Upload Photo</p>
        </div>
      )}
    </div>
  );
}

// ── Document Upload Zone ─────────────────────────────────────────
function DocUpload({ label, accept = ".pdf,.jpg,.jpeg,.png", value, onChange }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);

  function handleFile(file) {
    if (!file) return;
    onChange({ name: file.name, size: file.size, type: file.type, url: URL.createObjectURL(file) });
  }

  return (
    <div
      onClick={() => !value && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); if (!value) handleFile(e.dataTransfer.files[0]); }}
      className={`flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
        value
          ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 cursor-default"
          : drag
          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 cursor-pointer"
          : "border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <div className="flex items-center gap-3 min-w-0">
        {value ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        ) : (
          <Upload className="w-5 h-5 text-slate-400 flex-shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
          {value ? (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate max-w-[200px]">
              {value.name}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400">Click or drag to upload</p>
          )}
        </div>
      </div>
      {value && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onChange(null); }}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// ── Review Row ───────────────────────────────────────────────────
function ReviewRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500 flex-shrink-0">{label}</span>
      <span className="text-xs font-semibold text-slate-900 dark:text-white text-right">{value}</span>
    </div>
  );
}

// ── Review Section ───────────────────────────────────────────────
function ReviewSection({ title, icon: Icon, onEdit, children }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">{title}</span>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <Pencil className="w-3 h-3" /> Edit
        </button>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
export default function AddStudentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Step 1 — Personal
    fullName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    religion: "",
    category: "",
    photo: null,

    // Step 2 — Academic
    admissionNo: generateAdmissionNumber(),
    academicYear: "2024-2025",
    class: "",
    section: "",
    rollNo: "",
    previousSchool: "",
    previousClass: "",

    // Step 3 — Parents
    fatherName: "",
    fatherPhone: "",
    fatherEmail: "",
    fatherOccupation: "",
    motherName: "",
    motherPhone: "",
    motherEmail: "",
    motherOccupation: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyRelationship: "",

    // Step 4 — Address
    currentAddress: "",
    permanentAddress: "",
    city: "",
    state: "",
    pincode: "",

    // Step 5 — Documents
    birthCertificate: null,
    transferCertificate: null,
    previousMarksheet: null,
    aadhaarCard: null,
    addressProof: null,
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleDocChange(field, val) {
    setFormData((prev) => ({ ...prev, [field]: val }));
  }

  // ── Validation ────────────────────────────────────────────────
  function validateStep(step) {
    const errs = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = "Full name is required";
      if (!formData.dob) errs.dob = "Date of birth is required";
      if (!formData.gender) errs.gender = "Gender is required";
    }
    if (step === 2) {
      if (!formData.class) errs.class = "Class is required";
      if (!formData.section) errs.section = "Section is required";
    }
    if (step === 3) {
      if (!formData.fatherName.trim()) errs.fatherName = "Father's name is required";
      if (!formData.fatherPhone.trim()) errs.fatherPhone = "Father's phone is required";
      else if (!/^\d{10}$/.test(formData.fatherPhone)) errs.fatherPhone = "Enter valid 10-digit phone";
    }
    if (step === 4) {
      if (!formData.currentAddress.trim()) errs.currentAddress = "Current address is required";
      if (!formData.city.trim()) errs.city = "City is required";
      if (!formData.pincode.trim()) errs.pincode = "Pincode is required";
      else if (!/^\d{6}$/.test(formData.pincode)) errs.pincode = "Enter valid 6-digit pincode";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function nextStep() {
    if (validateStep(currentStep)) setCurrentStep((p) => Math.min(6, p + 1));
  }
  function prevStep() {
    setCurrentStep((p) => Math.max(1, p - 1));
  }
  function goToStep(n) {
    if (n < currentStep) setCurrentStep(n);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => router.push("/admin/students"), 3000);
  }

  // ── Success Screen ────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Student Added! 🎉
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            {formData.fullName} has been successfully enrolled
          </p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold mb-8">
            Admission No: {formData.admissionNo}
          </p>
          <div className="flex items-center justify-center gap-2 text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Redirecting to students list...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/students"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Add New Student
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Fill in the details to enroll a new student
          </p>
        </div>
      </div>

      {/* ── Progress Steps ────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 mx-8" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-500 mx-8"
            style={{ width: `calc(${((currentStep - 1) / (STEPS.length - 1)) * 100}% * (1 - 16px / (100% - 0px)))` }}
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const done = currentStep > step.id;
            const active = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                disabled={step.id > currentStep}
                className="relative z-10 flex flex-col items-center gap-2 disabled:cursor-not-allowed group"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    done
                      ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/25"
                      : active
                      ? "bg-white dark:bg-slate-900 border-blue-600 shadow-lg shadow-blue-500/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {done ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Icon
                      className={`w-4 h-4 ${active ? "text-blue-600" : "text-slate-400"}`}
                    />
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold hidden sm:block ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : done
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-400"
                  }`}
                >
                  {step.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* Step label */}
        <div className="mt-5 text-center sm:hidden">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </p>
        </div>
      </div>

      {/* ── Step Content ──────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
        {/* STEP 1 — Personal */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Personal Details
              </h2>
            </div>

            {/* Photo upload */}
            <div className="flex items-start gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Student Photo
                </label>
                <PhotoUpload
                  value={formData.photo}
                  onChange={(val) => setFormData((p) => ({ ...p, photo: val }))}
                />
              </div>
              <div className="flex-1 space-y-4">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  required
                  error={errors.fullName}
                />
                <InputField
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  required
                  error={errors.dob}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
                required
                error={errors.gender}
              />
              <SelectField
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
              />
              <SelectField
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                options={["Hindu", "Muslim", "Christian", "Sikh", "Buddhist", "Jain", "Other"]}
              />
              <SelectField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={["General", "OBC", "SC", "ST", "EWS"]}
              />
            </div>
          </div>
        )}

        {/* STEP 2 — Academic */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Academic Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Admission Number"
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                readOnly
                hint="Auto-generated — do not edit"
              />
              <SelectField
                label="Academic Year"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                options={["2024-2025", "2023-2024", "2025-2026"]}
                required
              />
              <SelectField
                label="Class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                required
                error={errors.class}
              />
              <SelectField
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                options={["A", "B", "C", "D"]}
                required
                error={errors.section}
              />
              <InputField
                label="Roll Number"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                placeholder="e.g. 25"
                type="number"
              />
              <InputField
                label="Previous School Name"
                name="previousSchool"
                value={formData.previousSchool}
                onChange={handleChange}
                placeholder="e.g. Green Valley School"
              />
              <InputField
                label="Previous Class"
                name="previousClass"
                value={formData.previousClass}
                onChange={handleChange}
                placeholder="e.g. 7th Grade"
              />
            </div>
          </div>
        )}

        {/* STEP 3 — Parents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Parent / Guardian Details
              </h2>
            </div>

            {/* Father */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold">F</span>
                Father's Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Full name" required error={errors.fatherName} />
                <InputField label="Mobile Number" name="fatherPhone" value={formData.fatherPhone} onChange={handleChange} placeholder="10-digit phone" type="tel" required error={errors.fatherPhone} />
                <InputField label="Email Address" name="fatherEmail" value={formData.fatherEmail} onChange={handleChange} placeholder="email@example.com" type="email" />
                <InputField label="Occupation" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleChange} placeholder="e.g. Engineer" />
              </div>
            </div>

            {/* Mother */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold">M</span>
                Mother's Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Full name" />
                <InputField label="Mobile Number" name="motherPhone" value={formData.motherPhone} onChange={handleChange} placeholder="10-digit phone" type="tel" />
                <InputField label="Email Address" name="motherEmail" value={formData.motherEmail} onChange={handleChange} placeholder="email@example.com" type="email" />
                <InputField label="Occupation" name="motherOccupation" value={formData.motherOccupation} onChange={handleChange} placeholder="e.g. Teacher" />
              </div>
            </div>

            {/* Emergency */}
            <div>
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center text-xs">🆘</span>
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InputField label="Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Full name" />
                <InputField label="Phone Number" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} placeholder="10-digit phone" type="tel" />
                <InputField label="Relationship" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} placeholder="e.g. Uncle" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — Address */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Address Details
              </h2>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="currentAddress"
                value={formData.currentAddress}
                onChange={handleChange}
                rows={3}
                placeholder="House No., Street, Area..."
                className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all ${
                  errors.currentAddress ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
                }`}
              />
              {errors.currentAddress && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.currentAddress}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Permanent Address
                </label>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, permanentAddress: p.currentAddress }))}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Same as current
                </button>
              </div>
              <textarea
                name="permanentAddress"
                value={formData.permanentAddress}
                onChange={handleChange}
                rows={3}
                placeholder="Permanent address..."
                className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Rajyampet"
                required
                error={errors.city}
              />
              <SelectField
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                options={[
                  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu",
                  "Maharashtra", "Gujarat", "Rajasthan", "Uttar Pradesh",
                  "West Bengal", "Delhi", "Kerala", "Other",
                ]}
              />
              <InputField
                label="Pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                type="text"
                required
                error={errors.pincode}
              />
            </div>
          </div>
        )}

        {/* STEP 5 — Documents */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Documents Upload
              </h2>
            </div>

            <div className="rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Document Requirements</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                  Accepted: PDF, JPG, PNG • Max size: 5 MB per file • All documents optional but recommended
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { field: "birthCertificate", label: "Birth Certificate" },
                { field: "transferCertificate", label: "Transfer Certificate (TC)" },
                { field: "previousMarksheet", label: "Previous Year Marksheet" },
                { field: "aadhaarCard", label: "Aadhaar Card" },
                { field: "addressProof", label: "Address Proof" },
              ].map((doc) => (
                <DocUpload
                  key={doc.field}
                  label={doc.label}
                  value={formData[doc.field]}
                  onChange={(val) => handleDocChange(doc.field, val)}
                />
              ))}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                {[formData.birthCertificate, formData.transferCertificate, formData.previousMarksheet, formData.aadhaarCard, formData.addressProof].filter(Boolean).length} of 5 documents uploaded
              </p>
            </div>
          </div>
        )}

        {/* STEP 6 — Review */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-6">
              <Eye className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Review & Submit
              </h2>
            </div>

            {/* Student header preview */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-500/20">
              {formData.photo ? (
                <img src={formData.photo} alt="Student" className="w-16 h-16 rounded-xl object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {formData.fullName?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {formData.fullName || "—"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Class {formData.class}{formData.section} • {formData.admissionNo}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ReviewSection title="Personal Details" icon={User} onEdit={() => setCurrentStep(1)}>
                <ReviewRow label="Full Name" value={formData.fullName} />
                <ReviewRow label="Date of Birth" value={formData.dob} />
                <ReviewRow label="Gender" value={formData.gender} />
                <ReviewRow label="Blood Group" value={formData.bloodGroup} />
                <ReviewRow label="Religion" value={formData.religion} />
                <ReviewRow label="Category" value={formData.category} />
              </ReviewSection>

              <ReviewSection title="Academic Details" icon={GraduationCap} onEdit={() => setCurrentStep(2)}>
                <ReviewRow label="Admission No." value={formData.admissionNo} />
                <ReviewRow label="Academic Year" value={formData.academicYear} />
                <ReviewRow label="Class & Section" value={formData.class && `${formData.class}-${formData.section}`} />
                <ReviewRow label="Roll Number" value={formData.rollNo} />
                <ReviewRow label="Previous School" value={formData.previousSchool} />
                <ReviewRow label="Previous Class" value={formData.previousClass} />
              </ReviewSection>

              <ReviewSection title="Parent Details" icon={Users} onEdit={() => setCurrentStep(3)}>
                <ReviewRow label="Father's Name" value={formData.fatherName} />
                <ReviewRow label="Father's Phone" value={formData.fatherPhone} />
                <ReviewRow label="Mother's Name" value={formData.motherName} />
                <ReviewRow label="Mother's Phone" value={formData.motherPhone} />
                <ReviewRow label="Emergency Contact" value={formData.emergencyContactName} />
              </ReviewSection>

              <ReviewSection title="Address" icon={MapPin} onEdit={() => setCurrentStep(4)}>
                <ReviewRow label="Current Address" value={formData.currentAddress} />
                <ReviewRow label="City" value={formData.city} />
                <ReviewRow label="State" value={formData.state} />
                <ReviewRow label="Pincode" value={formData.pincode} />
              </ReviewSection>
            </div>

            {/* Documents summary */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Documents</span>
                </div>
                <button onClick={() => setCurrentStep(5)} className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <Pencil className="w-3 h-3" /> Edit
                </button>
              </div>
              <div className="px-4 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: "Birth Certificate", val: formData.birthCertificate },
                  { label: "Transfer Certificate", val: formData.transferCertificate },
                  { label: "Marksheet", val: formData.previousMarksheet },
                  { label: "Aadhaar Card", val: formData.aadhaarCard },
                  { label: "Address Proof", val: formData.addressProof },
                ].map((doc) => (
                  <div key={doc.label} className={`flex items-center gap-1.5 text-xs font-medium ${doc.val ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`}>
                    {doc.val ? <CheckCircle2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    {doc.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation Buttons ────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="flex items-center gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                s.id === currentStep
                  ? "w-6 bg-blue-600"
                  : s.id < currentStep
                  ? "w-2 bg-blue-300 dark:bg-blue-700"
                  : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>

        {currentStep < 6 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 transition-all active:scale-95"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm & Enroll
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}