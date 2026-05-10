// components/notifications/NotificationBell.js

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Bell, X, CheckCheck, Clock, IndianRupee,
  FileText, Megaphone, AlertTriangle, BarChart3,
  Info, ChevronRight, Loader2,
} from "lucide-react";

// ── Mock notifications ───────────────────────────────────────────
const MOCK_NOTIFICATIONS = [
  { id: 1, type: "FEE_REMINDER", title: "Fee Overdue Alert", message: "12 students have overdue fees this month. Send reminders now.", time: "5 min ago", read: false, urgent: true },
  { id: 2, type: "ATTENDANCE", title: "Attendance Marked", message: "Class 10-A attendance marked by Suresh Kumar. 28/30 present.", time: "1 hr ago", read: false, urgent: false },
  { id: 3, type: "GENERAL", title: "New Admission Inquiry", message: "Priya Sharma inquiry received for Class 8 admission.", time: "2 hrs ago", read: false, urgent: false },
  { id: 4, type: "EXAM_ALERT", title: "Exam Scheduled", message: "Unit Test 1 scheduled for Class 9 & 10 next Monday.", time: "Yesterday", read: true, urgent: false },
  { id: 5, type: "HOLIDAY", title: "Holiday Notice Sent", message: "Holiday notice sent to 1,250 parents successfully.", time: "Yesterday", read: true, urgent: false },
  { id: 6, type: "EMERGENCY", title: "System Maintenance", message: "Scheduled maintenance tonight 11 PM - 1 AM IST.", time: "2 days ago", read: true, urgent: false },
];

const typeConfig = {
  FEE_REMINDER: { emoji: "💰", bg: "bg-amber-100 dark:bg-amber-500/10", color: "text-amber-600 dark:text-amber-400", icon: IndianRupee },
  ATTENDANCE: { emoji: "📊", bg: "bg-blue-100 dark:bg-blue-500/10", color: "text-blue-600 dark:text-blue-400", icon: BarChart3 },
  GENERAL: { emoji: "📌", bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-600 dark:text-slate-400", icon: Info },
  EXAM_ALERT: { emoji: "📝", bg: "bg-purple-100 dark:bg-purple-500/10", color: "text-purple-600 dark:text-purple-400", icon: FileText },
  HOLIDAY: { emoji: "📢", bg: "bg-blue-100 dark:bg-blue-500/10", color: "text-blue-600 dark:text-blue-400", icon: Megaphone },
  EMERGENCY: { emoji: "🚨", bg: "bg-red-100 dark:bg-red-500/10", color: "text-red-600 dark:text-red-400", icon: AlertTriangle },
};

function useClickOutside(ref, handler) {
  useEffect(() => {
    function listener(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
}

export default function NotificationBell({ adminPath = "/admin" }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [markingAll, setMarkingAll] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, useCallback(() => setOpen(false), []));

  const unread = notifications.filter((n) => !n.read).length;

  function markOne(id) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  async function markAll() {
    setMarkingAll(true);
    await new Promise((r) => setTimeout(r, 600));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setMarkingAll(false);
  }

  function dismiss(id, e) {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div ref={ref} className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <Bell className={`w-5 h-5 ${unread > 0 ? "text-slate-700 dark:text-slate-300" : ""}`} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[390px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl shadow-black/10 dark:shadow-black/40 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
              {unread > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAll}
                disabled={markingAll}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                {markingAll ? (
                  <><Loader2 className="w-3 h-3 animate-spin" /> Marking...</>
                ) : (
                  <><CheckCheck className="w-3.5 h-3.5" /> Mark all read</>
                )}
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-600">
                <Bell className="w-12 h-12 mb-3 opacity-30" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-0.5">No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const cfg = typeConfig[notif.type] || typeConfig.GENERAL;
                const Icon = cfg.icon;
                return (
                  <div
                    key={notif.id}
                    onClick={() => markOne(notif.id)}
                    className={`group relative flex items-start gap-3 px-4 py-3.5 border-b border-slate-50 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      !notif.read ? "bg-blue-50/60 dark:bg-blue-950/20" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                      <Icon className={`w-4 h-4 ${cfg.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                            {notif.title}
                            {notif.urgent && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                                URGENT
                              </span>
                            )}
                          </p>
                          <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3 text-slate-300 dark:text-slate-600" />
                            <span className="text-[11px] text-slate-400 dark:text-slate-600">{notif.time}</span>
                          </div>
                        </div>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    </div>

                    {/* Dismiss */}
                    <button
                      onClick={(e) => dismiss(notif.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-all flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-4 py-3">
            <Link
              href={`${adminPath}/notifications`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-1.5 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all notifications
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}