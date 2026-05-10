// components/fees/FeeTable.js
"use client";

import { CheckCircle2, XCircle, Clock, IndianRupee, Phone } from "lucide-react";

const STATUS_CONFIG = {
  PAID:    { label: "Paid",    style: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", icon: CheckCircle2 },
  PENDING: { label: "Pending", style: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400",   icon: Clock },
  OVERDUE: { label: "Overdue", style: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",           icon: XCircle },
};

export default function FeeTable({
  records  = [],
  loading  = false,
  onCollect,
  onRemind,
  showActions = true,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60">
              {["Student","Class","Amount","Due Date","Status", ...(showActions ? ["Actions"] : [])].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  No records found.
                </td>
              </tr>
            ) : (
              records.map((r) => {
                const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.PENDING;
                const StatusIcon = sc.icon;
                return (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">

                    {/* Student */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[11px] font-bold">
                            {r.studentName?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{r.studentName}</p>
                          {r.admNo && <p className="text-[11px] text-slate-400">{r.admNo}</p>}
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                        {r.className || "—"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-white">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {r.amount?.toLocaleString("en-IN")}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="px-4 py-3.5 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {r.dueDate || "—"}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${sc.style}`}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </td>

                    {/* Actions */}
                    {showActions && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {r.status !== "PAID" && (
                            <button onClick={() => onCollect?.(r)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors whitespace-nowrap">
                              <IndianRupee className="w-3 h-3" /> Collect
                            </button>
                          )}
                          {r.status !== "PAID" && r.phone && (
                            <button onClick={() => onRemind?.(r)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                              <Phone className="w-3 h-3" /> Remind
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}