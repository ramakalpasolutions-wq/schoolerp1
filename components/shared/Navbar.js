// components/shared/Navbar.js

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Settings,
  X,
  AlertCircle,
  Info,
  CheckCircle2,
  GraduationCap,
  Clock,
} from "lucide-react";

// ── Notification type config ─────────────────────────────────────
const notifConfig = {
  alert: {
    icon: AlertCircle,
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-500/10",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
  },
  success: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
  },
};

const sampleNotifications = [
  {
    id: 1,
    type: "alert",
    title: "Fee Overdue",
    message: "12 students have overdue fees this month",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "Attendance Marked",
    message: "Class 10-A marked by Suresh Kumar",
    time: "1 hr ago",
    read: false,
  },
  {
    id: 3,
    type: "success",
    title: "New Admission",
    message: "Priya Sharma confirmed for Class 8",
    time: "2 hrs ago",
    read: true,
  },
  {
    id: 4,
    type: "warning",
    title: "Exam Next Week",
    message: "Unit Test 1 — Classes 9 & 10 on Monday",
    time: "Yesterday",
    read: true,
  },
];

// ── Role meta ────────────────────────────────────────────────────
const roleMeta = {
  SUPER_ADMIN: { label: "Super Admin", gradient: "from-purple-500 to-indigo-600" },
  SCHOOL_ADMIN: { label: "School Admin", gradient: "from-blue-500 to-indigo-600" },
  TEACHER: { label: "Teacher", gradient: "from-emerald-500 to-teal-600" },
  STUDENT: { label: "Student", gradient: "from-orange-500 to-amber-600" },
  PARENT: { label: "Parent", gradient: "from-pink-500 to-rose-600" },
  ACCOUNTANT: { label: "Accountant", gradient: "from-violet-500 to-purple-600" },
};

// ── useClickOutside ──────────────────────────────────────────────
function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export default function Navbar({
  onMobileMenuOpen,
  user = {},
  role = "SCHOOL_ADMIN",
  school = {},
}) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifs, setNotifs] = useState(sampleNotifications);

  const notifRef = useRef(null);
  const userRef = useRef(null);
  const searchRef = useRef(null);

  const closeNotif = useCallback(() => setNotifOpen(false), []);
  const closeUser = useCallback(() => setUserOpen(false), []);

  useClickOutside(notifRef, closeNotif);
  useClickOutside(userRef, closeUser);

  const unread = notifs.filter((n) => !n.read).length;
  const rm = roleMeta[role] || roleMeta.SCHOOL_ADMIN;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  // ── Dark mode bootstrap ─────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : sysDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  function toggleDark() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // ── Mark read ────────────────────────────────────────────────
  function markAllRead() {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
  }

  function markOneRead(id) {
    setNotifs((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  // ── Logout ───────────────────────────────────────────────────
  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  // ── Toggle helpers that close each other ────────────────────
  function toggleNotif() {
    setNotifOpen((p) => !p);
    setUserOpen(false);
  }
  function toggleUser() {
    setUserOpen((p) => !p);
    setNotifOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex h-full items-center justify-between gap-4 px-4">
          {/* ── LEFT ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* School badge (sm+) */}
            <div className="hidden sm:flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-lg bg-gradient-to-br ${rm.gradient} flex items-center justify-center flex-shrink-0`}
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[180px] truncate">
                {school?.name || "School ERP"}
              </span>
            </div>
          </div>

          {/* ── CENTER — Desktop search ──────────────────────── */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students, fees, teachers…"
                className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all duration-200"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Mobile search toggle */}
            <button
              onClick={() => setSearchOpen((p) => !p)}
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              title={isDark ? "Light mode" : "Dark mode"}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group"
            >
              {isDark ? (
                <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* ── Notifications ─────────────────────────────── */}
            <div ref={notifRef} className="relative">
              <button
                onClick={toggleNotif}
                className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </button>

              {/* Notification panel */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        Notifications
                      </span>
                      {unread > 0 && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                          {unread} new
                        </span>
                      )}
                    </div>
                    {unread > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* List */}
                  <div className="max-h-[320px] overflow-y-auto">
                    {notifs.map((n) => {
                      const cfg = notifConfig[n.type] || notifConfig.info;
                      const Icon = cfg.icon;
                      return (
                        <button
                          key={n.id}
                          onClick={() => markOneRead(n.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3.5 text-left border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !n.read ? "bg-blue-50/60 dark:bg-blue-950/20" : ""
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 ${cfg.bg}`}
                          >
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2">
                              <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight flex-1">
                                {n.title}
                              </p>
                              {!n.read && (
                                <span className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="mt-0.5 text-[12px] text-slate-500 dark:text-slate-400 line-clamp-2">
                              {n.message}
                            </p>
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-600">
                              <Clock className="w-3 h-3" />
                              {n.time}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5">
                    <Link
                      href="/admin/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── User menu ─────────────────────────────────── */}
            <div ref={userRef} className="relative">
              <button
                onClick={toggleUser}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl bg-gradient-to-br ${rm.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                >
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-white text-[12px] font-bold">
                      {initials}
                    </span>
                  )}
                </div>
                {/* Name / role (sm+) */}
                <div className="hidden sm:block text-left">
                  <p className="text-[13px] font-semibold text-slate-800 dark:text-white leading-tight max-w-[100px] truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                    {rm.label}
                  </p>
                </div>
                <ChevronDown
                  className={`hidden sm:block w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    userOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User dropdown */}
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                  {/* Info header */}
                  <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rm.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
                      >
                        <span className="text-white font-bold text-sm">
                          {initials}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                          {user?.email || rm.label}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="py-1.5 px-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                      <User className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                      <Settings className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="px-1.5 pb-1.5 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
                    >
                      <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile search drawer ──────────────────────────────────── */}
      {searchOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-lg animate-in slide-in-from-top-1 duration-200">
          <div className="relative" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search students, fees, teachers…"
              className="w-full pl-9 pr-10 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}