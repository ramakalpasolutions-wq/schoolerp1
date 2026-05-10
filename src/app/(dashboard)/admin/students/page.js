// src/app/(dashboard)/admin/students/page.js

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  Trash2,
  Download,
  FileText,
  Sheet,
  Loader2,
  X,
  CheckSquare,
  Square,
  MoreHorizontal,
  ArrowUpDown,
  Phone,
  IndianRupee,
  GraduationCap,
  AlertTriangle,
  RefreshCw,
  BookOpen,
  CalendarDays,
} from "lucide-react";

// ── Mock Data ────────────────────────────────────────────────────
const generateStudents = () => {
  const classes = ["6", "7", "8", "9", "10"];
  const sections = ["A", "B", "C"];
  const statuses = ["ACTIVE", "ACTIVE", "ACTIVE", "INACTIVE", "TRANSFERRED"];
  const feeStatuses = ["PAID", "PAID", "PENDING", "OVERDUE"];
  const names = [
    "Aarav Sharma", "Priya Reddy", "Karthik Kumar", "Sneha Patel",
    "Ravi Nair", "Ananya Singh", "Vikram Rao", "Divya Menon",
    "Suresh Babu", "Kavya Krishnan", "Arjun Gupta", "Meera Iyer",
    "Rohan Das", "Sonia Thomas", "Akash Joshi", "Pooja Verma",
    "Nikhil Choudhary", "Simran Kaur", "Rahul Mishra", "Deepika Pillai",
    "Varun Agarwal", "Nisha Saxena", "Aditya Bose", "Rani Chakraborty",
    "Shreyas Patil", "Tanvi Kulkarni", "Manish Dubey", "Preeti Tiwari",
    "Gaurav Yadav", "Anjali Pandey", "Sumit Srivastava", "Rekha Bhatt",
    "Harsha Reddy", "Lavanya Devi", "Rajesh Nair", "Sunita Pillai",
    "Dinesh Kumar", "Usha Bai", "Praveen Rao", "Saranya Krishnan",
    "Lokesh Goud", "Padmavathi R", "Srikanth Babu", "Bhavana Reddy",
    "Naresh Kumar", "Swapna Devi", "Ramakrishna P", "Chandana S",
    "Venkatesh N", "Sarada Devi",
  ];

  return names.map((name, i) => {
    const classNo = classes[i % classes.length];
    const section = sections[i % sections.length];
    return {
      id: `STU${2024}${String(i + 1).padStart(4, "0")}`,
      admissionNo: `ADM/2024/${String(i + 1).padStart(4, "0")}`,
      name,
      dob: `200${6 + (i % 4)}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
      gender: i % 3 === 0 ? "Female" : "Male",
      bloodGroup: ["A+", "B+", "O+", "AB+", "A-", "B-"][i % 6],
      class: classNo,
      section,
      rollNo: (i % 40) + 1,
      fatherName: `Father of ${name.split(" ")[0]}`,
      fatherPhone: `98765${String(43210 + i).slice(-5)}`,
      motherPhone: `91234${String(56789 + i).slice(-5)}`,
      status: statuses[i % statuses.length],
      feeStatus: feeStatuses[i % feeStatuses.length],
      photo: null,
      academicYear: "2024-2025",
      joinedDate: `2024-0${(i % 9) + 1}-15`,
    };
  });
};

const ALL_STUDENTS = generateStudents();

// ── Config ───────────────────────────────────────────────────────
const statusConfig = {
  ACTIVE: {
    label: "Active",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  INACTIVE: {
    label: "Inactive",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400",
  },
  TRANSFERRED: {
    label: "Transferred",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
};

const feeStatusConfig = {
  PAID: {
    label: "Paid",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
  },
  OVERDUE: {
    label: "Overdue",
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
  },
};

const CLASSES = ["All Classes", "6", "7", "8", "9", "10"];
const SECTIONS = ["All Sections", "A", "B", "C"];
const STATUSES = ["All Status", "ACTIVE", "INACTIVE", "TRANSFERRED"];
const ACADEMIC_YEARS = ["2024-2025", "2023-2024", "2022-2023"];
const ITEMS_PER_PAGE = 10;

// ── FilterDropdown ────────────────────────────────────────────────
function FilterDropdown({ label, value, options, onChange, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const isActive = !options.slice(0, 1).includes(value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
        }`}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span className="max-w-[100px] truncate">{value}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-200">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                  value === opt
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {opt === "ACTIVE"
                  ? "Active"
                  : opt === "INACTIVE"
                  ? "Inactive"
                  : opt === "TRANSFERRED"
                  ? "Transferred"
                  : opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────
function DeleteModal({ student, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">
          Delete Student
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900 dark:text-white">
            {student?.name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-lg shadow-red-500/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════
export default function StudentsPage() {
  const [students, setStudents] = useState(ALL_STUDENTS);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterSection, setFilterSection] = useState("All Sections");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterYear, setFilterYear] = useState("2024-2025");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // ── Filtered + Sorted ─────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...students];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.admissionNo.toLowerCase().includes(q) ||
          s.fatherPhone.includes(q)
      );
    }
    if (filterClass !== "All Classes")
      result = result.filter((s) => s.class === filterClass);
    if (filterSection !== "All Sections")
      result = result.filter((s) => s.section === filterSection);
    if (filterStatus !== "All Status")
      result = result.filter((s) => s.status === filterStatus);

    result.sort((a, b) => {
      const aVal = a[sortBy]?.toString().toLowerCase() || "";
      const bVal = b[sortBy]?.toString().toLowerCase() || "";
      return sortDir === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    return result;
  }, [students, search, filterClass, filterSection, filterStatus, sortBy, sortDir]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => setCurrentPage(1), [search, filterClass, filterSection, filterStatus]);

  // ── Stats ─────────────────────────────────────────────────────
  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "ACTIVE").length,
    inactive: students.filter((s) => s.status === "INACTIVE").length,
    newThisMonth: students.filter((s) => {
      const d = new Date(s.joinedDate);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  // ── Select ────────────────────────────────────────────────────
  const isAllSelected =
    paginated.length > 0 && paginated.every((s) => selectedIds.includes(s.id));

  function toggleAll() {
    if (isAllSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginated.find((s) => s.id === id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...paginated.map((s) => s.id)])]);
    }
  }

  function toggleOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  // ── Sort ──────────────────────────────────────────────────────
  function handleSort(col) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortBy(col); setSortDir("asc"); }
  }

  // ── Delete ────────────────────────────────────────────────────
  function handleDelete() {
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  const hasFilters =
    search ||
    filterClass !== "All Classes" ||
    filterSection !== "All Sections" ||
    filterStatus !== "All Status";

  function clearFilters() {
    setSearch("");
    setFilterClass("All Classes");
    setFilterSection("All Sections");
    setFilterStatus("All Status");
  }

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Students Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Academic Year: {filterYear} • {filtered.length} students found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link
              href="/admin/students/add"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              Add Student
            </Link>
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Students",
              value: stats.total,
              icon: Users,
              bg: "bg-blue-50 dark:bg-blue-500/10",
              color: "text-blue-600 dark:text-blue-400",
              border: "border-blue-100 dark:border-blue-500/20",
            },
            {
              label: "Active",
              value: stats.active,
              icon: UserCheck,
              bg: "bg-emerald-50 dark:bg-emerald-500/10",
              color: "text-emerald-600 dark:text-emerald-400",
              border: "border-emerald-100 dark:border-emerald-500/20",
            },
            {
              label: "Inactive",
              value: stats.inactive,
              icon: UserX,
              bg: "bg-red-50 dark:bg-red-500/10",
              color: "text-red-600 dark:text-red-400",
              border: "border-red-100 dark:border-red-500/20",
            },
            {
              label: "New This Month",
              value: stats.newThisMonth,
              icon: UserPlus,
              bg: "bg-purple-50 dark:bg-purple-500/10",
              color: "text-purple-600 dark:text-purple-400",
              border: "border-purple-100 dark:border-purple-500/20",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-4 p-4 rounded-2xl border ${stat.border} ${stat.bg}`}
            >
              <div className={`w-11 h-11 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {loading ? (
                    <span className="inline-block w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Filters ─────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex flex-col xl:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, admission number, phone..."
                className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <FilterDropdown
                label="Class"
                value={filterClass}
                options={CLASSES}
                onChange={setFilterClass}
                icon={BookOpen}
              />
              <FilterDropdown
                label="Section"
                value={filterSection}
                options={SECTIONS}
                onChange={setFilterSection}
              />
              <FilterDropdown
                label="Status"
                value={filterStatus}
                options={STATUSES}
                onChange={setFilterStatus}
                icon={Filter}
              />
              <FilterDropdown
                label="Year"
                value={filterYear}
                options={ACADEMIC_YEARS}
                onChange={setFilterYear}
                icon={CalendarDays}
              />
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Bulk Actions Bar ─────────────────────────────────── */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 animate-in slide-in-from-top-2 duration-200">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              {selectedIds.length} student{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <div className="flex flex-wrap gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                <GraduationCap className="w-3.5 h-3.5" />
                Change Class
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <FileText className="w-3.5 h-3.5" />
                Export PDF
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Sheet className="w-3.5 h-3.5" />
                Export Excel
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Selected
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60">
                  <th className="w-12 px-4 py-3.5 text-left">
                    <button
                      onClick={toggleAll}
                      className="text-slate-400 hover:text-blue-500 transition-colors"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
                      ) : (
                        <Square className="w-4.5 h-4.5" />
                      )}
                    </button>
                  </th>
                  {[
                    { key: "name", label: "Student" },
                    { key: "class", label: "Class" },
                    { key: "fatherPhone", label: "Parent Phone" },
                    { key: "feeStatus", label: "Fee Status" },
                    { key: "status", label: "Status" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.label}
                        <ArrowUpDown className="w-3.5 h-3.5" />
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3.5 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-4">
                          <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-2">
                              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                              <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                            </div>
                          </div>
                        </td>
                        {Array.from({ length: 4 }).map((_, j) => (
                          <td key={j} className="px-4 py-4">
                            <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          </td>
                        ))}
                        <td className="px-4 py-4">
                          <div className="w-20 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
                        </td>
                      </tr>
                    ))
                  : paginated.map((student) => {
                      const sc = statusConfig[student.status];
                      const fc = feeStatusConfig[student.feeStatus];
                      const isSelected = selectedIds.includes(student.id);

                      return (
                        <tr
                          key={student.id}
                          className={`group transition-colors ${
                            isSelected
                              ? "bg-blue-50/70 dark:bg-blue-950/20"
                              : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-4">
                            <button
                              onClick={() => toggleOne(student.id)}
                              className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
                              ) : (
                                <Square className="w-4.5 h-4.5" />
                              )}
                            </button>
                          </td>

                          {/* Photo + Name */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                <span className="text-white text-xs font-bold">
                                  {student.name
                                    .split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                                  {student.name}
                                </p>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {student.admissionNo}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Class */}
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                              {student.class}-{student.section}
                            </span>
                          </td>

                          {/* Phone */}
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 text-[13px] text-slate-600 dark:text-slate-400">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {student.fatherPhone}
                            </div>
                          </td>

                          {/* Fee Status */}
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${fc.bg} ${fc.text}`}>
                              {fc.label}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold ${sc.bg} ${sc.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                              {sc.label}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <Link
                                href={`/admin/students/${student.id}`}
                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                                title="View Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              <Link
                                href={`/admin/students/${student.id}?edit=true`}
                                className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => setDeleteTarget(student)}
                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>

            {/* Empty */}
            {!loading && paginated.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600">
                <Users className="w-14 h-14 mb-3 opacity-30" />
                <p className="text-base font-semibold">No students found</p>
                <p className="text-sm mt-1">Try adjusting your search or filters</p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="p-4 animate-pulse space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1 space-y-2">
                        <div className="w-36 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800/60 rounded" />
                      </div>
                    </div>
                  </div>
                ))
              : paginated.map((student) => {
                  const sc = statusConfig[student.status];
                  const fc = feeStatusConfig[student.feeStatus];
                  return (
                    <div key={student.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start gap-3 mb-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleOne(student.id)}
                          className="mt-1"
                        />
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white text-xs font-bold">
                            {student.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {student.name}
                          </p>
                          <p className="text-[11px] text-slate-400">{student.admissionNo}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            {sc.label}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold ${fc.bg} ${fc.text}`}>
                            {fc.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pl-11">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            Class {student.class}-{student.section}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />{student.fatherPhone}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Link href={`/admin/students/${student.id}`} className="p-1.5 rounded-lg text-blue-600 bg-blue-50 dark:bg-blue-500/10">
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <Link href={`/admin/students/${student.id}?edit=true`} className="p-1.5 rounded-lg text-amber-600 bg-amber-50 dark:bg-amber-500/10">
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => setDeleteTarget(student)} className="p-1.5 rounded-lg text-red-600 bg-red-50 dark:bg-red-500/10">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {filtered.length}
                </span>
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="text-slate-400">…</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}