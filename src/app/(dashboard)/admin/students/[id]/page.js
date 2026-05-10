// src/app/(dashboard)/admin/students/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Pencil,
  Printer,
  IdCard,
  MoveRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  User,
  Heart,
  Users,
  CheckSquare,
  IndianRupee,
  FileText,
  BookOpenCheck,
  FolderOpen,
  MoreHorizontal,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Star,
  ExternalLink,
  Loader2,
  Shield,
} from "lucide-react";

// ── Mock student data ────────────────────────────────────────────
const MOCK_STUDENT = {
  id: "STU20240001",
  admissionNo: "ADM/2024/0001",
  name: "Aarav Sharma",
  dob: "2009-05-14",
  gender: "Male",
  bloodGroup: "O+",
  religion: "Hindu",
  category: "General",
  photo: null,
  class: "10",
  section: "A",
  rollNo: 5,
  academicYear: "2024-2025",
  previousSchool: "Green Valley School",
  status: "ACTIVE",
  joinedDate: "2024-06-15",

  // Contact
  currentAddress: "H.No 14, Nehru Street, Rajyampet",
  city: "Rajyampet",
  state: "Andhra Pradesh",
  pincode: "516115",

  // Parents
  fatherName: "Rajesh Sharma",
  fatherPhone: "9876543210",
  fatherEmail: "rajesh.sharma@gmail.com",
  fatherOccupation: "Software Engineer",
  motherName: "Priya Sharma",
  motherPhone: "9876543211",
  motherEmail: "priya.sharma@gmail.com",
  motherOccupation: "Teacher",
  emergencyContactName: "Suresh Sharma",
  emergencyContactPhone: "9876543212",
  emergencyRelationship: "Uncle",

  // Stats
  attendancePresent: 142,
  attendanceTotal: 160,
  feeTotal: 42000,
  feePaid: 32000,

  // Attendance calendar (simplified)
  attendance: {
    "2025-03": {
      "2025-03-01": "P", "2025-03-02": "P", "2025-03-03": "A",
      "2025-03-04": "P", "2025-03-05": "P", "2025-03-06": "P",
      "2025-03-07": "P", "2025-03-08": "P", "2025-03-10": "P",
      "2025-03-11": "A", "2025-03-12": "P", "2025-03-13": "P",
      "2025-03-14": "P", "2025-03-15": "P", "2025-03-17": "P",
      "2025-03-18": "P", "2025-03-19": "P", "2025-03-20": "P",
      "2025-03-21": "P",
    },
  },

  // Fee history
  fees: [
    { id: 1, category: "Tuition Fee", amount: 8000, dueDate: "2024-07-01", paidDate: "2024-07-01", status: "PAID", receiptNo: "RCP001" },
    { id: 2, category: "Tuition Fee", amount: 8000, dueDate: "2024-10-01", paidDate: "2024-10-05", status: "PAID", receiptNo: "RCP002" },
    { id: 3, category: "Lab Fee", amount: 2500, dueDate: "2024-10-01", paidDate: "2024-10-05", status: "PAID", receiptNo: "RCP003" },
    { id: 4, category: "Tuition Fee", amount: 8000, dueDate: "2025-01-01", paidDate: null, status: "PENDING", receiptNo: null },
    { id: 5, category: "Transport Fee", amount: 5500, dueDate: "2025-01-01", paidDate: null, status: "OVERDUE", receiptNo: null },
    { id: 6, category: "Library Fee", amount: 1000, dueDate: "2025-03-01", paidDate: null, status: "PENDING", receiptNo: null },
  ],

  // Exam results
  results: [
    {
      exam: "Unit Test 1",
      month: "Aug 2024",
      subjects: [
        { name: "Mathematics", marks: 42, maxMarks: 50, grade: "A+" },
        { name: "Science", marks: 38, maxMarks: 50, grade: "A" },
        { name: "English", marks: 44, maxMarks: 50, grade: "A+" },
        { name: "Social Studies", marks: 36, maxMarks: 50, grade: "A" },
        { name: "Telugu", marks: 40, maxMarks: 50, grade: "A+" },
      ],
    },
    {
      exam: "Mid-Term",
      month: "Oct 2024",
      subjects: [
        { name: "Mathematics", marks: 78, maxMarks: 100, grade: "A" },
        { name: "Science", marks: 82, maxMarks: 100, grade: "A+" },
        { name: "English", marks: 85, maxMarks: 100, grade: "A+" },
        { name: "Social Studies", marks: 70, maxMarks: 100, grade: "B+" },
        { name: "Telugu", marks: 75, maxMarks: 100, grade: "A" },
      ],
    },
  ],

  // Documents
  documents: [
    { name: "Birth Certificate", uploaded: true, date: "2024-06-15" },
    { name: "Transfer Certificate", uploaded: true, date: "2024-06-15" },
    { name: "Previous Marksheet", uploaded: true, date: "2024-06-15" },
    { name: "Aadhaar Card", uploaded: false, date: null },
    { name: "Address Proof", uploaded: false, date: null },
  ],

  // Homework
  homework: [
    { subject: "Mathematics", title: "Quadratic Equations", dueDate: "2025-03-15", status: "SUBMITTED", submittedDate: "2025-03-14" },
    { subject: "Science", title: "Chemical Reactions Lab Report", dueDate: "2025-03-18", status: "LATE", submittedDate: "2025-03-19" },
    { subject: "English", title: "Essay on Climate Change", dueDate: "2025-03-20", status: "PENDING", submittedDate: null },
    { subject: "Social Studies", title: "Map Activity — India", dueDate: "2025-03-12", status: "SUBMITTED", submittedDate: "2025-03-12" },
    { subject: "Telugu", title: "Grammar Exercises", dueDate: "2025-03-22", status: "PENDING", submittedDate: null },
  ],
};

// ── Configs ──────────────────────────────────────────────────────
const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "attendance", label: "Attendance", icon: CheckSquare },
  { id: "fees", label: "Fee History", icon: IndianRupee },
  { id: "results", label: "Results", icon: FileText },
  { id: "documents", label: "Documents", icon: FolderOpen },
  { id: "homework", label: "Homework", icon: BookOpenCheck },
];

const feeStatusConfig = {
  PAID: { label: "Paid", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400" },
  PENDING: { label: "Pending", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400" },
  OVERDUE: { label: "Overdue", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400" },
};

const hwStatusConfig = {
  SUBMITTED: { label: "Submitted", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  LATE: { label: "Late", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", icon: Clock },
  PENDING: { label: "Pending", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", icon: XCircle },
};

const gradeColors = {
  "A+": "text-emerald-600 dark:text-emerald-400",
  "A": "text-blue-600 dark:text-blue-400",
  "B+": "text-indigo-600 dark:text-indigo-400",
  "B": "text-purple-600 dark:text-purple-400",
  "C": "text-amber-600 dark:text-amber-400",
  "D": "text-orange-600 dark:text-orange-400",
  "F": "text-red-600 dark:text-red-400",
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, iconColor = "text-blue-500", iconBg = "bg-blue-50 dark:bg-blue-500/10", children }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [attendanceMonth] = useState("2025-03");

  useEffect(() => {
    const t = setTimeout(() => {
      setStudent(MOCK_STUDENT);
      setLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400">Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <AlertCircle className="w-16 h-16 mb-3 opacity-30" />
        <p className="text-lg font-bold text-slate-900 dark:text-white">Student Not Found</p>
        <p className="text-sm mt-1">The student record could not be found.</p>
        <Link href="/admin/students" className="mt-4 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          Back to Students
        </Link>
      </div>
    );
  }

  const attendancePct = Math.round((student.attendancePresent / student.attendanceTotal) * 100);
  const feeBalance = student.feeTotal - student.feePaid;
  const monthData = student.attendance[attendanceMonth] || {};

  // Days in March
  const daysInMonth = 31;
  const firstDay = new Date("2025-03-01").getDay();

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/students"
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Student Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{student.admissionNo}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <IdCard className="w-4 h-4" />
            <span className="hidden sm:inline">ID Card</span>
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 text-sm font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
            <MoveRight className="w-4 h-4" />
            <span className="hidden sm:inline">Transfer</span>
          </button>
          <Link
            href={`/admin/students/${student.id}?edit=true`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue-500/15 hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* ── Profile Hero ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {student.photo ? (
                <img src={student.photo} alt={student.name} className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl">
                  <span className="text-white text-3xl font-bold">
                    {student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  Active
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Class {student.class}-{student.section} • Roll #{student.rollNo}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Joined: {new Date(student.joinedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3 flex-wrap">
              {[
                {
                  label: "Attendance",
                  value: `${attendancePct}%`,
                  color: attendancePct >= 80 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
                },
                {
                  label: "Fee Paid",
                  value: `₹${(student.feePaid / 1000).toFixed(0)}K`,
                  color: "text-blue-600 dark:text-blue-400",
                },
                {
                  label: "Balance",
                  value: `₹${(feeBalance / 1000).toFixed(0)}K`,
                  color: feeBalance > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400",
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────── */}
      <div className="flex overflow-x-auto gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ──────────────────────────────────────── */}

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <SectionCard title="Personal Information" icon={User} iconBg="bg-blue-50 dark:bg-blue-500/10" iconColor="text-blue-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <InfoRow icon={Calendar} label="Date of Birth" value={new Date(student.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} />
                <InfoRow icon={User} label="Gender" value={student.gender} />
                <InfoRow icon={Heart} label="Blood Group" value={student.bloodGroup} />
                <InfoRow icon={Shield} label="Category" value={student.category} />
                <InfoRow icon={Star} label="Religion" value={student.religion} />
                <InfoRow icon={GraduationCap} label="Academic Year" value={student.academicYear} />
              </div>
            </SectionCard>

            <SectionCard title="Parent Information" icon={Users} iconBg="bg-purple-50 dark:bg-purple-500/10" iconColor="text-purple-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                <div className="sm:col-span-2 mb-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Father</p>
                </div>
                <InfoRow icon={User} label="Name" value={student.fatherName} />
                <InfoRow icon={Phone} label="Phone" value={student.fatherPhone} />
                <InfoRow icon={Mail} label="Email" value={student.fatherEmail} />
                <InfoRow icon={User} label="Occupation" value={student.fatherOccupation} />
                <div className="sm:col-span-2 mb-1 mt-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mother</p>
                </div>
                <InfoRow icon={User} label="Name" value={student.motherName} />
                <InfoRow icon={Phone} label="Phone" value={student.motherPhone} />
                <InfoRow icon={Mail} label="Email" value={student.motherEmail} />
                <InfoRow icon={User} label="Occupation" value={student.motherOccupation} />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Address" icon={MapPin} iconBg="bg-emerald-50 dark:bg-emerald-500/10" iconColor="text-emerald-500">
              <InfoRow icon={MapPin} label="Current Address" value={student.currentAddress} />
              <InfoRow icon={MapPin} label="City" value={student.city} />
              <InfoRow icon={MapPin} label="State" value={student.state} />
              <InfoRow icon={MapPin} label="Pincode" value={student.pincode} />
            </SectionCard>

            <SectionCard title="Emergency Contact" icon={Phone} iconBg="bg-red-50 dark:bg-red-500/10" iconColor="text-red-500">
              <InfoRow icon={User} label="Name" value={student.emergencyContactName} />
              <InfoRow icon={Phone} label="Phone" value={student.emergencyContactPhone} />
              <InfoRow icon={Users} label="Relationship" value={student.emergencyRelationship} />
            </SectionCard>
          </div>
        </div>
      )}

      {/* ATTENDANCE TAB */}
      {activeTab === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Attendance Calendar — March 2025
              </h3>
              <span className={`text-sm font-bold ${attendancePct >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                {attendancePct}%
              </span>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-center text-[11px] font-bold text-slate-400">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `2025-03-${String(day).padStart(2, "0")}`;
                const isWeekend = (firstDay + i) % 7 === 0 || (firstDay + i) % 7 === 6;
                const status = monthData[dateStr];

                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                      isWeekend
                        ? "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600"
                        : status === "P"
                        ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : status === "A"
                        ? "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {[
                { label: "Present", bg: "bg-emerald-500" },
                { label: "Absent", bg: "bg-red-500" },
                { label: "Weekend", bg: "bg-slate-300 dark:bg-slate-600" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 rounded ${l.bg}`} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="space-y-4">
            {[
              { label: "Total Working Days", value: student.attendanceTotal, color: "text-slate-900 dark:text-white" },
              { label: "Days Present", value: student.attendancePresent, color: "text-emerald-600 dark:text-emerald-400" },
              { label: "Days Absent", value: student.attendanceTotal - student.attendancePresent, color: "text-red-600 dark:text-red-400" },
              { label: "Attendance %", value: `${attendancePct}%`, color: attendancePct >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
                <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}

            {attendancePct < 75 && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">
                  Attendance below 75%. Parent notification required.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FEE HISTORY TAB */}
      {activeTab === "fees" && (
        <div className="space-y-5">
          {/* Fee summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Fee", value: `₹${student.feeTotal.toLocaleString()}`, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800" },
              { label: "Paid Amount", value: `₹${student.feePaid.toLocaleString()}`, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
              { label: "Balance Due", value: `₹${feeBalance.toLocaleString()}`, color: feeBalance > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400", bg: feeBalance > 0 ? "bg-red-50 dark:bg-red-500/10" : "bg-emerald-50 dark:bg-emerald-500/10" },
            ].map((stat) => (
              <div key={stat.label} className={`flex items-center justify-between p-4 rounded-xl ${stat.bg} border border-slate-200 dark:border-slate-700`}>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</span>
                <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Fee table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    {["Category", "Amount", "Due Date", "Paid Date", "Status", "Receipt"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {student.fees.map((fee) => {
                    const sc = feeStatusConfig[fee.status];
                    return (
                      <tr key={fee.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 text-sm font-medium text-slate-900 dark:text-white">{fee.category}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white">₹{fee.amount.toLocaleString()}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{new Date(fee.dueDate).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{fee.paidDate ? new Date(fee.paidDate).toLocaleDateString("en-IN") : "—"}</td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          {fee.receiptNo ? (
                            <button className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                              <Download className="w-3.5 h-3.5" />{fee.receiptNo}
                            </button>
                          ) : <span className="text-slate-300 dark:text-slate-700">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RESULTS TAB */}
      {activeTab === "results" && (
        <div className="space-y-5">
          {student.results.map((exam) => {
            const total = exam.subjects.reduce((s, sub) => s + sub.marks, 0);
            const maxTotal = exam.subjects.reduce((s, sub) => s + sub.maxMarks, 0);
            const pct = Math.round((total / maxTotal) * 100);
            return (
              <div key={exam.exam} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{exam.exam}</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{exam.month}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{total}/{maxTotal}</p>
                    <p className={`text-sm font-semibold ${pct >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                      {pct}%
                    </p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        {["Subject", "Marks", "Max", "Grade", "%"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {exam.subjects.map((sub) => {
                        const sPct = Math.round((sub.marks / sub.maxMarks) * 100);
                        return (
                          <tr key={sub.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{sub.name}</td>
                            <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-white">{sub.marks}</td>
                            <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">{sub.maxMarks}</td>
                            <td className="px-4 py-3">
                              <span className={`text-sm font-bold ${gradeColors[sub.grade] || "text-slate-600"}`}>{sub.grade}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${sPct >= 80 ? "bg-emerald-500" : sPct >= 60 ? "bg-blue-500" : "bg-red-500"}`}
                                    style={{ width: `${sPct}%` }}
                                  />
                                </div>
                                <span className="text-xs text-slate-500">{sPct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DOCUMENTS TAB */}
      {activeTab === "documents" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Documents</h3>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
              <FileText className="w-4 h-4" />
              Upload Document
            </button>
          </div>
          <div className="space-y-3">
            {student.documents.map((doc) => (
              <div
                key={doc.name}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${
                  doc.uploaded
                    ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10"
                    : "border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {doc.uploaded ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{doc.name}</p>
                    {doc.uploaded ? (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        Uploaded on {new Date(doc.date).toLocaleDateString("en-IN")}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400">Not yet uploaded</p>
                    )}
                  </div>
                </div>
                {doc.uploaded ? (
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <FileText className="w-3.5 h-3.5" />
                    Upload
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOMEWORK TAB */}
      {activeTab === "homework" && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Homework Submissions</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {student.homework.map((hw, i) => {
              const sc = hwStatusConfig[hw.status];
              const Icon = sc.icon;
              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${sc.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4 h-4 ${sc.text}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{hw.title}</p>
                      <p className="text-[12px] text-slate-400 dark:text-slate-500">
                        {hw.subject} • Due: {new Date(hw.dueDate).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-12 sm:ml-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                      {sc.label}
                    </span>
                    {hw.submittedDate && (
                      <span className="text-[11px] text-slate-400">
                        Submitted: {new Date(hw.submittedDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}