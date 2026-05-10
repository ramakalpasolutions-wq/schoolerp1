// src/app/(dashboard)/parent/child/page.js
"use client";

import { useState } from "react";
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Hash,
  Users,
} from "lucide-react";

// ── Mock child data ───────────────────────────────────────────────
const CHILD = {
  name: "Aarav Sharma",
  admNo: "ADM/2024/0001",
  class: "10",
  section: "A",
  rollNo: "15",
  dob: "12 March 2010",
  gender: "Male",
  bloodGroup: "O+",
  phone: "9876543210",
  email: "aarav@school.edu",
  address: "123, MG Road, Rajyampet, AP - 516115",
  academicYear: "2024-25",
  avatar: "AS",
  classTeacher: "Mrs. Lakshmi Devi",
  house: "Blue House",
  admissionDate: "01 June 2020",
  subjects: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "English",
    "Telugu",
    "Hindi",
    "Social Studies",
  ],
};

// ── Info Row ─────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function ParentChildPage() {
  const [activeTab, setActiveTab] = useState("personal");

  const TABS = [
    { id: "personal",  label: "Personal Info" },
    { id: "academic",  label: "Academic Info" },
    { id: "subjects",  label: "Subjects" },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Users className="w-7 h-7 text-blue-500" />
          My Child
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Student profile and details
        </p>
      </div>

      {/* ── Profile Card ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
            <span className="text-2xl font-black text-white">
              {CHILD.avatar}
            </span>
          </div>

          {/* Basic Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {CHILD.name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: `Class ${CHILD.class}-${CHILD.section}`, color: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
                { label: `Roll No: ${CHILD.rollNo}`,              color: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
                { label: CHILD.academicYear,                       color: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
              ].map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${badge.color}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
              Adm No: <span className="font-semibold text-slate-700 dark:text-slate-300">{CHILD.admNo}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">

        {/* Personal Info */}
        {activeTab === "personal" && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Personal Information
            </h3>
            <InfoRow icon={Calendar}     label="Date of Birth"    value={CHILD.dob} />
            <InfoRow icon={User}         label="Gender"           value={CHILD.gender} />
            <InfoRow icon={Award}        label="Blood Group"      value={CHILD.bloodGroup} />
            <InfoRow icon={Phone}        label="Phone"            value={CHILD.phone} />
            <InfoRow icon={Mail}         label="Email"            value={CHILD.email} />
            <InfoRow icon={MapPin}       label="Address"          value={CHILD.address} />
          </div>
        )}

        {/* Academic Info */}
        {activeTab === "academic" && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              Academic Information
            </h3>
            <InfoRow icon={Hash}         label="Admission Number" value={CHILD.admNo} />
            <InfoRow icon={Calendar}     label="Admission Date"   value={CHILD.admissionDate} />
            <InfoRow icon={BookOpen}     label="Academic Year"    value={CHILD.academicYear} />
            <InfoRow icon={GraduationCap}label="Class & Section"  value={`Class ${CHILD.class} — Section ${CHILD.section}`} />
            <InfoRow icon={Hash}         label="Roll Number"      value={CHILD.rollNo} />
            <InfoRow icon={User}         label="Class Teacher"    value={CHILD.classTeacher} />
            <InfoRow icon={Award}        label="House"            value={CHILD.house} />
          </div>
        )}

        {/* Subjects */}
        {activeTab === "subjects" && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              Enrolled Subjects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHILD.subjects.map((subject, i) => (
                <div
                  key={subject}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-blue-600 dark:text-blue-400">
                      {i + 1}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {subject}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}