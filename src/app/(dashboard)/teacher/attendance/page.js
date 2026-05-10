// src/app/(dashboard)/teacher/attendance/page.js

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  LogIn,
  LogOut,
  Calendar,
  MapPin,
  AlertTriangle,
  Loader2,
  Timer,
  TrendingUp,
  Activity,
  ChevronDown,
  Shield,
} from "lucide-react";
import GeoAttendance from "@/components/attendance/GeoAttendance";

// ── Mock history ─────────────────────────────────────────────────
const generateHistory = () => {
  const statuses = ["PRESENT", "PRESENT", "PRESENT", "ABSENT", "LATE", "PRESENT"];
  return Array.from({ length: 20 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (i + 1));
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const status = isWeekend ? "WEEKEND" : statuses[i % statuses.length];
    const checkIn = status === "PRESENT" ? "09:05" : status === "LATE" ? "10:15" : null;
    const checkOut = checkIn ? "17:00" : null;
    return {
      date: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }),
      dayFull: d.toLocaleDateString("en-IN", { weekday: "long" }),
      status,
      checkIn,
      checkOut,
      hours: checkIn && checkOut ? "7h 55m" : null,
    };
  });
};

const HISTORY = generateHistory();

const statusConfig = {
  PRESENT: {
    label: "Present",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  ABSENT: {
    label: "Absent",
    bg: "bg-red-50 dark:bg-red-500/10",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
  LATE: {
    label: "Late",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  WEEKEND: {
    label: "Weekend",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-400 dark:text-slate-500",
    dot: "bg-slate-300",
  },
};

// ── Live Clock ───────────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono tabular-nums">
      {time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
}

export default function TeacherAttendancePage() {
  const [locationResult, setLocationResult] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [workingHours, setWorkingHours] = useState(null);
  const [elapsedTime, setElapsedTime] = useState("0h 0m");
  const [showHistory, setShowHistory] = useState(true);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── Elapsed time counter ──────────────────────────────────────
  useEffect(() => {
    if (!checkInTime || checkOutTime) return;
    const interval = setInterval(() => {
      const diff = Date.now() - checkInTime.getTime();
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${hrs}h ${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [checkInTime, checkOutTime]);

  // ── Handle location result from GeoAttendance ─────────────────
  const handleLocationResult = useCallback((result) => {
    setLocationResult(result);
  }, []);

  // ── Check-in ─────────────────────────────────────────────────
  async function handleCheckIn() {
    if (!locationResult?.isWithin || locationResult?.isFakeGps) return;
    setIsCheckingIn(true);
    await new Promise((r) => setTimeout(r, 1500));
    const now = new Date();
    setCheckInTime(now);
    setAttendanceStatus("CHECKED_IN");
    setIsCheckingIn(false);
  }

  // ── Check-out ─────────────────────────────────────────────────
  async function handleCheckOut() {
    if (!checkInTime) return;
    setIsCheckingOut(true);
    await new Promise((r) => setTimeout(r, 1500));
    const now = new Date();
    setCheckOutTime(now);
    const diff = now - checkInTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    setWorkingHours(`${hrs}h ${mins}m`);
    setAttendanceStatus("CHECKED_OUT");
    setIsCheckingOut(false);
  }

  const canCheckIn =
    locationResult?.isWithin &&
    !locationResult?.isFakeGps &&
    !checkInTime;

  const todayStats = {
    present: HISTORY.filter((h) => h.status === "PRESENT").length,
    absent: HISTORY.filter((h) => h.status === "ABSENT").length,
    late: HISTORY.filter((h) => h.status === "LATE").length,
    total: HISTORY.filter((h) => h.status !== "WEEKEND").length,
  };
  const attendancePct = Math.round((todayStats.present / todayStats.total) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            My Attendance
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">{today}</p>
          </div>
        </div>

        {/* Live clock */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 text-white shadow-xl">
          <Clock className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-xl font-bold tracking-wider">
              <LiveClock />
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              IST (UTC+5:30)
            </p>
          </div>
        </div>
      </div>

      {/* ── Today's Check-in Status Card ─────────────────────── */}
      {checkInTime && (
        <div className={`relative overflow-hidden rounded-2xl border-2 p-5 animate-in slide-in-from-top-3 duration-500 ${
          attendanceStatus === "CHECKED_OUT"
            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
            : "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30"
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none">
            <CheckCircle2 className="w-full h-full" />
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              attendanceStatus === "CHECKED_OUT"
                ? "bg-emerald-100 dark:bg-emerald-500/20"
                : "bg-blue-100 dark:bg-blue-500/20"
            }`}>
              {attendanceStatus === "CHECKED_OUT" ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Activity className="w-7 h-7 text-blue-600 dark:text-blue-400 animate-pulse" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-lg font-bold ${
                attendanceStatus === "CHECKED_OUT"
                  ? "text-emerald-700 dark:text-emerald-300"
                  : "text-blue-700 dark:text-blue-300"
              }`}>
                {attendanceStatus === "CHECKED_OUT"
                  ? "✅ Day Complete — Checked Out"
                  : "🟢 Checked In — Work in Progress"}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Check-in:{" "}
                  <span className="font-bold text-slate-900 dark:text-white">
                    {checkInTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </span>
                {checkOutTime && (
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Check-out:{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      {checkOutTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </span>
                )}
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {attendanceStatus === "CHECKED_OUT" ? "Total Hours" : "Elapsed"}:{" "}
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {attendanceStatus === "CHECKED_OUT" ? workingHours : elapsedTime}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left — Geo + Actions */}
        <div className="lg:col-span-3 space-y-5">
          {/* GeoAttendance Component */}
          <GeoAttendance
            schoolLat={14.6929}
            schoolLon={79.1591}
            schoolRadius={200}
            onLocationResult={handleLocationResult}
            showMapPlaceholder={true}
          />

          {/* Check-in / Check-out Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CHECK IN */}
            <button
              onClick={handleCheckIn}
              disabled={!canCheckIn || isCheckingIn || !!checkInTime}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 font-bold text-base transition-all duration-300 active:scale-95 overflow-hidden ${
                !!checkInTime
                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : canCheckIn
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-500 text-white shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              {/* Shimmer on active */}
              {canCheckIn && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                !!checkInTime
                  ? "bg-slate-200 dark:bg-slate-700"
                  : canCheckIn
                    ? "bg-white/20"
                    : "bg-slate-200 dark:bg-slate-700"
              }`}>
                {isCheckingIn ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : !!checkInTime ? (
                  <CheckCircle2 className="w-7 h-7 text-slate-400" />
                ) : (
                  <LogIn className="w-7 h-7" />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-bold">
                  {isCheckingIn ? "Checking In..." : !!checkInTime ? "Already Checked In" : "Check In"}
                </p>
                {checkInTime && (
                  <p className="text-xs font-normal mt-0.5 opacity-70">
                    {checkInTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
                {!checkInTime && !canCheckIn && locationResult && (
                  <p className="text-[11px] font-normal mt-0.5 opacity-70">
                    {locationResult.isFakeGps
                      ? "Fake GPS detected"
                      : "Not within school range"}
                  </p>
                )}
              </div>
            </button>

            {/* CHECK OUT */}
            <button
              onClick={handleCheckOut}
              disabled={!checkInTime || !!checkOutTime || isCheckingOut}
              className={`relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 font-bold text-base transition-all duration-300 active:scale-95 ${
                !!checkOutTime
                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                  : checkInTime
                    ? "bg-gradient-to-br from-orange-500 to-red-500 border-orange-500 text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                !checkInTime || !!checkOutTime
                  ? "bg-slate-200 dark:bg-slate-700"
                  : "bg-white/20"
              }`}>
                {isCheckingOut ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : !!checkOutTime ? (
                  <CheckCircle2 className="w-7 h-7 text-slate-400" />
                ) : (
                  <LogOut className="w-7 h-7" />
                )}
              </div>
              <div className="text-center">
                <p className="text-base font-bold">
                  {isCheckingOut ? "Checking Out..." : !!checkOutTime ? "Checked Out" : "Check Out"}
                </p>
                {checkOutTime ? (
                  <p className="text-xs font-normal mt-0.5 opacity-70">
                    {checkOutTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                ) : checkInTime ? (
                  <p className="text-xs font-normal mt-0.5 opacity-70">
                    Elapsed: {elapsedTime}
                  </p>
                ) : (
                  <p className="text-[11px] font-normal mt-0.5 opacity-70">
                    Check in first
                  </p>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Right — Stats */}
        <div className="lg:col-span-2 space-y-4">
          {/* Monthly Summary */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Monthly Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: "Present", value: todayStats.present, color: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
                { label: "Absent", value: todayStats.absent, color: "text-red-600 dark:text-red-400", bar: "bg-red-500" },
                { label: "Late", value: todayStats.late, color: "text-amber-600 dark:text-amber-400", bar: "bg-amber-500" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</span>
                    <span className={`text-sm font-bold ${stat.color}`}>{stat.value} days</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stat.bar} transition-all duration-700`}
                      style={{ width: `${(stat.value / todayStats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{attendancePct}%</p>
              <p className="text-xs text-slate-400">Overall Attendance</p>
            </div>
          </div>

          {/* Quick info */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              Today&apos;s Record
            </h3>
            {[
              { label: "Check-in", value: checkInTime ? checkInTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Not yet", icon: LogIn },
              { label: "Check-out", value: checkOutTime ? checkOutTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "Not yet", icon: LogOut },
              { label: "Working Hours", value: workingHours || (checkInTime ? elapsedTime : "—"), icon: Timer },
              { label: "Status", value: attendanceStatus === "CHECKED_OUT" ? "Present ✅" : attendanceStatus === "CHECKED_IN" ? "In Progress 🟢" : "Not Marked", icon: Activity },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-2">
                  <item.icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">{item.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── History Table ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
        >
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Attendance History (Last 30 Days)
          </h3>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showHistory ? "rotate-180" : ""}`} />
        </button>

        {showHistory && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  {["Date", "Day", "Check-in", "Check-out", "Hours", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {HISTORY.map((row, i) => {
                  const sc = statusConfig[row.status];
                  return (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{row.dayFull}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300">{row.checkIn || "—"}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300">{row.checkOut || "—"}</td>
                      <td className="px-4 py-3 text-sm font-mono text-slate-700 dark:text-slate-300">{row.hours || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}