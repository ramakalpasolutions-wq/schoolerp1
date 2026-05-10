// components/crm/LeadCard.js
"use client";

import { Phone, Mail, Calendar, ArrowRight, MoreVertical, User } from "lucide-react";

const STATUS_CONFIG = {
  NEW:        { label: "New",        style: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400" },
  CONTACTED:  { label: "Contacted",  style: "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400" },
  INTERESTED: { label: "Interested", style: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  ADMITTED:   { label: "Admitted",   style: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  DROPPED:    { label: "Dropped",    style: "bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400" },
};

export default function LeadCard({ lead, onView, onUpdateStatus, onCall }) {
  const sc = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md dark:hover:shadow-slate-900/50 transition-all duration-200 hover:-translate-y-0.5">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-[12px] font-bold">
              {lead.studentName?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
              {lead.studentName}
            </p>
            <p className="text-[11px] text-slate-400">
              Class {lead.applyingFor || "—"}
            </p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg ${sc.style}`}>
          {sc.label}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 mb-4">
        {lead.parentName && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{lead.parentName}</span>
          </div>
        )}
        {lead.phone && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{lead.phone}</span>
          </div>
        )}
        {lead.email && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
        {lead.enquiryDate && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{lead.enquiryDate}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {lead.phone && (
          <button
            onClick={() => onCall?.(lead)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"
          >
            <Phone className="w-3 h-3" /> Call
          </button>
        )}
        <button
          onClick={() => onView?.(lead)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
        >
          View <ArrowRight className="w-3 h-3" />
        </button>

        {/* Status updater */}
        {onUpdateStatus && (
          <select
            value={lead.status}
            onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
            className="ml-auto text-[11px] font-semibold px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
          >
            {Object.keys(STATUS_CONFIG).map((s) => (
              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}