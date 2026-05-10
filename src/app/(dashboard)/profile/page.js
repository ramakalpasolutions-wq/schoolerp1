// src/app/(dashboard)/profile/page.js

"use client";

import { useState, useEffect } from "react";
import {
  User, Mail, Phone, Lock, Camera, Save, Loader2,
  CheckCircle2, Eye, EyeOff, Shield, Bell, LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

function InputField({ label, name, value, onChange, type = "text", placeholder, error, readOnly }) {
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={isPass ? (showPass ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${readOnly ? "opacity-60 cursor-not-allowed" : ""} ${error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}
        />
        {isPass && (
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passErrors, setPassErrors] = useState({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setForm({ name: parsed.name || "", email: parsed.email || "", phone: parsed.phone || "" });
      }
    } catch {}
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handlePassChange(e) {
    const { name, value } = e.target;
    setPassForm((p) => ({ ...p, [name]: value }));
    if (passErrors[name]) setPassErrors((p) => ({ ...p, [name]: "" }));
  }

  async function handleSaveProfile() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    if (user) {
      const updated = { ...user, name: form.name, phone: form.phone };
      localStorage.setItem("user", JSON.stringify(updated));
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function validatePassword() {
    const errs = {};
    if (!passForm.currentPassword) errs.currentPassword = "Current password required";
    if (!passForm.newPassword) errs.newPassword = "New password required";
    else if (passForm.newPassword.length < 6) errs.newPassword = "Min 6 characters";
    if (!passForm.confirmPassword) errs.confirmPassword = "Confirm your password";
    else if (passForm.newPassword !== passForm.confirmPassword) errs.confirmPassword = "Passwords do not match";
    setPassErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleChangePassword() {
    if (!validatePassword()) return;
    setChangingPass(true);
    await new Promise((r) => setTimeout(r, 1500));
    setChangingPass(false);
    setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    alert("Password changed successfully!");
  }

  async function handleLogout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  const roleGradients = {
    SUPER_ADMIN: "from-purple-500 to-indigo-600",
    SCHOOL_ADMIN: "from-blue-500 to-indigo-600",
    TEACHER: "from-emerald-500 to-teal-600",
    STUDENT: "from-orange-500 to-amber-600",
    PARENT: "from-pink-500 to-rose-600",
    ACCOUNTANT: "from-violet-500 to-purple-600",
  };

  const roleLabels = {
    SUPER_ADMIN: "Super Admin", SCHOOL_ADMIN: "School Admin",
    TEACHER: "Teacher", STUDENT: "Student", PARENT: "Parent", ACCOUNTANT: "Accountant",
  };

  const gradient = roleGradients[user?.role] || "from-blue-500 to-indigo-600";
  const initials = user?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "U";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className={`h-24 bg-gradient-to-r ${gradient}`} />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative flex-shrink-0">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl`}>
                <span className="text-white text-2xl font-bold">{initials}</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center border-2 border-white dark:border-slate-900 hover:bg-blue-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || "User"}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gradient-to-r ${gradient} text-white`}>
                  {roleLabels[user?.role] || user?.role}
                </span>
                <span className="text-sm text-slate-400">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-500" /> Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <InputField label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
          <InputField label="Email Address" name="email" value={form.email} onChange={handleChange} type="email" readOnly hint="Email cannot be changed" />
          <InputField label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit phone" type="tel" />
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Role</label>
            <div className="px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm opacity-60 cursor-not-allowed">
              {roleLabels[user?.role] || user?.role || "—"}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-red-500" /> Change Password
        </h3>
        <div className="space-y-4 mb-5">
          <InputField label="Current Password" name="currentPassword" value={passForm.currentPassword} onChange={handlePassChange} type="password" placeholder="Your current password" error={passErrors.currentPassword} />
          <InputField label="New Password" name="newPassword" value={passForm.newPassword} onChange={handlePassChange} type="password" placeholder="Min 6 characters" error={passErrors.newPassword} />
          <InputField label="Confirm New Password" name="confirmPassword" value={passForm.confirmPassword} onChange={handlePassChange} type="password" placeholder="Repeat new password" error={passErrors.confirmPassword} />
        </div>
        <div className="flex justify-end">
          <button onClick={handleChangePassword} disabled={changingPass} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:from-red-700 hover:to-rose-700 disabled:opacity-60 transition-all active:scale-95">
            {changingPass ? <><Loader2 className="w-4 h-4 animate-spin" /> Changing...</> : <><Shield className="w-4 h-4" /> Change Password</>}
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border-2 border-red-200 dark:border-red-500/30 bg-red-50/30 dark:bg-red-950/10 p-6">
        <h3 className="text-base font-bold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Actions here cannot be undone easily.</p>
        <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all active:scale-95">
          <LogOut className="w-4 h-4" /> Sign Out of All Devices
        </button>
      </div>
    </div>
  );
}