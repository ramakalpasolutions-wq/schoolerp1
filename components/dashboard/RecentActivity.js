// components/dashboard/RecentActivity.js

"use client";

import Link from "next/link";
import { Clock, ArrowRight, Activity } from "lucide-react";

export default function RecentActivity({
  title = "Recent Activity",
  activities = [],
  viewAllHref,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="w-36 h-5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 rounded bg-slate-200 dark:bg-slate-800 w-3/4" />
                <div className="h-3 rounded bg-slate-100 dark:bg-slate-800/60 w-1/2" />
              </div>
              <div className="h-3 w-14 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Body */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600">
          <Activity className="w-10 h-10 mb-3 opacity-40" />
          <p className="text-sm font-medium">No recent activity</p>
        </div>
      ) : (
        <ul className="space-y-0.5">
          {activities.map((a, i) => {
            const Icon = a.icon;
            return (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                {/* Icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${a.iconBg || "bg-slate-100 dark:bg-slate-800"}`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${a.iconColor || "text-slate-500"}`}
                    />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-900 dark:text-white leading-snug">
                    {a.title}
                  </p>
                  {a.description && (
                    <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      {a.description}
                    </p>
                  )}
                </div>

                {/* Time */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-600 flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {a.time}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}