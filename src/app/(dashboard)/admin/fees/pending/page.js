// src/app/(dashboard)/admin/fees/pending/page.js

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  Search,
  Filter,
  CheckSquare,
  Square,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  X,
  ChevronDown,
  Eye,
  Loader2,
  CheckCircle2,
  XCircle,
  Users,
  IndianRupee,
  Phone,
  Calendar,
  RefreshCw,
  Bell,
  SlidersHorizontal,
} from "lucide-react";

// ── Mock pending data ────────────────────────────────────────────
const generatePendingStudents = () => {
  const names = [
    "Aarav Sharma", "Priya Reddy", "Karthik Kumar", "Sneha Patel", "Ravi Nair",
    "Ananya Singh", "Vikram Rao", "Divya Menon", "Suresh Babu", "Kavya Krishnan",
    "Arjun Gupta", "Meera Iyer", "Rohan Das", "Sonia Thomas", "Akash Joshi",
    "Pooja Verma", "Nikhil Choudhary", "Simran Kaur", "Rahul Mishra", "Deepika Pillai",
    "Varun Agarwal", "Nisha Saxena", "Aditya Bose", "Rani Chakraborty", "Shreyas Patil",
    "Tanvi Kulkarni", "Manish Dubey", "Preeti Tiwari", "Gaurav Yadav", "Anjali Pandey",
    "Lokesh Goud", "Padmavathi R", "Srikanth Babu", "Bhavana Reddy", "Naresh Kumar",
    "Swapna Devi", "Ramakrishna P", "Chandana S", "Venkatesh N", "Sarada Devi",
    "Kiran Babu", "Lavanya S", "Suresh Kumar", "Radha Krishna", "Rajesh Nair",
  ];

  const classes = ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B"];
  const feeTypes = ["Tuition", "Tuition + Transport", "Tuition + Lab", "Transport", "Tuition + Library"];

  return names.map((name, i) => {
    const overdueDays = [0, 5, 15, 32, 45, 65, 75, 90, 0, 20][i % 10];
    const amount = [3000, 5000, 8000, 12000, 14000, 6500, 9000, 4500, 7200, 15000][i % 10];
    const lastReminderDays = [null, 3, 7, 14, 1, null, 5, 10, null, 2][i % 10];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - overdueDays);

    return {
      id: `STU${String(i + 1).padStart(4, "0")}`,
      name,
      class: classes[i % classes.length],
      admissionNo: `ADM/2024/${String(i + 1).padStart(4, "0")}`,
      parentPhone: `98765${String(43210 + i).slice(-5)}`,
      parentName: `Parent of ${name.split(" ")[0]}`,
      pendingAmount: amount,
      dueDate: dueDate.toISOString().split("T")[0],
      overdueDays,
      lastReminder: lastReminderDays
        ? lastReminderDays === 1 ? "Yesterday" : `${lastReminderDays} days ago`
        : null,
      feeType: feeTypes[i % feeTypes.length],
      status: overdueDays > 0 ? "OVERDUE" : "PENDING",
    };
  });
};

const ALL_PENDING = generatePendingStudents();

const FILTER_OPTIONS = [
  { id: "all", label: "All Pending", icon: Users },
  { id: "overdue30", label: "Overdue 30+ Days", icon: AlertCircle },
  { id: "overdue60", label: "Overdue 60+ Days", icon: AlertCircle },
  { id: "high_amount", label: "Amount > ₹5,000", icon: IndianRupee },
];

const CLASS_OPTIONS = ["All Classes", "6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B"];

function formatCurrency(val) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val.toLocaleString("en-IN")}`;
}

// ── Sending Progress Modal ────────────────────────────────────────
function ReminderProgressModal({ total, sent, failed, onClose, status }) {
  const pct = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;
  const isDone = status === "done";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={isDone ? onClose : undefined} />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        {!isDone ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                <Send className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sending Reminders...</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{sent + failed} of {total} sent</p>
              </div>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-center text-sm font-semibold text-blue-600 dark:text-blue-400">{pct}% complete</p>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reminders Sent!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Batch delivery complete</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sent}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">✅ Delivered</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failed}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">❌ Failed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function PendingFeesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [showReminderPanel, setShowReminderPanel] = useState(false);
  const [sendState, setSendState] = useState("idle"); // idle | sending | done
  const [sendProgress, setSendProgress] = useState({ sent: 0, failed: 0 });
  const [classOpen, setClassOpen] = useState(false);

  // ── Filter ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = [...ALL_PENDING];
    if (activeFilter === "overdue30") data = data.filter((s) => s.overdueDays >= 30);
    if (activeFilter === "overdue60") data = data.filter((s) => s.overdueDays >= 60);
    if (activeFilter === "high_amount") data = data.filter((s) => s.pendingAmount >= 5000);
    if (filterClass !== "All Classes") data = data.filter((s) => s.class === filterClass);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((s) => s.name.toLowerCase().includes(q) || s.admissionNo.toLowerCase().includes(q) || s.parentPhone.includes(q));
    }
    return data;
  }, [activeFilter, filterClass, search]);

  const isAllSelected = filtered.length > 0 && filtered.every((s) => selectedIds.includes(s.id));
  const selectedStudents = ALL_PENDING.filter((s) => selectedIds.includes(s.id));
  const totalSelectedAmount = selectedStudents.reduce((sum, s) => sum + s.pendingAmount, 0);

  function toggleAll() {
    if (isAllSelected) setSelectedIds((p) => p.filter((id) => !filtered.find((s) => s.id === id)));
    else setSelectedIds((p) => [...new Set([...p, ...filtered.map((s) => s.id)])]);
  }

  function toggleOne(id) {
    setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  }

  // ── Send reminders ────────────────────────────────────────────
  async function handleSendReminder() {
    if (selectedIds.length === 0) return;
    setSendState("sending");
    setSendProgress({ sent: 0, failed: 0 });

    const total = selectedIds.length;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 80));
      if (Math.random() > 0.05) sent++;
      else failed++;
      setSendProgress({ sent, failed });
    }

    await new Promise((r) => setTimeout(r, 500));
    setSendState("done");
  }

  const closeModal = () => {
    setSendState("idle");
    setSendProgress({ sent: 0, failed: 0 });
    setShowReminderPanel(false);
    setSelectedIds([]);
  };

  // Sample message
  const sampleStudent = selectedStudents[0] || ALL_PENDING[0];
  const previewMessage = `Dear Parent, Your child ${sampleStudent?.name}'s fee of ₹${sampleStudent?.pendingAmount?.toLocaleString()} is pending. Due: ${sampleStudent?.dueDate}. Please pay at the school or visit our portal. - Sri Vidya High School`;

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Pending Fees
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {ALL_PENDING.length} students have pending fees
            </p>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setShowReminderPanel(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 hover:from-red-700 hover:to-rose-700 transition-all active:scale-95"
            >
              <Bell className="w-4 h-4" />
              Send Reminder to {selectedIds.length} students
            </button>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Pending", value: formatCurrency(ALL_PENDING.reduce((s, x) => s + x.pendingAmount, 0)), color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
            { label: "Overdue 30+", value: ALL_PENDING.filter((s) => s.overdueDays >= 30).length, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10" },
            { label: "Overdue 60+", value: ALL_PENDING.filter((s) => s.overdueDays >= 60).length, color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-500/20" },
            { label: "No Reminder", value: ALL_PENDING.filter((s) => !s.lastReminder).length, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center justify-between p-3.5 rounded-xl ${stat.bg} border border-slate-200 dark:border-slate-700`}>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  activeFilter === opt.id
                    ? "border-red-500 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Search + Class filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission number, phone..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>
          <div className="relative">
            <button
              onClick={() => setClassOpen(!classOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <Filter className="w-4 h-4" />
              {filterClass}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${classOpen ? "rotate-180" : ""}`} />
            </button>
            {classOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setClassOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {CLASS_OPTIONS.map((opt) => (
                    <button key={opt} onClick={() => { setFilterClass(opt); setClassOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterClass === opt ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Selection Bar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/30 animate-in slide-in-from-top-2">
            <div>
              <span className="text-sm font-bold text-red-700 dark:text-red-300">{selectedIds.length} students selected</span>
              <span className="text-sm text-red-600 dark:text-red-400 ml-2">• Total: {formatCurrency(totalSelectedAmount)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowReminderPanel(true)} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors">
                <Send className="w-3.5 h-3.5" /> Send Reminder
              </button>
              <button onClick={() => setSelectedIds([])} className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  <th className="w-12 px-4 py-3.5">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-blue-500 transition-colors">
                      {isAllSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  {["Student", "Class", "Parent Phone", "Pending Amount", "Due Date", "Overdue", "Last Reminder", "Action"].map((h) => (
                    <th key={h} className="px-3 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((student) => {
                  const isSelected = selectedIds.includes(student.id);
                  return (
                    <tr key={student.id} className={`group transition-colors ${isSelected ? "bg-red-50/60 dark:bg-red-950/15" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"}`}>
                      <td className="px-4 py-3.5">
                        <button onClick={() => toggleOne(student.id)} className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors">
                          {isSelected ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white text-[11px] font-bold">{student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-white whitespace-nowrap">{student.name}</p>
                            <p className="text-[11px] text-slate-400">{student.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">{student.class}</span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1.5 text-[13px] text-slate-600 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {student.parentPhone}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">
                          ₹{student.pendingAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1 text-[12px] text-slate-500 dark:text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(student.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        {student.overdueDays > 0 ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                            student.overdueDays >= 60 ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400" :
                            student.overdueDays >= 30 ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400" :
                            "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400"
                          }`}>
                            {student.overdueDays}d overdue
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        {student.lastReminder ? (
                          <span className="text-[11px] text-slate-400">{student.lastReminder}</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Never</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => { setSelectedIds([student.id]); setShowReminderPanel(true); }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            title="Send Reminder"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="View Details">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 text-slate-400">
                <CheckCircle2 className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-semibold">No pending fees found</p>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((student) => {
              const isSelected = selectedIds.includes(student.id);
              return (
                <div key={student.id} className={`p-4 ${isSelected ? "bg-red-50/60 dark:bg-red-950/15" : ""}`}>
                  <div className="flex items-start gap-3 mb-2">
                    <input type="checkbox" checked={isSelected} onChange={() => toggleOne(student.id)} className="mt-1" />
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[11px] font-bold">{student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{student.name}</p>
                      <p className="text-[11px] text-slate-400">Class {student.class} • {student.parentPhone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">₹{student.pendingAmount.toLocaleString()}</p>
                      {student.overdueDays > 0 && <p className="text-[10px] font-bold text-red-500">{student.overdueDays}d overdue</p>}
                    </div>
                  </div>
                  <div className="flex justify-end pl-12">
                    <button
                      onClick={() => { setSelectedIds([student.id]); setShowReminderPanel(true); }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                    >
                      <Send className="w-3 h-3" /> Remind
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Reminder Panel Drawer ─────────────────────────────── */}
      {showReminderPanel && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => sendState === "idle" && setShowReminderPanel(false)} />
          <div className="relative z-10 w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Send Fee Reminder</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedIds.length} student{selectedIds.length > 1 ? "s" : ""} selected • {formatCurrency(totalSelectedAmount)} total</p>
              </div>
              <button onClick={() => setShowReminderPanel(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Channel toggles */}
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Send Via</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "SMS", icon: Smartphone, enabled: smsEnabled, toggle: () => setSmsEnabled(!smsEnabled), color: "blue" },
                    { label: "WhatsApp", icon: MessageSquare, enabled: whatsappEnabled, toggle: () => setWhatsappEnabled(!whatsappEnabled), color: "emerald" },
                    { label: "Email", icon: Mail, enabled: emailEnabled, toggle: () => setEmailEnabled(!emailEnabled), color: "purple" },
                  ].map((ch) => {
                    const Icon = ch.icon;
                    const activeClasses = {
                      blue: "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
                      emerald: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                      purple: "border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300",
                    };
                    return (
                      <button
                        key={ch.label}
                        onClick={ch.toggle}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all ${
                          ch.enabled ? activeClasses[ch.color] : "border-slate-200 dark:border-slate-700 text-slate-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-bold">{ch.label}</span>
                        {ch.enabled && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message preview */}
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Message Preview</p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">Auto-personalized for each student</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {previewMessage}
                  </p>
                </div>
              </div>

              {/* Active channels summary */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs text-slate-400">Channels active:</p>
                {smsEnabled && <span className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold">SMS</span>}
                {whatsappEnabled && <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold">WhatsApp</span>}
                {emailEnabled && <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold">Email</span>}
                {!smsEnabled && !whatsappEnabled && !emailEnabled && <span className="text-xs text-red-500 font-semibold">No channels selected!</span>}
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendReminder}
                disabled={(!smsEnabled && !whatsappEnabled && !emailEnabled) || selectedIds.length === 0}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold text-base shadow-xl shadow-red-500/25 hover:from-red-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                <Send className="w-5 h-5" />
                Send Reminder to {selectedIds.length} Student{selectedIds.length > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress / Done Modal */}
      {(sendState === "sending" || sendState === "done") && (
        <ReminderProgressModal
          total={selectedIds.length}
          sent={sendProgress.sent}
          failed={sendProgress.failed}
          status={sendState}
          onClose={closeModal}
        />
      )}
    </>
  );
}