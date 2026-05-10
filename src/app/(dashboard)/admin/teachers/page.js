// src/app/(dashboard)/admin/teachers/page.js

"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap, UserPlus, Search, X, Eye, Pencil, Trash2,
  Phone, Mail, CheckSquare, Square, Filter, ChevronLeft,
  ChevronRight, Users, UserCheck, UserX, IndianRupee, AlertTriangle,
} from "lucide-react";

const generateTeachers = () => {
  const data = [
    { name: "Suresh Kumar", subject: "Mathematics", qual: "M.Sc, B.Ed", phone: "9876543210", email: "suresh@school.in", exp: 8, salary: 35000 },
    { name: "Radha Devi", subject: "Science", qual: "M.Sc Chemistry, B.Ed", phone: "9876543211", email: "radha@school.in", exp: 5, salary: 28000 },
    { name: "Priya Sharma", subject: "English", qual: "MA English, B.Ed", phone: "9876543212", email: "priya@school.in", exp: 6, salary: 30000 },
    { name: "Ravi Nair", subject: "Social Studies", qual: "MA History, B.Ed", phone: "9876543213", email: "ravi@school.in", exp: 4, salary: 26000 },
    { name: "Lakshmi Rao", subject: "Telugu", qual: "MA Telugu, B.Ed", phone: "9876543214", email: "lakshmi@school.in", exp: 10, salary: 38000 },
    { name: "Venkatesh N", subject: "Hindi", qual: "MA Hindi, B.Ed", phone: "9876543215", email: "venkat@school.in", exp: 7, salary: 32000 },
    { name: "Anitha R", subject: "Physics", qual: "M.Sc Physics, B.Ed", phone: "9876543216", email: "anitha@school.in", exp: 3, salary: 24000 },
    { name: "Kiran Babu", subject: "Computer Science", qual: "MCA, B.Ed", phone: "9876543217", email: "kiran@school.in", exp: 5, salary: 32000 },
    { name: "Padmaja K", subject: "Biology", qual: "M.Sc Botany, B.Ed", phone: "9876543218", email: "padmaja@school.in", exp: 9, salary: 36000 },
    { name: "Ramesh G", subject: "Physical Education", qual: "B.P.Ed, M.P.Ed", phone: "9876543219", email: "ramesh@school.in", exp: 6, salary: 28000 },
    { name: "Suma Rani", subject: "Mathematics", qual: "M.Sc Maths, B.Ed", phone: "9876543220", email: "suma@school.in", exp: 4, salary: 27000 },
    { name: "Gopal Das", subject: "Science", qual: "M.Sc Physics, B.Ed", phone: "9876543221", email: "gopal@school.in", exp: 2, salary: 22000 },
  ];
  return data.map((t, i) => ({
    id: `TCH${String(i + 1).padStart(3, "0")}`,
    employeeId: `EMP${String(i + 1).padStart(3, "0")}`,
    ...t,
    joiningDate: `202${i % 4}-0${(i % 9) + 1}-15`,
    isActive: i !== 4 && i !== 9,
    classes: [`${(i % 5) + 6}-A`, `${(i % 5) + 6}-B`],
  }));
};

const ALL_TEACHERS = generateTeachers();
const ITEMS_PER_PAGE = 10;

function DeleteModal({ teacher, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 text-center animate-in zoom-in-95 duration-300">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Remove Teacher</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Are you sure you want to deactivate <span className="font-semibold text-slate-900 dark:text-white">{teacher?.name}</span>?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg shadow-red-500/20">Remove</button>
        </div>
      </div>
    </div>
  );
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState(ALL_TEACHERS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const subjects = ["All", ...new Set(ALL_TEACHERS.map((t) => t.subject))];

  const filtered = useMemo(() => {
    let data = [...teachers];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((t) => t.name.toLowerCase().includes(q) || t.employeeId.toLowerCase().includes(q) || t.phone.includes(q));
    }
    if (filterSubject !== "All") data = data.filter((t) => t.subject === filterSubject);
    if (filterStatus !== "All") data = data.filter((t) => filterStatus === "Active" ? t.isActive : !t.isActive);
    return data;
  }, [teachers, search, filterSubject, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  useEffect(() => setCurrentPage(1), [search, filterSubject, filterStatus]);

  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.isActive).length,
    inactive: teachers.filter((t) => !t.isActive).length,
    totalSalary: teachers.filter((t) => t.isActive).reduce((s, t) => s + t.salary, 0),
  };

  const isAllSelected = paginated.length > 0 && paginated.every((t) => selectedIds.includes(t.id));
  function toggleAll() {
    if (isAllSelected) setSelectedIds((p) => p.filter((id) => !paginated.find((t) => t.id === id)));
    else setSelectedIds((p) => [...new Set([...p, ...paginated.map((t) => t.id)])]);
  }
  function toggleOne(id) {
    setSelectedIds((p) => p.includes(id) ? p.filter((i) => i !== id) : [...p, id]);
  }
  function handleDelete() {
    setTeachers((p) => p.map((t) => t.id === deleteTarget.id ? { ...t, isActive: false } : t));
    setDeleteTarget(null);
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Teachers Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filtered.length} teachers found</p>
          </div>
          <Link href="/admin/teachers/add" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
            <UserPlus className="w-4 h-4" /> Add Teacher
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Teachers", value: stats.total, icon: GraduationCap, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
            { label: "Active", value: stats.active, icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
            { label: "Inactive", value: stats.inactive, icon: UserX, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20" },
            { label: "Monthly Payroll", value: `₹${(stats.totalSalary / 1000).toFixed(0)}K`, icon: IndianRupee, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20" },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.bg}`}>
              <div className="w-11 h-11 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${s.color}`}>{loading ? "—" : s.value}</p>
                <p className="text-xs text-slate-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, employee ID, phone..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex gap-2">
            <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 transition-all appearance-none">
              {subjects.map((s) => <option key={s} value={s}>{s === "All" ? "All Subjects" : s}</option>)}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm outline-none focus:border-blue-500 transition-all appearance-none">
              {["All", "Active", "Inactive"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Selection bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 animate-in slide-in-from-top-2">
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{selectedIds.length} selected</span>
            <button onClick={() => setSelectedIds([])} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-500/10 transition-colors"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  <th className="w-12 px-4 py-3.5">
                    <button onClick={toggleAll} className="text-slate-400 hover:text-blue-500 transition-colors">
                      {isAllSelected ? <CheckSquare className="w-4.5 h-4.5 text-blue-600" /> : <Square className="w-4.5 h-4.5" />}
                    </button>
                  </th>
                  {["Teacher", "Employee ID", "Subject", "Contact", "Classes", "Salary", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" /></td>
                    ))}
                  </tr>
                )) : paginated.map((teacher) => {
                  const isSelected = selectedIds.includes(teacher.id);
                  return (
                    <tr key={teacher.id} className={`group transition-colors ${isSelected ? "bg-blue-50/60 dark:bg-blue-950/15" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"}`}>
                      <td className="px-4 py-4">
                        <button onClick={() => toggleOne(teacher.id)} className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors">
                          {isSelected ? <CheckSquare className="w-4.5 h-4.5 text-blue-600" /> : <Square className="w-4.5 h-4.5" />}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            <span className="text-white text-xs font-bold">{teacher.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-slate-900 dark:text-white whitespace-nowrap">{teacher.name}</p>
                            <p className="text-[11px] text-slate-400">{teacher.qual}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[13px] text-slate-600 dark:text-slate-400 font-mono">{teacher.employeeId}</td>
                      <td className="px-4 py-4">
                        <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">{teacher.subject}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-500 dark:text-slate-400">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />{teacher.phone}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.classes.map((c) => <span key={c} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">{c}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[13px] font-bold text-slate-900 dark:text-white">₹{teacher.salary.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${teacher.isActive ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${teacher.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          {teacher.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/teachers/${teacher.id}`} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="View"><Eye className="w-4 h-4" /></Link>
                          <Link href={`/admin/teachers/${teacher.id}?edit=true`} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit"><Pencil className="w-4 h-4" /></Link>
                          <button onClick={() => setDeleteTarget(teacher)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Remove"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!loading && paginated.length === 0 && (
              <div className="flex flex-col items-center py-16 text-slate-400">
                <GraduationCap className="w-12 h-12 mb-3 opacity-30" />
                <p className="font-semibold">No teachers found</p>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {paginated.map((t) => (
              <div key={t.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.employeeId} • {t.subject}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isActive ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                    {t.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-12">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" />{t.phone}</span>
                  <div className="flex gap-1">
                    <Link href={`/admin/teachers/${t.id}`} className="p-1.5 rounded-lg text-blue-600 bg-blue-50 dark:bg-blue-500/10"><Eye className="w-3.5 h-3.5" /></Link>
                    <Link href={`/admin/teachers/${t.id}?edit=true`} className="p-1.5 rounded-lg text-amber-600 bg-amber-50 dark:bg-amber-500/10"><Pencil className="w-3.5 h-3.5" /></Link>
                    <button onClick={() => setDeleteTarget(t)} className="p-1.5 rounded-lg text-red-600 bg-red-50 dark:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button key={page} onClick={() => setCurrentPage(page)} className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? "bg-blue-600 text-white" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{page}</button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) return <span key={page} className="text-slate-400">…</span>;
                  return null;
                })}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      {deleteTarget && <DeleteModal teacher={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </>
  );
}