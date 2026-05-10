// src/app/(dashboard)/super-admin/schools/add/page.js

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Building2, Save, Loader2, CheckCircle2,
  AlertCircle, MapPin, Phone, Mail, Globe, User,
  Crown, Navigation,
} from "lucide-react";

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

export default function AddSchoolPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "", address: "", city: "", state: "", pincode: "",
    phone: "", email: "", website: "", principalName: "",
    geoLatitude: "", geoLongitude: "", geoRadius: "200",
    plan: "STANDARD", maxStudents: "500",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "School name is required";
    if (!form.phone.trim()) errs.phone = "Phone is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required";
    if (!form.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((p) => ({
        ...p,
        geoLatitude: pos.coords.latitude.toFixed(6),
        geoLongitude: pos.coords.longitude.toFixed(6),
      }));
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => router.push("/super-admin/schools"), 2000);
  }

  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">School Added!</h2>
          <p className="text-slate-500 dark:text-slate-400">{form.name} has been registered on the platform</p>
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
        <Link href="/super-admin/schools" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Add New School</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Register a school on the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">School Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <InputField label="School Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Sri Vidya High School" required error={errors.name} />
            </div>
            <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone" type="tel" required error={errors.phone} />
            <InputField label="Email Address" name="email" value={form.email} onChange={handleChange} placeholder="info@school.com" type="email" required error={errors.email} />
            <InputField label="Website" name="website" value={form.website} onChange={handleChange} placeholder="www.school.com" />
            <InputField label="Principal Name" name="principalName" value={form.principalName} onChange={handleChange} placeholder="Dr. Name" />
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address <span className="text-red-500">*</span></label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} placeholder="Street address..." className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all ${errors.address ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`} />
              {errors.address && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
            </div>
            <InputField label="City" name="city" value={form.city} onChange={handleChange} placeholder="City" />
            <InputField label="State" name="state" value={form.state} onChange={handleChange} placeholder="State" />
            <InputField label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" />
          </div>
        </div>

        {/* Geo Location */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Geo-Fence Settings</h3>
            </div>
            <button type="button" onClick={getCurrentLocation} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
              <Navigation className="w-3.5 h-3.5" /> Use My Location
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField label="Latitude" name="geoLatitude" value={form.geoLatitude} onChange={handleChange} placeholder="e.g. 14.6929" hint="From Google Maps" />
            <InputField label="Longitude" name="geoLongitude" value={form.geoLongitude} onChange={handleChange} placeholder="e.g. 79.1591" />
            <InputField label="Radius (meters)" name="geoRadius" value={form.geoRadius} onChange={handleChange} placeholder="200" type="number" hint="Recommended: 100-300m" />
          </div>
        </div>

        {/* Subscription */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Subscription Plan</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { value: "BASIC", label: "Basic", price: "₹4,999/yr" },
              { value: "STANDARD", label: "Standard", price: "₹9,999/yr" },
              { value: "PREMIUM", label: "Premium", price: "₹14,999/yr" },
              { value: "ENTERPRISE", label: "Enterprise", price: "Custom" },
            ].map((plan) => (
              <button key={plan.value} type="button" onClick={() => setForm((p) => ({ ...p, plan: plan.value }))} className={`flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 transition-all text-center ${form.plan === plan.value ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}>
                <span className={`text-sm font-bold ${form.plan === plan.value ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>{plan.label}</span>
                <span className="text-[11px] text-slate-400">{plan.price}</span>
              </button>
            ))}
          </div>
          <InputField label="Max Students" name="maxStudents" value={form.maxStudents} onChange={handleChange} type="number" placeholder="e.g. 1000" hint="Maximum students allowed on this plan" />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link href="/super-admin/schools" className="flex-1 flex items-center justify-center py-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</Link>
          <button type="submit" disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95">
            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding School...</> : <><Save className="w-4 h-4" /> Add School</>}
          </button>
        </div>
      </form>
    </div>
  );
}