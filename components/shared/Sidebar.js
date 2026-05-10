// components/shared/Sidebar.js

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Settings,
  Users,
  GraduationCap,
  BookOpen,
  CheckSquare,
  IndianRupee,
  FileText,
  BookOpenCheck,
  Calendar,
  Bell,
  TrendingUp,
  UserPlus,
  BarChart,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Receipt,
  ClipboardList,
  Wallet,
  UserCheck,
  X,
  Baby,
} from "lucide-react";

// ── Role → menu config ───────────────────────────────────────────
const menuConfig = {
  SUPER_ADMIN: [
    {
      label: "Dashboard",
      href: "/super-admin",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Schools", href: "/super-admin/schools", icon: Building2 },
    {
      label: "Subscriptions",
      href: "/super-admin/subscriptions",
      icon: CreditCard,
    },
    { label: "Analytics", href: "/super-admin/analytics", icon: BarChart3 },
    { label: "Settings", href: "/super-admin/settings", icon: Settings },
  ],

  SCHOOL_ADMIN: [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "Students", href: "/admin/students", icon: Users },
    { label: "Teachers", href: "/admin/teachers", icon: GraduationCap },
    { label: "Classes", href: "/admin/classes", icon: BookOpen },
    { label: "Attendance", href: "/admin/attendance", icon: CheckSquare },
    { label: "Fees", href: "/admin/fees", icon: IndianRupee },
    { label: "Exams", href: "/admin/exams", icon: FileText },
    { label: "Homework", href: "/admin/homework", icon: BookOpenCheck },
    { label: "Timetable", href: "/admin/timetable", icon: Calendar },
    { label: "Notifications", href: "/admin/notifications", icon: Bell },
    { label: "Promotions", href: "/admin/promotions", icon: TrendingUp },
    { label: "CRM / Admissions", href: "/admin/crm", icon: UserPlus },
    {
      label: "Academic Years",
      href: "/admin/academic-years",
      icon: CalendarDays,
    },
    { label: "Reports", href: "/admin/reports", icon: BarChart },
  ],

  TEACHER: [
    {
      label: "Dashboard",
      href: "/teacher",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "My Classes", href: "/teacher/my-classes", icon: BookOpen },
    {
      label: "Attendance",
      href: "/teacher/attendance",
      icon: UserCheck,
    },
    { label: "Homework", href: "/teacher/homework", icon: BookOpenCheck },
    { label: "Timetable", href: "/teacher/timetable", icon: Calendar },
  ],

  STUDENT: [
    {
      label: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Attendance",
      href: "/student/attendance",
      icon: CheckSquare,
    },
    { label: "Homework", href: "/student/homework", icon: BookOpenCheck },
    { label: "My Results", href: "/student/results", icon: FileText },
    { label: "Timetable", href: "/student/timetable", icon: Calendar },
  ],

  PARENT: [
    {
      label: "Dashboard",
      href: "/parent",
      icon: LayoutDashboard,
      exact: true,
    },
    { label: "My Child", href: "/parent/child", icon: Baby },
    { label: "Attendance", href: "/parent/attendance", icon: CheckSquare },
    { label: "Fee Status", href: "/parent/fees", icon: IndianRupee },
    { label: "Results", href: "/parent/results", icon: FileText },
  ],

  ACCOUNTANT: [
    {
      label: "Dashboard",
      href: "/accountant",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Fee Collection",
      href: "/accountant/fees/collect",
      icon: Receipt,
    },
    {
      label: "Pending Fees",
      href: "/accountant/fees",
      icon: ClipboardList,
    },
    { label: "Expenses", href: "/accountant/expenses", icon: Wallet },
    { label: "Salary", href: "/accountant/salary", icon: IndianRupee },
    { label: "Reports", href: "/accountant/reports", icon: BarChart3 },
  ],
};

// ── Role badge / color config ─────────────────────────────────────
const roleConfig = {
  SUPER_ADMIN: {
    label: "Super Admin",
    gradient: "from-purple-500 to-indigo-600",
    badge: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
    ring: "ring-purple-500/30",
  },
  SCHOOL_ADMIN: {
    label: "School Admin",
    gradient: "from-blue-500 to-indigo-600",
    badge: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
    ring: "ring-blue-500/30",
  },
  TEACHER: {
    label: "Teacher",
    gradient: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    ring: "ring-emerald-500/30",
  },
  STUDENT: {
    label: "Student",
    gradient: "from-orange-500 to-amber-600",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    ring: "ring-orange-500/30",
  },
  PARENT: {
    label: "Parent",
    gradient: "from-pink-500 to-rose-600",
    badge: "bg-pink-500/20 text-pink-300 border border-pink-500/30",
    ring: "ring-pink-500/30",
  },
  ACCOUNTANT: {
    label: "Accountant",
    gradient: "from-violet-500 to-purple-600",
    badge: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    ring: "ring-violet-500/30",
  },
};

// ── isActive helper ───────────────────────────────────────────────
function isActive(pathname, href, exact = false) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

// ── Single MenuItem ───────────────────────────────────────────────
function MenuItem({ item, collapsed, onNavigate }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href, item.exact);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={`
        group relative flex items-center gap-3 rounded-xl px-3 py-2.5
        transition-all duration-200 select-none
        ${collapsed ? "justify-center" : ""}
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        }
      `}
    >
      {/* Left active bar */}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-white/70" />
      )}

      <Icon
        className={`flex-shrink-0 transition-all duration-200 group-hover:scale-110
          ${collapsed ? "w-5 h-5" : "w-[18px] h-[18px]"}
        `}
      />

      {!collapsed && (
        <span className="text-[13.5px] font-medium leading-none truncate">
          {item.label}
        </span>
      )}

      {/* Tooltip when collapsed */}
      {collapsed && (
        <span
          className="
            pointer-events-none absolute left-full ml-3 z-[100]
            whitespace-nowrap rounded-lg bg-slate-800 px-3 py-2
            text-xs font-semibold text-white shadow-xl
            border border-slate-700
            opacity-0 invisible
            group-hover:opacity-100 group-hover:visible
            transition-all duration-200
          "
        >
          {item.label}
          {/* Arrow */}
          <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[5px] w-[10px] h-[10px] rotate-45 bg-slate-800 border-l border-b border-slate-700" />
        </span>
      )}
    </Link>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
export default function Sidebar({
  role = "SCHOOL_ADMIN",
  user = {},
  school = {},
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onMobileClose,
}) {
  const items = menuConfig[role] || menuConfig.SCHOOL_ADMIN;
  const rc = roleConfig[role] || roleConfig.SCHOOL_ADMIN;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <>
      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* ── Sidebar panel ──────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-slate-900 border-r border-slate-800/80
          transition-all duration-300 ease-in-out will-change-transform
          ${collapsed ? "w-[70px]" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* ────────────────────────────────────────────────────────
            HEADER — Logo
            ──────────────────────────────────────────────────────── */}
        <div
          className={`
            flex h-[64px] flex-shrink-0 items-center border-b border-slate-800/80
            ${collapsed ? "justify-center px-2" : "justify-between px-4"}
          `}
        >
          {/* Logo mark (always visible) */}
          <Link
            href={`/${role === "SUPER_ADMIN" ? "super-admin" : role.toLowerCase()}`}
            className="flex items-center gap-3 min-w-0"
          >
            <div
              className={`
                flex-shrink-0 w-9 h-9 bg-gradient-to-br ${rc.gradient}
                rounded-xl flex items-center justify-center shadow-lg
                transition-transform duration-200 hover:scale-105
              `}
            >
              <GraduationCap className="w-[18px] h-[18px] text-white" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-white leading-tight truncate max-w-[140px]">
                  {school?.name || "School ERP"}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                  Management Platform
                </p>
              </div>
            )}
          </Link>

          {/* Mobile close */}
          {!collapsed && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ────────────────────────────────────────────────────────
            NAVIGATION
            ──────────────────────────────────────────────────────── */}
        <nav
          className={`
            flex-1 overflow-y-auto overflow-x-hidden py-4
            ${collapsed ? "px-2" : "px-3"}
            space-y-0.5
            scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700
          `}
        >
          {/* Section label */}
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
              Menu
            </p>
          )}

          {items.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              onNavigate={onMobileClose}
            />
          ))}
        </nav>

        {/* ────────────────────────────────────────────────────────
            FOOTER — Collapse toggle + User card
            ──────────────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-slate-800/80">
          {/* Collapse button (desktop only) */}
          <div
            className={`hidden lg:flex py-2 ${collapsed ? "justify-center px-2" : "justify-end px-3"}`}
          >
            <button
              onClick={onToggleCollapse}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all duration-200 group"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              ) : (
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              )}
            </button>
          </div>

          {/* User profile card */}
          <div className={`pb-4 ${collapsed ? "px-2" : "px-3"}`}>
            {collapsed ? (
              /* Collapsed — avatar only */
              <div
                title={user?.name}
                className={`
                  w-10 h-10 mx-auto rounded-xl bg-gradient-to-br ${rc.gradient}
                  flex items-center justify-center shadow-lg cursor-default
                  ring-2 ${rc.ring}
                `}
              >
                <span className="text-white font-bold text-[13px]">
                  {initials}
                </span>
              </div>
            ) : (
              /* Expanded — full profile card */
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-700/50 px-3 py-3 hover:bg-slate-800 transition-colors">
                {/* Avatar */}
                <div
                  className={`
                    flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${rc.gradient}
                    flex items-center justify-center shadow-md ring-2 ${rc.ring}
                  `}
                >
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-[13px]">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white truncate leading-tight">
                    {user?.name || "User"}
                  </p>
                  <span
                    className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${rc.badge}`}
                  >
                    {rc.label}
                  </span>
                </div>

                {/* Settings icon */}
                <Settings className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}