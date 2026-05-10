// src/app/(dashboard)/admin/crm/leads/[id]/page.js

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Phone, Mail, Globe, Calendar, MessageSquare,
  ArrowRight, UserPlus, Trash2, Loader2, CheckCircle2,
  AlertTriangle, Clock, User, GraduationCap, Pencil,
  Plus, Star, MapPin, X, ChevronRight, BarChart3,
} from "lucide-react";

const MOCK_LEAD = {
  id: "L001",
  parentName: "Ramesh Reddy",
  parentPhone: "9876543210",
  parentEmail: "ramesh@gmail.com",
  childName: "Arjun Reddy",
  childAge: 8,
  childDob: "2016-05-14",
  classInterested: "3",
  source: "GOOGLE",
  stage: "INTERESTED",
  assignedTo: "Priya Sharma",
  followUpDate: "2025-03-22",
  notes: "Very interested, asked about science lab facilities. Works in IT, wife is a teacher.",
  previousSchool: "Green Valley School",
  siblingInSchool: false,
  priority: "HIGH",
  createdAt: "2025-03-15",
  timeline: [
    { id: 1, type: "created", title: "Lead Created", description: "Inquiry received via Google Ads", date: "2025-03-15 10:30 AM", by: "System" },
    { id: 2, type: "call", title: "Initial Call Made", description: "Spoke with Ramesh Reddy for 15 minutes. Very interested in science program. Will visit school.", date: "2025-03-16 02:00 PM", by: "Priya Sharma" },
    { id: 3, type: "stage", title: "Moved to Interested", description: "Parent confirmed interest in visiting school", date: "2025-03-17 11:00 AM", by: "Priya Sharma" },
    { id: 4, type: "followup", title: "Follow-up Scheduled", description: "Follow-up call scheduled for March 22nd at 10 AM", date: "2025-03-18 03:30 PM", by: "Priya Sharma" },
  ],
};

const STAGES_ORDER = ["NEW_LEAD", "INTERESTED", "COUNSELING", "CONFIRMED"];
const STAGES_CONFIG = {
  NEW_LEAD: { label: "New Lead", color: "bg-blue-600", badge: "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20" },
  INTERESTED: { label: "Interested", color: "bg-amber-500", badge: "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20" },
  COUNSELING: { label: "Counseling", color: "bg-orange-600", badge: "bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/20" },
  CONFIRMED: { label: "Confirmed", color: "bg-emerald-600", badge: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20" },
};

const SOURCE_CONFIG = {
  GOOGLE: { label: "Google", emoji: "🔍" },
  FACEBOOK: { label: "Facebook", emoji: "📘" },
  WALKIN: { label: "Walk-in", emoji: "🚶" },
  REFERENCE: { label: "Reference", emoji: "🤝" },
  INSTAGRAM: { label: "Instagram", emoji: "📷" },
  OTHER: { label: "Other", emoji: "📌" },
};

const TIMELINE_ICONS = {
  created: { icon: Plus, bg: "bg-blue-100 dark:bg-blue-500/10", color: "text-blue-600 dark:text-blue-400" },
  call: { icon: Phone, bg: "bg-emerald-100 dark:bg-emerald-500/10", color: "text-emerald-600 dark:text-emerald-400" },
  stage: { icon: ArrowRight, bg: "bg-purple-100 dark:bg-purple-500/10", color: "text-purple-600 dark:text-purple-400" },
  followup: { icon: Calendar, bg: "bg-amber-100 dark:bg-amber-500/10", color: "text-amber-600 dark:text-amber-400" },
  note: { icon: MessageSquare, bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-600 dark:text-slate-400" },
  visit: { icon: MapPin, bg: "bg-orange-100 dark:bg-orange-500/10", color: "text-orange-600 dark:text-orange-400" },
};

function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 animate-in zoom-in-95 duration-300 text-center">
        <div className="w-14 h-14 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Lead</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Are you sure? This lead and all its history will be permanently deleted.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors shadow-lg shadow-red-500/20">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movingStage, setMovingStage] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newNoteType, setNewNoteType] = useState("note");
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLead({ ...MOCK_LEAD, id: params.id });
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, [params.id]);

  async function handleMoveStage() {
    if (!lead) return;
    const currentIdx = STAGES_ORDER.indexOf(lead.stage);
    if (currentIdx >= STAGES_ORDER.length - 1) return;
    const nextStage = STAGES_ORDER[currentIdx + 1];
    setMovingStage(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLead((prev) => ({
      ...prev,
      stage: nextStage,
      timeline: [...prev.timeline, {
        id: Date.now(),
        type: "stage",
        title: `Moved to ${STAGES_CONFIG[nextStage].label}`,
        description: `Stage updated from ${STAGES_CONFIG[prev.stage].label} to ${STAGES_CONFIG[nextStage].label}`,
        date: new Date().toLocaleString("en-IN"),
        by: "Admin",
      }],
    }));
    setMovingStage(false);
  }

  async function addNote() {
    if (!newNote.trim()) return;
    setAddingNote(true);
    await new Promise((r) => setTimeout(r, 500));
    setLead((prev) => ({
      ...prev,
      timeline: [...prev.timeline, {
        id: Date.now(),
        type: newNoteType,
        title: newNoteType === "call" ? "Call Made" : newNoteType === "visit" ? "Visit Scheduled" : "Note Added",
        description: newNote,
        date: new Date().toLocaleString("en-IN"),
        by: "Admin",
      }],
    }));
    setNewNote("");
    setAddingNote(false);
  }

  function handleDelete() {
    router.push("/admin/crm");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!lead) return null;

  const stageCfg = STAGES_CONFIG[lead.stage] || STAGES_CONFIG.NEW_LEAD;
  const currentIdx = STAGES_ORDER.indexOf(lead.stage);
  const nextStage = STAGES_ORDER[currentIdx + 1];
  const nextCfg = nextStage ? STAGES_CONFIG[nextStage] : null;
  const src = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG.OTHER;

  return (
    <>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/crm" className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Lead Details</h1>
              <p className="text-sm text-slate-400">{lead.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowDelete(true)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
            {lead.stage === "CONFIRMED" ? (
              <Link href={`/admin/students/add?leadId=${lead.id}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all active:scale-95">
                <UserPlus className="w-4 h-4" /> Convert to Student
              </Link>
            ) : nextStage && nextCfg ? (
              <button onClick={handleMoveStage} disabled={movingStage} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${nextCfg.color} text-white text-sm font-bold shadow-md disabled:opacity-60 transition-all active:scale-95`}>
                {movingStage ? <><Loader2 className="w-4 h-4 animate-spin" /> Moving...</> : <><ArrowRight className="w-4 h-4" /> Move to {nextCfg.label}</>}
              </button>
            ) : null}
          </div>
        </div>

        {/* Stage Progress Bar */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center gap-2">
            {STAGES_ORDER.map((stage, i) => {
              const cfg = STAGES_CONFIG[stage];
              const isActive = stage === lead.stage;
              const isDone = STAGES_ORDER.indexOf(lead.stage) > i;
              return (
                <div key={stage} className="flex items-center flex-1 last:flex-none">
                  <div className={`flex-1 flex flex-col items-center gap-1`}>
                    <div className={`w-full h-2 rounded-full transition-all ${isDone ? cfg.color : isActive ? cfg.color + " opacity-100" : "bg-slate-200 dark:bg-slate-700"}`} />
                    <div className="flex items-center gap-1">
                      {(isDone || isActive) && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                      <span className={`text-[10px] font-semibold whitespace-nowrap ${isActive ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  {i < STAGES_ORDER.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0 mx-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left — Lead Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Main Info */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <div className={`${stageCfg.color} px-5 py-4`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{lead.parentName.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{lead.parentName}</p>
                    <span className="inline-flex items-center gap-1 text-white/80 text-[11px] font-semibold">
                      {lead.priority === "HIGH" && <Star className="w-3 h-3 fill-white" />}
                      {stageCfg.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3">
                {[
                  { icon: Phone, label: "Phone", value: lead.parentPhone },
                  { icon: Mail, label: "Email", value: lead.parentEmail || "—" },
                  { icon: GraduationCap, label: "Child", value: `${lead.childName} (Age ${lead.childAge})` },
                  { icon: BarChart3, label: "Class Interested", value: `Class ${lead.classInterested}` },
                  { icon: Globe, label: "Source", value: `${src.emoji} ${src.label}` },
                  { icon: User, label: "Assigned To", value: lead.assignedTo || "Unassigned" },
                  { icon: Calendar, label: "Follow-up", value: lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Not set" },
                  { icon: Clock, label: "Created", value: new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Initial Notes
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{lead.notes}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <a href={`tel:${lead.parentPhone}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 group">
                  <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Call {lead.parentPhone}</span>
                </a>
                <a href={`https://wa.me/91${lead.parentPhone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 group">
                  <MessageSquare className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
                {lead.parentEmail && (
                  <a href={`mailto:${lead.parentEmail}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 group">
                    <Mail className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Send Email</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right — Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* Add Note */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Add Note / Update</h3>

              {/* Note type selector */}
              <div className="flex gap-2 mb-3">
                {[
                  { id: "note", label: "Note", icon: "📝" },
                  { id: "call", label: "Call", icon: "📞" },
                  { id: "visit", label: "Visit", icon: "🏫" },
                  { id: "followup", label: "Follow-up", icon: "📅" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewNoteType(type.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                      newNoteType === type.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>

              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                placeholder="Type your note, call summary, or update..."
                className="w-full px-3.5 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all"
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim() || addingNote}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {addingNote ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : <><Plus className="w-4 h-4" /> Add Note</>}
              </button>
            </div>

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Timeline
              </h3>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 z-0" />

                <div className="space-y-5">
                  {[...lead.timeline].reverse().map((item, i) => {
                    const iconCfg = TIMELINE_ICONS[item.type] || TIMELINE_ICONS.note;
                    const Icon = iconCfg.icon;
                    return (
                      <div key={item.id} className="relative flex items-start gap-4 pl-1">
                        {/* Icon */}
                        <div className={`relative z-10 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconCfg.bg}`}>
                          <Icon className={`w-4 h-4 ${iconCfg.color}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{item.date}</span>
                          </div>
                          <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                          {item.by && (
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
                              <User className="w-3 h-3" /> {item.by}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}