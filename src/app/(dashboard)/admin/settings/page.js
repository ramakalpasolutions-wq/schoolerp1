// src/app/(dashboard)/admin/settings/page.js (truncated for space — full implementation below)
"use client";

import { useState } from "react";
import {
  School, MapPin, MessageSquare, Mail, IndianRupee,
  Calendar, Bell, Save, Loader2, CheckCircle2, Plus,
  Trash2, Eye, EyeOff, AlertCircle, Navigation, Upload,
  ChevronRight, Settings, Key, Smartphone,
} from "lucide-react";

const TABS = [
  { id: "school", label: "School Profile", icon: School },
  { id: "geo", label: "Geo Attendance", icon: MapPin },
  { id: "sms", label: "SMS Settings", icon: Smartphone },
  { id: "email", label: "Email Settings", icon: Mail },
  { id: "fees", label: "Fee Categories", icon: IndianRupee },
  { id: "academic", label: "Academic Year", icon: Calendar },
  { id: "templates", label: "Notif. Templates", icon: Bell },
];

function InputField({ label, name, value, onChange, type = "text", placeholder, hint, required, error, readOnly }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (showPass ? "text" : "password") : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-3.5 py-3 rounded-xl border-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm transition-all ${readOnly ? "opacity-60 cursor-not-allowed" : ""} ${error ? "border-red-300 dark:border-red-700" : "border-slate-200 dark:border-slate-700 focus:border-blue-500"}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

function SaveButton({ loading, saved }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95"
    >
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
    </button>
  );
}

function SectionCard({ title, children, onSubmit, loading, saved }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">{title}</h3>
      <div className="space-y-4">{children}</div>
      <div className="mt-6 flex justify-end">
        <SaveButton loading={loading} saved={saved} />
      </div>
    </form>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("school");
  const [savingState, setSavingState] = useState({});
  const [savedState, setSavedState] = useState({});

  // School profile state
  const [school, setSchool] = useState({
    name: "Sri Vidya High School",
    address: "Main Road, Rajyampet, Andhra Pradesh",
    phone: "9876543210",
    email: "admin@srividya.edu.in",
    website: "www.srividya.edu.in",
    principal: "Dr. Venkateshwara Rao",
    logo: null,
  });

  // Geo state
  const [geo, setGeo] = useState({
    latitude: "14.6929",
    longitude: "79.1591",
    radius: "200",
  });

  // SMS state
  const [sms, setSms] = useState({
    provider: "fast2sms",
    apiKey: "",
    senderId: "SCHOOL",
    enabled: true,
  });

  // Email state
  const [email, setEmail] = useState({
    host: "smtp.gmail.com",
    port: "587",
    username: "",
    password: "",
    fromName: "Sri Vidya School",
    fromEmail: "noreply@srividya.edu.in",
    enabled: true,
  });

  // Fee categories
  const [feeCategories, setFeeCategories] = useState([
    { id: 1, name: "Tuition Fee", description: "Monthly tuition charges" },
    { id: 2, name: "Transport Fee", description: "Bus transportation" },
    { id: 3, name: "Lab Fee", description: "Science and computer lab" },
    { id: 4, name: "Library Fee", description: "Library access" },
    { id: 5, name: "Sports Fee", description: "Sports and PE activities" },
    { id: 6, name: "Exam Fee", description: "Examination charges" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  // Academic years
  const [academicYears, setAcademicYears] = useState([
    { id: 1, name: "2024-2025", startDate: "2024-06-01", endDate: "2025-04-30", isActive: true },
    { id: 2, name: "2023-2024", startDate: "2023-06-01", endDate: "2024-04-30", isActive: false },
  ]);
  const [newYear, setNewYear] = useState({ name: "", startDate: "", endDate: "" });

  // Templates
  const [templates, setTemplates] = useState([
    { id: 1, name: "Absent Alert", message: "Dear Parent, [STUDENT_NAME] is ABSENT today [DATE]. Contact school if needed. - [SCHOOL_NAME]", type: "ATTENDANCE" },
    { id: 2, name: "Fee Reminder", message: "Dear Parent, [STUDENT_NAME]'s fee of ₹[AMOUNT] is due on [DATE]. Please pay at school. - [SCHOOL_NAME]", type: "FEE_REMINDER" },
    { id: 3, name: "Exam Alert", message: "Dear Parents, exams begin from [DATE]. Please ensure preparation. - [SCHOOL_NAME]", type: "EXAM_ALERT" },
  ]);

  async function handleSave(section) {
    setSavingState((p) => ({ ...p, [section]: true }));
    setSavedState((p) => ({ ...p, [section]: false }));
    await new Promise((r) => setTimeout(r, 1200));
    setSavingState((p) => ({ ...p, [section]: false }));
    setSavedState((p) => ({ ...p, [section]: true }));
    setTimeout(() => setSavedState((p) => ({ ...p, [section]: false })), 3000);
  }

  function addCategory() {
    if (!newCategory.trim()) return;
    setFeeCategories((prev) => [...prev, { id: Date.now(), name: newCategory, description: "" }]);
    setNewCategory("");
  }

  function removeCategory(id) {
    setFeeCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function activateYear(id) {
    setAcademicYears((prev) => prev.map((y) => ({ ...y, isActive: y.id === id })));
  }

  function addYear() {
    if (!newYear.name || !newYear.startDate || !newYear.endDate) return;
    setAcademicYears((prev) => [...prev, { id: Date.now(), ...newYear, isActive: false }]);
    setNewYear({ name: "", startDate: "", endDate: "" });
  }

  function getCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setGeo({
        latitude: pos.coords.latitude.toFixed(6),
        longitude: pos.coords.longitude.toFixed(6),
        radius: geo.radius,
      });
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-blue-500" /> Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure your school ERP platform</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── SCHOOL PROFILE ─────────────────────────────────────── */}
      {activeTab === "school" && (
        <SectionCard title="School Profile" onSubmit={(e) => { e.preventDefault(); handleSave("school"); }} loading={savingState.school} saved={savedState.school}>
          <div className="flex items-center gap-5 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{school.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">School Logo</p>
              <button type="button" className="mt-2 flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Upload className="w-4 h-4" /> Upload Logo
              </button>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <InputField label="School Name" name="name" value={school.name} onChange={(e) => setSchool((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <InputField label="Phone" name="phone" value={school.phone} onChange={(e) => setSchool((p) => ({ ...p, phone: e.target.value }))} />
            <InputField label="Email" name="email" value={school.email} onChange={(e) => setSchool((p) => ({ ...p, email: e.target.value }))} type="email" />
            <InputField label="Website" name="website" value={school.website} onChange={(e) => setSchool((p) => ({ ...p, website: e.target.value }))} placeholder="www.yourschool.com" />
            <InputField label="Principal Name" name="principal" value={school.principal} onChange={(e) => setSchool((p) => ({ ...p, principal: e.target.value }))} />
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
              <textarea value={school.address} onChange={(e) => setSchool((p) => ({ ...p, address: e.target.value }))} rows={3} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-sm resize-none transition-all" />
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── GEO ATTENDANCE ─────────────────────────────────────── */}
      {activeTab === "geo" && (
        <SectionCard title="Geo-Fencing for Attendance" onSubmit={(e) => { e.preventDefault(); handleSave("geo"); }} loading={savingState.geo} saved={savedState.geo}>
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-4">
            <Navigation className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">How Geo-Attendance Works</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                Teachers must be within the school&apos;s geo-fence radius to mark their attendance. Set your school&apos;s precise coordinates and allowed radius below.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="School Latitude" name="latitude" value={geo.latitude} onChange={(e) => setGeo((p) => ({ ...p, latitude: e.target.value }))} placeholder="e.g. 14.6929" hint="Get from Google Maps" />
            <InputField label="School Longitude" name="longitude" value={geo.longitude} onChange={(e) => setGeo((p) => ({ ...p, longitude: e.target.value }))} placeholder="e.g. 79.1591" />
            <div>
              <InputField label="Geo-Fence Radius (meters)" name="radius" value={geo.radius} onChange={(e) => setGeo((p) => ({ ...p, radius: e.target.value }))} placeholder="e.g. 200" type="number" hint="Recommended: 100-300 meters" />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={getCurrentLocation} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors w-full justify-center">
                <Navigation className="w-4 h-4" /> Use My Current Location
              </button>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Current Configuration</p>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-slate-400 text-[11px]">Coordinates</p>
                <p className="font-mono font-semibold text-slate-900 dark:text-white text-[13px]">{geo.latitude}, {geo.longitude}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Radius</p>
                <p className="font-bold text-slate-900 dark:text-white text-[13px]">{geo.radius}m</p>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── SMS ─────────────────────────────────────────────────── */}
      {activeTab === "sms" && (
        <SectionCard title="SMS Settings" onSubmit={(e) => { e.preventDefault(); handleSave("sms"); }} loading={savingState.sms} saved={savedState.sms}>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">SMS Notifications</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Enable SMS for attendance, fees, and announcements</p>
            </div>
            <button type="button" onClick={() => setSms((p) => ({ ...p, enabled: !p.enabled }))} className={`relative w-12 h-6 rounded-full transition-all ${sms.enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${sms.enabled ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">SMS Provider</label>
              <select value={sms.provider} onChange={(e) => setSms((p) => ({ ...p, provider: e.target.value }))} className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none appearance-none transition-all">
                <option value="fast2sms">Fast2SMS</option>
                <option value="twilio">Twilio</option>
                <option value="msg91">MSG91</option>
                <option value="textlocal">TextLocal</option>
                <option value="aws_sns">AWS SNS</option>
              </select>
            </div>
            <InputField label="Sender ID" name="senderId" value={sms.senderId} onChange={(e) => setSms((p) => ({ ...p, senderId: e.target.value }))} placeholder="e.g. SCHOOL" hint="6-character sender ID" />
            <div className="sm:col-span-2">
              <InputField label="API Key" name="apiKey" value={sms.apiKey} onChange={(e) => setSms((p) => ({ ...p, apiKey: e.target.value }))} type="password" placeholder="Enter your SMS API key" hint="Keep this secret — never share it" />
            </div>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-2">
            <Key className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-400">API keys are encrypted before storage. Never share your API credentials.</p>
          </div>
        </SectionCard>
      )}

      {/* ── EMAIL ───────────────────────────────────────────────── */}
      {activeTab === "email" && (
        <SectionCard title="Email Settings (SMTP)" onSubmit={(e) => { e.preventDefault(); handleSave("email"); }} loading={savingState.email} saved={savedState.email}>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Send emails for reports, reminders, and notices</p>
            </div>
            <button type="button" onClick={() => setEmail((p) => ({ ...p, enabled: !p.enabled }))} className={`relative w-12 h-6 rounded-full transition-all ${email.enabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-600"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${email.enabled ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="SMTP Host" name="host" value={email.host} onChange={(e) => setEmail((p) => ({ ...p, host: e.target.value }))} placeholder="smtp.gmail.com" />
            <InputField label="SMTP Port" name="port" value={email.port} onChange={(e) => setEmail((p) => ({ ...p, port: e.target.value }))} placeholder="587" type="number" />
            <InputField label="Username / Email" name="username" value={email.username} onChange={(e) => setEmail((p) => ({ ...p, username: e.target.value }))} placeholder="your@gmail.com" type="email" />
            <InputField label="Password / App Password" name="password" value={email.password} onChange={(e) => setEmail((p) => ({ ...p, password: e.target.value }))} type="password" placeholder="App password" />
            <InputField label="From Name" name="fromName" value={email.fromName} onChange={(e) => setEmail((p) => ({ ...p, fromName: e.target.value }))} placeholder="School Name" />
            <InputField label="From Email" name="fromEmail" value={email.fromEmail} onChange={(e) => setEmail((p) => ({ ...p, fromEmail: e.target.value }))} placeholder="noreply@school.com" type="email" />
          </div>
        </SectionCard>
      )}

      {/* ── FEE CATEGORIES ─────────────────────────────────────── */}
      {activeTab === "fees" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">Fee Categories</h3>
            <div className="space-y-2.5">
              {feeCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{cat.name}</p>
                    {cat.description && <p className="text-[11px] text-slate-400">{cat.description}</p>}
                  </div>
                  <button onClick={() => removeCategory(cat.id)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name..." className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())} />
              <button type="button" onClick={addCategory} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ACADEMIC YEAR ───────────────────────────────────────── */}
      {activeTab === "academic" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">Academic Years</h3>
            <div className="space-y-3 mb-5">
              {academicYears.map((year) => (
                <div key={year.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 ${year.isActive ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10" : "border-slate-200 dark:border-slate-700"}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{year.name}</p>
                      {year.isActive && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">ACTIVE</span>}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(year.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} —{" "}
                      {new Date(year.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {!year.isActive && (
                    <button onClick={() => activateYear(year.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[12px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Activate
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Add New Academic Year</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <InputField label="Year Name" name="name" value={newYear.name} onChange={(e) => setNewYear((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. 2025-2026" />
                <InputField label="Start Date" name="startDate" value={newYear.startDate} onChange={(e) => setNewYear((p) => ({ ...p, startDate: e.target.value }))} type="date" />
                <InputField label="End Date" name="endDate" value={newYear.endDate} onChange={(e) => setNewYear((p) => ({ ...p, endDate: e.target.value }))} type="date" />
              </div>
              <button type="button" onClick={addYear} className="mt-3 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" /> Add Academic Year
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NOTIFICATION TEMPLATES ──────────────────────────────── */}
      {activeTab === "templates" && (
        <div className="space-y-4">
          {templates.map((tmpl, i) => (
            <div key={tmpl.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
                  {tmpl.type.replace("_", " ")}
                </span>
                <input
                  value={tmpl.name}
                  onChange={(e) => setTemplates((prev) => prev.map((t, ti) => ti === i ? { ...t, name: e.target.value } : t))}
                  className="flex-1 text-sm font-bold text-slate-900 dark:text-white bg-transparent outline-none border-b-2 border-transparent focus:border-blue-500 transition-all py-0.5"
                />
              </div>
              <textarea
                value={tmpl.message}
                onChange={(e) => setTemplates((prev) => prev.map((t, ti) => ti === i ? { ...t, message: e.target.value } : t))}
                rows={3}
                className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none text-sm resize-none transition-all font-mono"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["[STUDENT_NAME]", "[AMOUNT]", "[DATE]", "[SCHOOL_NAME]", "[PERCENTAGE]"].map((v) => (
                  <button key={v} type="button" className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 transition-colors">
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              onClick={() => handleSave("templates")}
              disabled={savingState.templates}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 transition-all active:scale-95"
            >
              {savingState.templates ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : savedState.templates ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Templates</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}