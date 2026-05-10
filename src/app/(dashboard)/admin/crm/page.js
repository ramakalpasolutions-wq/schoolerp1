// src/app/(dashboard)/admin/crm/page.js

"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Plus, Search, Users, TrendingUp, CheckCircle2, Phone,
  Calendar, ArrowRight, MoreHorizontal, Filter, Download,
  ChevronRight, Clock, Star, Globe, Facebook, MapPin,
  MessageSquare, UserPlus, Sparkles, BarChart3, X, Eye,
  Loader2,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, FunnelChart, Funnel, LabelList,
} from "recharts";

// ── Mock CRM Data ────────────────────────────────────────────────
const LEADS_DATA = [
  { id: "L001", parentName: "Ramesh Reddy", parentPhone: "9876543210", parentEmail: "ramesh@gmail.com", childName: "Arjun Reddy", childAge: 8, classInterested: "3", source: "GOOGLE", stage: "NEW_LEAD", assignedTo: "Priya", followUpDate: "2025-03-20", notes: "Interested in science lab", createdAt: "2025-03-15", priority: "HIGH" },
  { id: "L002", parentName: "Suma Nair", parentPhone: "9876543211", childName: "Kavya Nair", childAge: 12, classInterested: "7", source: "WALKIN", stage: "NEW_LEAD", assignedTo: "Ravi", followUpDate: "2025-03-22", notes: "Walked in, very interested", createdAt: "2025-03-16", priority: "HIGH" },
  { id: "L003", parentName: "Vikram Singh", parentPhone: "9876543212", childName: "Ananya Singh", childAge: 10, classInterested: "5", source: "FACEBOOK", stage: "NEW_LEAD", assignedTo: "Priya", followUpDate: "2025-03-21", notes: "", createdAt: "2025-03-17", priority: "MEDIUM" },
  { id: "L004", parentName: "Lakshmi Devi", parentPhone: "9876543213", childName: "Karthik L", childAge: 14, classInterested: "9", source: "REFERENCE", stage: "NEW_LEAD", assignedTo: "Ravi", followUpDate: "2025-03-23", notes: "Reference from Class 8 parent", createdAt: "2025-03-18", priority: "MEDIUM" },
  { id: "L005", parentName: "Suresh Kumar", parentPhone: "9876543214", childName: "Divya Kumar", childAge: 6, classInterested: "1", source: "GOOGLE", stage: "INTERESTED", assignedTo: "Priya", followUpDate: "2025-03-21", notes: "Called twice, very keen", createdAt: "2025-03-10", priority: "HIGH" },
  { id: "L006", parentName: "Padma Venkat", parentPhone: "9876543215", childName: "Rahul Venkat", childAge: 9, classInterested: "4", source: "INSTAGRAM", stage: "INTERESTED", assignedTo: "Ravi", followUpDate: "2025-03-20", notes: "Fee concession discussed", createdAt: "2025-03-11", priority: "MEDIUM" },
  { id: "L007", parentName: "Naresh Babu", parentPhone: "9876543216", childName: "Sneha Babu", childAge: 11, classInterested: "6", source: "WALKIN", stage: "INTERESTED", assignedTo: "Priya", followUpDate: "2025-03-19", notes: "Transport facility asked", createdAt: "2025-03-12", priority: "HIGH" },
  { id: "L008", parentName: "Rani Sharma", parentPhone: "9876543217", childName: "Rohan Sharma", childAge: 13, classInterested: "8", source: "REFERENCE", stage: "COUNSELING", assignedTo: "Ravi", followUpDate: "2025-03-22", notes: "Visit scheduled on March 22", createdAt: "2025-03-08", visitDate: "2025-03-22", priority: "HIGH" },
  { id: "L009", parentName: "Gopal Rao", parentPhone: "9876543218", childName: "Priya Rao", childAge: 7, classInterested: "2", source: "GOOGLE", stage: "COUNSELING", assignedTo: "Priya", followUpDate: "2025-03-20", notes: "Counseling done, positive", createdAt: "2025-03-09", visitDate: "2025-03-18", priority: "HIGH" },
  { id: "L010", parentName: "Meena Krishnan", parentPhone: "9876543219", childName: "Arun Krishnan", childAge: 15, classInterested: "10", source: "FACEBOOK", stage: "COUNSELING", assignedTo: "Ravi", followUpDate: "2025-03-25", notes: "Documents pending", createdAt: "2025-03-07", priority: "MEDIUM" },
  { id: "L011", parentName: "Ravi Prasad", parentPhone: "9876543220", childName: "Sita Prasad", childAge: 6, classInterested: "1", source: "WALKIN", stage: "CONFIRMED", assignedTo: "Priya", followUpDate: null, notes: "Admission confirmed, fee paid", createdAt: "2025-03-05", convertedAt: "2025-03-17", priority: "HIGH" },
  { id: "L012", parentName: "Anjali Mishra", parentPhone: "9876543221", childName: "Dev Mishra", childAge: 10, classInterested: "5", source: "REFERENCE", stage: "CONFIRMED", assignedTo: "Ravi", followUpDate: null, notes: "Admitted to Class 5-A", createdAt: "2025-03-06", convertedAt: "2025-03-16", priority: "HIGH" },
];

// ── Stage Config ─────────────────────────────────────────────────
const STAGES = {
  NEW_LEAD: { label: "New Lead", color: "blue", header: "bg-blue-600", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-500/20" },
  INTERESTED: { label: "Interested", color: "amber", header: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-500/20" },
  COUNSELING: { label: "Counseling", color: "orange", header: "bg-orange-600", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-500/20" },
  CONFIRMED: { label: "Confirmed", color: "emerald", header: "bg-emerald-600", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-500/20" },
};

const STAGE_ORDER = ["NEW_LEAD", "INTERESTED", "COUNSELING", "CONFIRMED"];

const SOURCE_CONFIG = {
  GOOGLE: { label: "Google", emoji: "🔍", bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300" },
  FACEBOOK: { label: "Facebook", emoji: "📘", bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  WALKIN: { label: "Walk-in", emoji: "🚶", bg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  REFERENCE: { label: "Reference", emoji: "🤝", bg: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300" },
  INSTAGRAM: { label: "Instagram", emoji: "📷", bg: "bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300" },
  OTHER: { label: "Other", emoji: "📌", bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" },
};

function daysSince(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ── Lead Card ─────────────────────────────────────────────────────
function LeadCard({ lead, onMoveNext, onView }) {
  const src = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.OTHER;
  const currentIdx = STAGE_ORDER.indexOf(lead.stage);
  const nextStage = STAGE_ORDER[currentIdx + 1];
  const nextStageCfg = nextStage ? STAGES[nextStage] : null;
  const days = daysSince(lead.createdAt);
  const [moving, setMoving] = useState(false);

  async function handleMove(e) {
    e.stopPropagation();
    if (!nextStage) return;
    setMoving(true);
    await new Promise((r) => setTimeout(r, 600));
    setMoving(false);
    onMoveNext(lead.id, nextStage);
  }

  return (
    <div
      onClick={() => onView(lead.id)}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{lead.parentName}</p>
          <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            Child: <span className="font-semibold text-slate-600 dark:text-slate-400">{lead.childName}</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {lead.priority === "HIGH" && (
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${src.bg}`}>
            {src.emoji} {src.label}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
          <Phone className="w-3 h-3 flex-shrink-0" />
          <span>{lead.parentPhone}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
          <BarChart3 className="w-3 h-3 flex-shrink-0" />
          <span>Class {lead.classInterested}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span className={days > 7 ? "text-amber-500 font-semibold" : ""}>{days}d ago</span>
        </div>
        {lead.followUpDate && (
          <div className="flex items-center gap-2 text-[12px]">
            <Calendar className="w-3 h-3 text-blue-400 flex-shrink-0" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Follow-up: {formatDate(lead.followUpDate)}
            </span>
          </div>
        )}
        {lead.visitDate && (
          <div className="flex items-center gap-2 text-[12px]">
            <MapPin className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Visit: {formatDate(lead.visitDate)}
            </span>
          </div>
        )}
        {lead.convertedAt && (
          <div className="flex items-center gap-2 text-[12px]">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
              Admitted: {formatDate(lead.convertedAt)}
            </span>
          </div>
        )}
      </div>

      {/* Notes */}
      {lead.notes && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic line-clamp-1 mb-3 border-t border-slate-100 dark:border-slate-800 pt-2">
          {lead.notes}
        </p>
      )}

      {/* Footer Actions */}
      <div className="flex items-center gap-2 pt-1">
        {lead.stage !== "CONFIRMED" && nextStage && nextStageCfg ? (
          <button
            onClick={handleMove}
            disabled={moving}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 ${
              nextStageCfg.badge
            } hover:opacity-80`}
          >
            {moving ? (
              <><Loader2 className="w-3 h-3 animate-spin" /> Moving...</>
            ) : (
              <><ArrowRight className="w-3 h-3" /> Move to {nextStageCfg.label}</>
            )}
          </button>
        ) : (
          <Link
            href={`/admin/students/add?leadId=${lead.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-colors"
          >
            <UserPlus className="w-3 h-3" /> Convert to Student
          </Link>
        )}
        <Link
          href={`/admin/crm/leads/${lead.id}`}
          onClick={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────
function KanbanColumn({ stage, leads, onMoveNext, onView }) {
  const cfg = STAGES[stage];
  const stageLeads = leads.filter((l) => l.stage === stage);

  return (
    <div className="flex flex-col min-w-[280px] sm:min-w-0 flex-1">
      {/* Column header */}
      <div className={`${cfg.header} rounded-2xl p-4 mb-3`}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{cfg.label}</h3>
          <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-xl">
            {stageLeads.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3 flex-1">
        {stageLeads.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className="text-[12px] text-slate-400 dark:text-slate-600 font-medium">No leads in this stage</p>
          </div>
        ) : (
          stageLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onMoveNext={onMoveNext} onView={onView} />
          ))
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
export default function CRMPage() {
  const [leads, setLeads] = useState(LEADS_DATA);
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("ALL");
  const [viewLead, setViewLead] = useState(null);
  const [activeView, setActiveView] = useState("kanban");

  const filteredLeads = useMemo(() => {
    let data = [...leads];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((l) => l.parentName.toLowerCase().includes(q) || l.childName.toLowerCase().includes(q) || l.parentPhone.includes(q));
    }
    if (filterSource !== "ALL") {
      data = data.filter((l) => l.source === filterSource);
    }
    return data;
  }, [leads, search, filterSource]);

  function handleMoveNext(leadId, newStage) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, stage: newStage } : l));
  }

  function handleViewLead(id) {
    const lead = leads.find((l) => l.id === id);
    setViewLead(lead);
  }

  // Funnel data
  const funnelData = [
    { stage: "New Leads", value: leads.filter((l) => l.stage === "NEW_LEAD").length, fill: "#3b82f6" },
    { stage: "Interested", value: leads.filter((l) => l.stage === "INTERESTED").length, fill: "#f59e0b" },
    { stage: "Counseling", value: leads.filter((l) => l.stage === "COUNSELING").length, fill: "#f97316" },
    { stage: "Confirmed", value: leads.filter((l) => l.stage === "CONFIRMED").length, fill: "#10b981" },
  ];

  const conversionRate = Math.round(
    (leads.filter((l) => l.stage === "CONFIRMED").length / leads.length) * 100
  );

  const thisMonthLeads = leads.filter(() => true).length;

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              CRM / Admissions
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{leads.length} Total Leads</span>
              </span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage admission inquiries and track conversion pipeline
            </p>
          </div>
          <Link
            href="/admin/crm/leads/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New Lead
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { label: "Total Leads", value: leads.length, color: "text-slate-900 dark:text-white", bg: "bg-slate-50 dark:bg-slate-800" },
            ...STAGE_ORDER.map((stage) => ({
              label: STAGES[stage].label,
              value: leads.filter((l) => l.stage === stage).length,
              color: STAGES[stage].text,
              bg: `bg-${STAGES[stage].color === "blue" ? "blue" : STAGES[stage].color === "amber" ? "amber" : STAGES[stage].color === "orange" ? "orange" : "emerald"}-50 dark:bg-${STAGES[stage].color === "blue" ? "blue" : STAGES[stage].color === "amber" ? "amber" : STAGES[stage].color === "orange" ? "orange" : "emerald"}-500/10`,
            })),
          ].map((stat, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 ${stat.bg}`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-medium text-center">{stat.label}</p>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center p-3.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{conversionRate}%</p>
            <p className="text-[11px] text-slate-400 font-medium">Conversion Rate</p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by parent name, child, phone..."
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition-all"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>}
          </div>
          <div className="flex gap-2">
            {["ALL", "GOOGLE", "FACEBOOK", "WALKIN", "REFERENCE"].map((src) => {
              const cfg = src === "ALL" ? { emoji: "🔍", label: "All Sources" } : SOURCE_CONFIG[src];
              return (
                <button
                  key={src}
                  onClick={() => setFilterSource(src)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-[12px] font-semibold transition-all whitespace-nowrap ${
                    filterSource === src
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {cfg?.emoji} <span className="hidden sm:inline">{cfg?.label || src}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 px-4 sm:px-0 pb-4">
            {STAGE_ORDER.map((stage) => (
              <KanbanColumn
                key={stage}
                stage={stage}
                leads={filteredLeads}
                onMoveNext={handleMoveNext}
                onView={handleViewLead}
              />
            ))}
          </div>
        </div>

        {/* Analytics Funnel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Admission Funnel
            </h3>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-slate-400 dark:text-slate-500" />
                  <YAxis type="category" dataKey="stage" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: "currentColor" }} className="text-slate-600 dark:text-slate-400" width={85} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-xl">
                          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                          <p className="text-lg font-bold text-slate-900 dark:text-white">{payload[0].value} leads</p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={32}>
                    {funnelData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-5">
              Conversion Metrics
            </h3>
            <div className="space-y-4">
              {funnelData.map((item, i) => {
                const pct = Math.round((item.value / leads.length) * 100);
                return (
                  <div key={item.stage}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.stage}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}</span>
                        <span className="text-[11px] text-slate-400">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: item.fill }}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Overall Conversion</p>
                  <p className="text-xs text-slate-400 mt-0.5">New Leads → Confirmed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{conversionRate}%</p>
                  <p className="text-xs text-slate-400">{leads.filter((l) => l.stage === "CONFIRMED").length} of {leads.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Quick View Drawer */}
      {viewLead && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewLead(null)} />
          <div className="relative z-10 w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300 overflow-hidden">
            <div className={`${STAGES[viewLead.stage].header} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Lead Details</h3>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/crm/leads/${viewLead.id}`} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" onClick={() => setViewLead(null)}>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                  <button onClick={() => setViewLead(null)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold">{viewLead.parentName.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{viewLead.parentName}</p>
                  <p className="text-[12px] text-slate-400">Child: {viewLead.childName} • Class {viewLead.classInterested}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Phone", value: viewLead.parentPhone },
                  { label: "Source", value: `${SOURCE_CONFIG[viewLead.source]?.emoji} ${SOURCE_CONFIG[viewLead.source]?.label}` },
                  { label: "Assigned To", value: viewLead.assignedTo },
                  { label: "Follow-up", value: viewLead.followUpDate ? formatDate(viewLead.followUpDate) : "Not set" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              {viewLead.notes && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-[10px] text-slate-400 font-medium">Notes</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">{viewLead.notes}</p>
                </div>
              )}
              <Link
                href={`/admin/crm/leads/${viewLead.id}`}
                onClick={() => setViewLead(null)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm hover:from-blue-700 hover:to-indigo-700 transition-all active:scale-95"
              >
                <Eye className="w-4 h-4" /> View Full Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}