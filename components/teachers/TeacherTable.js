// components/teachers/TeacherTable.js
"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, Phone, Mail } from "lucide-react";

const STATUS_STYLE = {
  ACTIVE:   "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  INACTIVE: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
};

export default function TeacherTable({
  teachers = [],
  onDelete,
  loading  = false,
  basePath = "/admin/teachers",
}) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                {Array.from({ length: 5 }).map((__, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60">
              {["Teacher", "Subject", "Phone", "Email", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  No teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">

                  {/* Teacher */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-[11px] font-bold">
                          {t.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">{t.name}</p>
                        <p className="text-[11px] text-slate-400">{t.empId || "—"}</p>
                      </div>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                      {t.subject || "—"}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3.5">
                    {t.phone ? (
                      <a href={`tel:${t.phone}`} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Phone className="w-3.5 h-3.5" />{t.phone}
                      </a>
                    ) : <span className="text-slate-400 text-sm">—</span>}
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3.5">
                    {t.email ? (
                      <a href={`mailto:${t.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[160px]">
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />{t.email}
                      </a>
                    ) : <span className="text-slate-400 text-sm">—</span>}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${STATUS_STYLE[t.status] || STATUS_STYLE.ACTIVE}`}>
                      {t.status || "ACTIVE"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Link href={`${basePath}/${t.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link href={`${basePath}/${t.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => onDelete?.(t.id, t.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}