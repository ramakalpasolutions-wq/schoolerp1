// src/app/(dashboard)/super-admin/schools/page.js

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2, Plus, Search, X, Eye, Pencil, Power,
  ChevronLeft, ChevronRight, Filter, ChevronDown,
  CheckCircle2, XCircle, Crown, Shield, Star,
  Calendar, Users, GraduationCap, AlertTriangle,
  Loader2,
} from "lucide-react";

const SCHOOLS_DATA = [
  { id: "1", name: "Sri Vidya High School", location: "Rajyampet, AP", phone: "9876543210", email: "info@srividya.edu.in", logo: null, plan: "PREMIUM", students: 1248, teachers: 68, status: "ACTIVE", expiry: "2025-12-31", joinedDate: "2023-06-15", revenue: 14999 },
  { id: "2", name: "Sunrise Academy", location: "Guntur, AP", phone: "9876543211", email: "info@sunrise.edu.in", logo: null, plan: "STANDARD", students: 856, teachers: 42, status: "ACTIVE", expiry: "2025-08-20", revenue: 9999, joinedDate: "2023-09-01" },
  { id: "3", name: "Nalanda International School", location: "Hyderabad, TS", phone: "9876543212", email: "info@nalanda.edu.in", logo: null, plan: "PREMIUM", students: 2100, teachers: 95, status: "ACTIVE", expiry: "2025-11-15", revenue: 14999, joinedDate: "2022-04-10" },
  { id: "4", name: "Greenfield Public School", location: "Vijayawada, AP", phone: "9876543213", email: "info@greenfield.edu.in", logo: null, plan: "BASIC", students: 320, teachers: 18, status: "ACTIVE", expiry: "2025-04-10", revenue: 4999, joinedDate: "2024-01-20" },
  { id: "5", name: "Royal Grammar School", location: "Tirupati, AP", phone: "9876543214", email: "info@royal.edu.in", logo: null, plan: "STANDARD", students: 670, teachers: 35, status: "INACTIVE", expiry: "2025-02-28", revenue: 9999, joinedDate: "2023-07-05" },
  { id: "6", name: "DAV Model School", location: "Nellore, AP", phone: "9876543215", email: "info@dav.edu.in", logo: null, plan: "PREMIUM", students: 1580, teachers: 72, status: "ACTIVE", expiry: "2026-03-31", revenue: 14999, joinedDate: "2022-08-15" },
  { id: "7", name: "Little Flower School", location: "Kadapa, AP", phone: "9876543216", email: "info@littleflower.edu.in", logo: null, plan: "BASIC", students: 210, teachers: 12, status: "ACTIVE", expiry: "2025-06-30", revenue: 4999, joinedDate: "2024-06-01" },
  { id: "8", name: "Chaitanya Techno School", location: "Warangal, TS", phone: "9876543217", email: "info@chaitanya.edu.in", logo: null, plan: "PREMIUM", students: 1890, teachers: 88, status: "ACTIVE", expiry: "2025-10-31", revenue: 14999, joinedDate: "2022-06-20" },
];

const planConfig = {
  BASIC: { label: "Basic", bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-300", icon: Star },
  STANDARD: { label: "Standard", bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-300", icon: Shield },
  PREMIUM: { label: "Premium", bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-300", icon: Crown },
};

const statusConfig = {
  ACTIVE: { label: "Active", bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", dot: "bg-emerald-500" },
  INACTIVE: { label: "Inactive", bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", dot: "bg-red-500" },
};

function isExpiringSoon(dateStr) {
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return diff <= 30 && diff > 0;
}
function isExpired(dateStr) {
  return new Date(dateStr) < new Date();
}
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

const ITEMS_PER_PAGE = 6;

export default function SuperAdminSchoolsPage() {
  const [schools, setSchools] = useState(SCHOOLS_DATA);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [toggling, setToggling] = useState(null);
  const [planOpen, setPlanOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = useMemo(() => {
    let data = [...schools];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((s) => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
    }
    if (filterPlan !== "ALL") data = data.filter((s) => s.plan === filterPlan);
    if (filterStatus !== "ALL") data = data.filter((s) => s.status === filterStatus);
    return data;
  }, [schools, search, filterPlan, filterStatus]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  async function handleToggle(id) {
    setToggling(id);
    await new Promise((r) => setTimeout(r, 800));
    setSchools((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : s));
    setToggling(null);
  }

  const stats = {
    total: schools.length,
    active: schools.filter((s) => s.status === "ACTIVE").length,
    premium: schools.filter((s) => s.plan === "PREMIUM").length,
    expiringSoon: schools.filter((s) => isExpiringSoon(s.expiry)).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Schools</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filtered.length} schools registered on platform</p>
        </div>
        <Link href="/super-admin/schools/add" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Add School
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Schools", value: stats.total, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20" },
          { label: "Active", value: stats.active, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20" },
          { label: "Premium Plan", value: stats.premium, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20" },
          { label: "Expiring Soon", value: stats.expiringSoon, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20" },
        ].map((s) => (
          <div key={s.label} className={`flex items-center justify-between p-4 rounded-2xl border ${s.bg}`}>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search schools..." className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all" />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
        </div>
        <div className="flex gap-2">
          {/* Plan Filter */}
          <div className="relative">
            <button onClick={() => { setPlanOpen(!planOpen); setStatusOpen(false); }} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${filterPlan !== "ALL" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-300"}`}>
              <Crown className="w-4 h-4" />
              {filterPlan === "ALL" ? "Plan" : filterPlan}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${planOpen ? "rotate-180" : ""}`} />
            </button>
            {planOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPlanOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {["ALL", "BASIC", "STANDARD", "PREMIUM"].map((p) => (
                    <button key={p} onClick={() => { setFilterPlan(p); setPlanOpen(false); setCurrentPage(1); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterPlan === p ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      {p === "ALL" ? "All Plans" : p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button onClick={() => { setStatusOpen(!statusOpen); setPlanOpen(false); }} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${filterStatus !== "ALL" ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:border-slate-300"}`}>
              <Filter className="w-4 h-4" />
              {filterStatus === "ALL" ? "Status" : filterStatus}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {["ALL", "ACTIVE", "INACTIVE"].map((s) => (
                    <button key={s} onClick={() => { setFilterStatus(s); setStatusOpen(false); setCurrentPage(1); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterStatus === s ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                      {s === "ALL" ? "All Status" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {(filterPlan !== "ALL" || filterStatus !== "ALL" || search) && (
            <button onClick={() => { setFilterPlan("ALL"); setFilterStatus("ALL"); setSearch(""); }} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {paginated.map((school) => {
          const plan = planConfig[school.plan];
          const status = statusConfig[school.status];
          const PlanIcon = plan.icon;
          const expiringSoon = isExpiringSoon(school.expiry);
          const expired = isExpired(school.expiry);

          return (
            <div key={school.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300">
              {/* Top bar */}
              <div className={`h-1.5 w-full ${school.plan === "PREMIUM" ? "bg-gradient-to-r from-amber-400 to-yellow-500" : school.plan === "STANDARD" ? "bg-gradient-to-r from-blue-400 to-indigo-500" : "bg-gradient-to-r from-slate-300 to-slate-400"}`} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                      <span className="text-white font-bold text-base">{school.name.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{school.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{school.location}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold flex-shrink-0 ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { icon: Users, value: school.students.toLocaleString(), label: "Students" },
                    { icon: GraduationCap, value: school.teachers, label: "Teachers" },
                    { icon: Crown, value: `₹${(school.revenue / 1000).toFixed(0)}K`, label: "Revenue" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Plan + Expiry */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${plan.bg} ${plan.text}`}>
                    <PlanIcon className="w-3.5 h-3.5" />
                    {plan.label}
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400">Expiry</p>
                    <p className={`text-[12px] font-bold ${expired ? "text-red-600 dark:text-red-400" : expiringSoon ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}`}>
                      {formatDate(school.expiry)}
                      {expiringSoon && !expired && " ⚠️"}
                      {expired && " ❌"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/super-admin/schools/${school.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[12px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Link>
                  <Link href={`/super-admin/schools/${school.id}?edit=true`} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[12px] font-semibold hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                  <button onClick={() => handleToggle(school.id)} disabled={toggling === school.id} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold transition-colors disabled:opacity-60 ${school.status === "ACTIVE" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"}`}>
                    {toggling === school.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Power className="w-3.5 h-3.5" />}
                    {school.status === "ACTIVE" ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {paginated.length === 0 && (
        <div className="flex flex-col items-center py-16 text-slate-400 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Building2 className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-semibold">No schools found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 py-2">
          <p className="text-xs text-slate-400">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
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
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}