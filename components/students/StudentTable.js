// components/students/StudentTable.js
"use client";

import Link from "next/link";
import {
  Eye, Pencil, Trash2, Phone,
  ChevronUp, ChevronDown, ChevronsUpDown,
} from "lucide-react";

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field)
    return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400" />;
  return sortDir === "asc"
    ? <ChevronUp   className="w-3.5 h-3.5 text-blue-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />;
}

const STATUS_STYLE = {
  ACTIVE:   "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  INACTIVE: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400",
  ALUMNI:   "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

export default function StudentTable({
  students   = [],
  sortField  = "name",
  sortDir    = "asc",
  onSort,
  onDelete,
  loading    = false,
  basePath   = "/admin/students",
}) {
  const COLS = [
    { key: "name",       label: "Student"    },
    { key: "admNo",      label: "Adm No"     },
    { key: "class",      label: "Class"      },
    { key: "parentPhone",label: "Parent Ph." },
    { key: "status",     label: "Status"     },
    { key: null,         label: "Actions"    },
  ];

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                {Array.from({ length: 6 }).map((__, j) => (
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
              {COLS.map((col) => (
                <th
                  key={col.label}
                  onClick={() => col.key && onSort?.(col.key)}
                  className={`px-4 py-3 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap ${col.key ? "cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none" : ""}`}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.key && (
                      <SortIcon
                        field={col.key}
                        sortField={sortField}
                        sortDir={sortDir}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  {/* Student */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white text-[11px] font-bold">
                          {s.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-900 dark:text-white truncate">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {s.email || s.dob || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Adm No */}
                  <td className="px-4 py-3.5 text-sm font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {s.admNo || "—"}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                      {s.className || s.class || "—"}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-4 py-3.5">
                    {s.parentPhone ? (
                      <a
                        href={`tel:${s.parentPhone}`}
                        className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {s.parentPhone}
                      </a>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold ${STATUS_STYLE[s.status] || STATUS_STYLE.ACTIVE}`}>
                      {s.status || "ACTIVE"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`${basePath}/${s.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`${basePath}/${s.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete?.(s.id, s.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
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