// src/app/(dashboard)/admin/teachers/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, Calendar, GraduationCap,
  BookOpen, CheckSquare, IndianRupee, Pencil, Loader2,
  Award, Users, BarChart3, Star, Clock,
} from "lucide-react";

const MOCK_TEACHER = {
  id: "TCH001", employeeId: "EMP001", name: "Suresh Kumar",
  email: "suresh@school.in", phone: "9876543210",
  qualification: "M.Sc Mathematics, B.Ed", designation: "Senior Teacher",
  joiningDate: "2020-06-15", salary: 35000, isActive: true,
  subjects: ["Mathematics", "Statistics"],
  classes: ["9-A", "9-B", "10-A", "10-B"],
  experience: 8,
  attendanceRecord: { present: 145, total: 160 },
  recentAttendance: [
    { date: "Mar 18", checkIn: "09:05", checkOut: "17:00", hours: "7h 55m", status: "PRESENT" },
    { date: "Mar 17", checkIn: "09:10", checkOut: "17:05", hours: "7h 55m", status: "PRESENT" },
    { date: "Mar 16", checkIn: null, checkOut: null, hours: null, status: "ABSENT" },
    { date: "Mar 15", checkIn: "09:00", checkOut: "16:55", hours: "7h 55m", status: "PRESENT" },
    { date: "Mar 14", checkIn: "10:15", checkOut: "17:00", hours: "6h 45m", status: "LATE" },
  ],
  salaryHistory: [
    { month: "March 2025", amount: 35000, paidDate: "Mar 31", status: "PENDING" },
    { month: "February 2025", amount: 35000, paidDate: "Feb 28", status: "PAID" },
    { month: "January 2025", amount: 35000, paidDate: "Jan 31", status: "PAID" },
  ],
};

const TABS = [
  { id: "overview", label: "Overview", icon: Users },
  { id: "attendance", label: "Attendance", icon: CheckSquare },
  { id: "salary", label: "Salary", icon: IndianRupee },
];

export default function TeacherProfilePage() {
  const params = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const t = setTimeout(() => { setTeacher(MOCK_TEACHER); setLoading(false); }, 500);
    return () => clearTimeout(t);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400">Loading teacher profile...</p>
        </div>
      </div>
    );
  }

  if (!teacher) return null;

  const attendancePct = Math.round((teacher.attendanceRecord.present / teacher.attendanceRecord.total) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/admin/teachers" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Teacher Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.employeeId}</p>
        </div>
        <Link href={`/admin/teachers/${teacher.id}?edit=true`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/15 hover:from-blue-700 hover:to-indigo-700 transition-all">
          <Pencil className="w-4 h-4" /> Edit
        </Link>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="h-20 bg-gradient-to-r from-emerald-600 to-teal-700" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl flex-shrink-0">
              <span className="text-white text-2xl font-bold">{teacher.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
            </div>
            <div className="flex-1 pb-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{teacher.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{teacher.designation} • {teacher.qualification}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: "Attendance", value: `${attendancePct}%`, color: attendancePct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400" },
                { label: "Experience", value: `${teacher.experience}yrs`, color: "text-blue-600 dark:text-blue-400" },
                { label: "Salary", value: `₹${(teacher.salary / 1000).toFixed(0)}K`, color: "text-purple-600 dark:text-purple-400" },
              ].map((s) => (
                <div key={s.label} className="text-center px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-[11px] text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              <Icon className="w-4 h-4" />{tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Contact & Details</h3>
            <div className="space-y-3">
              {[
                { icon: Phone, label: "Phone", value: teacher.phone },
                { icon: Mail, label: "Email", value: teacher.email },
                { icon: Calendar, label: "Joining Date", value: new Date(teacher.joiningDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                { icon: GraduationCap, label: "Qualification", value: teacher.qualification },
                { icon: Star, label: "Experience", value: `${teacher.experience} years` },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((s) => <span key={s} className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-sm font-semibold border border-blue-100 dark:border-blue-500/20">{s}</span>)}
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Assigned Classes</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.classes.map((c) => <span key={c} className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold">Class {c}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Present", value: teacher.attendanceRecord.present, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
              { label: "Absent", value: teacher.attendanceRecord.total - teacher.attendanceRecord.present, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
              { label: "Overall %", value: `${attendancePct}%`, color: attendancePct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400", bg: "bg-slate-50 dark:bg-slate-800" },
            ].map((s) => (
              <div key={s.label} className={`text-center p-4 rounded-2xl border border-slate-200 dark:border-slate-700 ${s.bg}`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Attendance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    {["Date", "Check-in", "Check-out", "Hours", "Status"].map((h) => <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {teacher.recentAttendance.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{row.date}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">{row.checkIn || "—"}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-600 dark:text-slate-400">{row.checkOut || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{row.hours || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${row.status === "PRESENT" ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : row.status === "LATE" ? "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" : "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400"}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Salary */}
      {activeTab === "salary" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Salary History</h3>
            <Link href="/accountant/salary" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Process Salary</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  {["Month", "Amount", "Paid Date", "Status"].map((h) => <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {teacher.salaryHistory.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 text-sm font-semibold text-slate-900 dark:text-white">{s.month}</td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white">₹{s.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{s.paidDate}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${s.status === "PAID" ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}