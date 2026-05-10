// src/app/(dashboard)/admin/notifications/page.js

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Bell, Send, Clock, Users, GraduationCap, Search,
  ChevronDown, MessageSquare, Mail, Smartphone, X,
  CheckCircle2, AlertCircle, Megaphone, IndianRupee,
  FileText, BarChart3, AlertTriangle, Info, Loader2,
  Eye, Filter, Calendar, Hash, ArrowRight, BookOpen,
  History, Plus, Star, Zap, RefreshCw,
} from "lucide-react";

// ── Notification Types ───────────────────────────────────────────
const NOTIFICATION_TYPES = [
  { id: "HOLIDAY", label: "Holiday Notice", emoji: "📢", icon: Megaphone, color: "blue" },
  { id: "FEE_REMINDER", label: "Fee Reminder", emoji: "💰", icon: IndianRupee, color: "amber" },
  { id: "EXAM_ALERT", label: "Exam Alert", emoji: "📝", icon: FileText, color: "purple" },
  { id: "ATTENDANCE", label: "Attendance Alert", emoji: "📊", icon: BarChart3, color: "orange" },
  { id: "EMERGENCY", label: "Emergency Alert", emoji: "🚨", icon: AlertTriangle, color: "red" },
  { id: "GENERAL", label: "General Announcement", emoji: "📌", icon: Info, color: "slate" },
];

const typeColors = {
  blue: { card: "border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10", active: "border-blue-500 bg-blue-100 dark:bg-blue-500/20 ring-2 ring-blue-500/20", icon: "text-blue-600 dark:text-blue-400" },
  amber: { card: "border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10", active: "border-amber-500 bg-amber-100 dark:bg-amber-500/20 ring-2 ring-amber-500/20", icon: "text-amber-600 dark:text-amber-400" },
  purple: { card: "border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10", active: "border-purple-500 bg-purple-100 dark:bg-purple-500/20 ring-2 ring-purple-500/20", icon: "text-purple-600 dark:text-purple-400" },
  orange: { card: "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-500/10", active: "border-orange-500 bg-orange-100 dark:bg-orange-500/20 ring-2 ring-orange-500/20", icon: "text-orange-600 dark:text-orange-400" },
  red: { card: "border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10", active: "border-red-500 bg-red-100 dark:bg-red-500/20 ring-2 ring-red-500/20", icon: "text-red-600 dark:text-red-400" },
  slate: { card: "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800", active: "border-slate-500 bg-slate-100 dark:bg-slate-700 ring-2 ring-slate-500/20", icon: "text-slate-600 dark:text-slate-400" },
};

// ── Recipient Types ──────────────────────────────────────────────
const RECIPIENT_TYPES = [
  { id: "ALL_PARENTS", label: "All Students & Parents", count: 1250, icon: Users },
  { id: "ALL_TEACHERS", label: "All Teachers", count: 68, icon: GraduationCap },
  { id: "CLASS", label: "Specific Class", count: null, icon: BookOpen },
  { id: "INDIVIDUAL", label: "Individual", count: null, icon: Search },
];

// ── Channels ─────────────────────────────────────────────────────
const CHANNELS = [
  { id: "sms", label: "SMS", emoji: "📱", color: "blue", limit: 160 },
  { id: "whatsapp", label: "WhatsApp", emoji: "💬", color: "emerald", limit: 1000 },
  { id: "email", label: "Email", emoji: "📧", color: "purple", limit: 5000 },
  { id: "push", label: "Push", emoji: "🔔", color: "orange", limit: 200 },
];

const channelColors = {
  blue: "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300",
  emerald: "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  purple: "border-purple-500 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300",
  orange: "border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-300",
};

// ── Templates ────────────────────────────────────────────────────
const TEMPLATES = {
  HOLIDAY: [
    { id: "h1", label: "Holiday Announcement", text: "Dear Parents, school will remain closed on [DATE] due to [REASON]. Classes will resume on [RESUME_DATE]. - [SCHOOL_NAME]" },
    { id: "h2", label: "Summer Vacation", text: "Dear [STUDENT_NAME]'s Parent, Summer vacation starts from [DATE]. School reopens on [RESUME_DATE]. Have a great vacation! - [SCHOOL_NAME]" },
  ],
  FEE_REMINDER: [
    { id: "f1", label: "Fee Due Reminder", text: "Dear Parent, Your child [STUDENT_NAME]'s fee of ₹[AMOUNT] is due on [DATE]. Please pay at school. - [SCHOOL_NAME]" },
    { id: "f2", label: "Overdue Notice", text: "Dear Parent, [STUDENT_NAME]'s fee of ₹[AMOUNT] is overdue. Please pay immediately to avoid late charges. - [SCHOOL_NAME]" },
  ],
  EXAM_ALERT: [
    { id: "e1", label: "Exam Schedule", text: "Dear Parents, [STUDENT_NAME]'s exams start from [DATE]. Please ensure proper preparation. Timetable shared separately. - [SCHOOL_NAME]" },
    { id: "e2", label: "Result Announcement", text: "Dear Parents, [STUDENT_NAME]'s exam results are available. Please collect the report card from school. - [SCHOOL_NAME]" },
  ],
  ATTENDANCE: [
    { id: "a1", label: "Absent Alert", text: "Dear Parent, [STUDENT_NAME] was absent today [DATE]. If unwell, please send a medical note. - [SCHOOL_NAME]" },
    { id: "a2", label: "Low Attendance", text: "Dear Parent, [STUDENT_NAME]'s attendance is [PERCENTAGE]%. Minimum 75% required. Please ensure regular attendance. - [SCHOOL_NAME]" },
  ],
  EMERGENCY: [
    { id: "em1", label: "Emergency Closure", text: "🚨 URGENT: School closed today due to [REASON]. All students should go home immediately. - [SCHOOL_NAME]" },
  ],
  GENERAL: [
    { id: "g1", label: "PTM Notice", text: "Dear Parents, Parent-Teacher Meeting is scheduled on [DATE] at [TIME]. Your presence is important. - [SCHOOL_NAME]" },
    { id: "g2", label: "Event Announcement", text: "Dear Parents, [EVENT_NAME] will be held on [DATE]. Students should [INSTRUCTIONS]. - [SCHOOL_NAME]" },
  ],
};

// ── History Data ─────────────────────────────────────────────────
const HISTORY_DATA = [
  { id: 1, type: "FEE_REMINDER", message: "Dear Parent, Your child's fee of ₹8,000 is due...", recipients: "All Parents", channels: ["SMS", "WhatsApp"], sentAt: "2025-03-18 10:30 AM", delivered: 1180, failed: 70, total: 1250 },
  { id: 2, type: "ATTENDANCE", message: "Dear Parent, [STUDENT_NAME] was absent today...", recipients: "Class 10-A Parents", channels: ["SMS"], sentAt: "2025-03-17 09:00 AM", delivered: 42, failed: 2, total: 44 },
  { id: 3, type: "EXAM_ALERT", message: "Dear Parents, Unit Test 1 starts from March 25...", recipients: "All Students", channels: ["SMS", "WhatsApp", "Email"], sentAt: "2025-03-15 02:00 PM", delivered: 1240, failed: 10, total: 1250 },
  { id: 4, type: "HOLIDAY", message: "Dear Parents, school will remain closed on March 31...", recipients: "All", channels: ["Push", "SMS"], sentAt: "2025-03-14 11:00 AM", delivered: 1100, failed: 150, total: 1250 },
  { id: 5, type: "GENERAL", message: "PTM is scheduled on April 5th at 10 AM...", recipients: "All Parents", channels: ["SMS", "Email"], sentAt: "2025-03-12 03:30 PM", delivered: 1230, failed: 20, total: 1250 },
];

const CLASSES = ["6-A", "6-B", "7-A", "7-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B"];

function getTypeConfig(typeId) {
  return NOTIFICATION_TYPES.find((t) => t.id === typeId) || NOTIFICATION_TYPES[5];
}

// ════════════════════════════════════════════════════════════════
export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("compose");
  const [notifType, setNotifType] = useState("GENERAL");
  const [recipientType, setRecipientType] = useState("ALL_PARENTS");
  const [selectedClass, setSelectedClass] = useState("6-A");
  const [channels, setChannels] = useState({ sms: true, whatsapp: false, email: false, push: false });
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [scheduleMode, setScheduleMode] = useState("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [historyFilter, setHistoryFilter] = useState("ALL");

  const currentTemplates = TEMPLATES[notifType] || TEMPLATES.GENERAL;
  const activeChannels = Object.entries(channels).filter(([, v]) => v).map(([k]) => k);
  const smsLimit = 160;
  const charCount = message.length;

  const recipientCount = useMemo(() => {
    if (recipientType === "ALL_PARENTS") return 1250;
    if (recipientType === "ALL_TEACHERS") return 68;
    if (recipientType === "CLASS") return 44;
    return 1;
  }, [recipientType]);

  function toggleChannel(id) {
    setChannels((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function applyTemplate(template) {
    setSelectedTemplate(template.id);
    setMessage(template.text);
  }

  function insertVariable(variable) {
    setMessage((prev) => prev + variable);
  }

  async function handleSend() {
    if (!message.trim() || activeChannels.length === 0) return;
    setIsSending(true);
    setSendResult(null);
    await new Promise((r) => setTimeout(r, 2500));
    const total = recipientCount;
    const failed = Math.floor(total * 0.04);
    const delivered = total - failed;
    setSendResult({ success: true, total, delivered, failed });
    setIsSending(false);
  }

  const filteredHistory = useMemo(() => {
    if (historyFilter === "ALL") return HISTORY_DATA;
    return HISTORY_DATA.filter((h) => h.type === historyFilter);
  }, [historyFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Compose and send notifications to students, parents, and teachers
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-1.5">
        {[
          { id: "compose", label: "Compose", icon: Plus },
          { id: "history", label: "History", icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── COMPOSE TAB ─────────────────────────────────────────── */}
      {activeTab === "compose" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left — Composer */}
          <div className="xl:col-span-2 space-y-6">
            {/* Step 1 — Type */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
                Notification Type
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {NOTIFICATION_TYPES.map((type) => {
                  const cfg = typeColors[type.color];
                  const active = notifType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => { setNotifType(type.id); setSelectedTemplate(""); setMessage(""); setSendResult(null); }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 ${active ? cfg.active : cfg.card + " hover:shadow-md"}`}
                    >
                      <span className="text-2xl flex-shrink-0">{type.emoji}</span>
                      <span className={`text-[13px] font-semibold leading-tight ${active ? cfg.icon : "text-slate-700 dark:text-slate-300"}`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 — Recipients */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
                Recipients
              </h3>
              <div className="space-y-2">
                {RECIPIENT_TYPES.map((type) => {
                  const Icon = type.icon;
                  const active = recipientType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setRecipientType(type.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                        active
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-blue-100 dark:bg-blue-500/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                        <Icon className={`w-4 h-4 ${active ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-semibold ${active ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"}`}>
                          {type.label}
                        </p>
                        {type.count && <p className="text-[11px] text-slate-400">{type.count.toLocaleString()} recipients</p>}
                      </div>
                      {active && <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {recipientType === "CLASS" && (
                <div className="mt-3 relative animate-in slide-in-from-top-2 duration-200">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full pl-3.5 pr-9 py-2.5 rounded-xl border-2 border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-sm font-semibold outline-none appearance-none focus:border-blue-500 transition-all"
                  >
                    {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Step 3 — Channels */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">3</div>
                Send Via
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CHANNELS.map((ch) => {
                  const active = channels[ch.id];
                  return (
                    <button
                      key={ch.id}
                      onClick={() => toggleChannel(ch.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        active ? channelColors[ch.color] : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300"
                      }`}
                    >
                      <span className="text-2xl">{ch.emoji}</span>
                      <span className="text-xs font-bold">{ch.label}</span>
                      {active && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4 — Message */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">4</div>
                Message
              </h3>

              {/* Templates */}
              {currentTemplates.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Templates</p>
                  <div className="flex flex-wrap gap-2">
                    {currentTemplates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => applyTemplate(tmpl)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                          selectedTemplate === tmpl.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                        }`}
                      >
                        {tmpl.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variables */}
              <div className="mb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Insert Variable</p>
                <div className="flex flex-wrap gap-1.5">
                  {["[STUDENT_NAME]", "[AMOUNT]", "[DATE]", "[CLASS]", "[SCHOOL_NAME]", "[PERCENTAGE]"].map((v) => (
                    <button
                      key={v}
                      onClick={() => insertVariable(v)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-mono font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Type your notification message here..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none text-sm resize-none transition-all"
                />
                <div className={`absolute bottom-3 right-3 text-[11px] font-semibold ${charCount > smsLimit ? "text-red-500" : "text-slate-400"}`}>
                  {charCount}/{smsLimit}
                </div>
              </div>
              {charCount > smsLimit && channels.sms && (
                <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  SMS exceeds 160 chars — will be sent as 2 SMS segments
                </p>
              )}

              {/* Schedule */}
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Send Options</p>
                <div className="flex gap-2 mb-4">
                  {["now", "schedule"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setScheduleMode(mode)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                        scheduleMode === mode
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {mode === "now" ? <><Zap className="w-4 h-4" /> Send Now</> : <><Clock className="w-4 h-4" /> Schedule Later</>}
                    </button>
                  ))}
                </div>

                {scheduleMode === "schedule" && (
                  <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Date</label>
                      <input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Time</label>
                      <input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none transition-all" />
                    </div>
                  </div>
                )}
              </div>

              {/* Result Banner */}
              {sendResult && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      Notification Sent Successfully!
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✅ {sendResult.delivered.toLocaleString()} delivered</span>
                    {sendResult.failed > 0 && <span className="text-red-500 font-semibold">❌ {sendResult.failed} failed</span>}
                  </div>
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={isSending || !message.trim() || activeChannels.length === 0}
                className="mt-4 w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-base shadow-xl shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {isSending ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Sending to {recipientCount.toLocaleString()} recipients...</>
                ) : (
                  <><Send className="w-5 h-5" /> {scheduleMode === "now" ? `Send Now` : "Schedule Notification"}</>
                )}
              </button>
            </div>
          </div>

          {/* Right — Preview Panel */}
          <div className="space-y-5">
            {/* Live Preview */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sticky top-24">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-500" />
                Live Preview
              </h3>

              {/* Summary */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {getTypeConfig(notifType).emoji} {getTypeConfig(notifType).label}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Recipients:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {recipientCount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Channels:</span>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {activeChannels.length === 0 ? (
                      <span className="text-red-500 text-xs font-semibold">None selected</span>
                    ) : (
                      activeChannels.map((ch) => (
                        <span key={ch} className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {CHANNELS.find((c) => c.id === ch)?.emoji} {ch.toUpperCase()}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Chars:</span>
                  <span className={`font-semibold ${charCount > smsLimit ? "text-red-500" : "text-slate-900 dark:text-white"}`}>
                    {charCount}
                  </span>
                </div>
              </div>

              {/* Message preview */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Message Preview
                </p>
                {message ? (
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {message}
                  </p>
                ) : (
                  <p className="text-sm text-slate-300 dark:text-slate-600 italic">
                    Your message will appear here...
                  </p>
                )}
              </div>

              {/* SMS Phone mockup */}
              {channels.sms && message && (
                <div className="mt-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    📱 SMS Preview
                  </p>
                  <div className="bg-blue-500 rounded-2xl rounded-bl-sm px-3 py-2.5 max-w-[80%]">
                    <p className="text-white text-xs leading-relaxed">{message.slice(0, 160)}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 text-right">
                    {Math.ceil(message.length / 160)} SMS segment{Math.ceil(message.length / 160) > 1 ? "s" : ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY TAB ─────────────────────────────────────────── */}
      {activeTab === "history" && (
        <div className="space-y-5">
          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {["ALL", ...NOTIFICATION_TYPES.map((t) => t.id)].map((filter) => {
              const type = NOTIFICATION_TYPES.find((t) => t.id === filter);
              return (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                    historyFilter === filter
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {type ? type.emoji : "🔍"} {filter === "ALL" ? "All Types" : type?.label || filter}
                </button>
              );
            })}
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60">
                    {["Type", "Message", "Recipients", "Channels", "Sent At", "Delivered", "Failed"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHistory.map((notif) => {
                    const typeCfg = getTypeConfig(notif.type);
                    const deliveryPct = Math.round((notif.delivered / notif.total) * 100);
                    return (
                      <tr key={notif.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5">
                          <span className="text-xl">{typeCfg.emoji}</span>
                        </td>
                        <td className="px-4 py-3.5 max-w-[250px]">
                          <p className="text-sm text-slate-700 dark:text-slate-300 truncate">{notif.message}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{notif.recipients}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex gap-1">
                            {notif.channels.map((ch) => (
                              <span key={ch} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                {ch}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {notif.sentAt}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${deliveryPct}%` }} />
                            </div>
                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{notif.delivered}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-sm font-bold ${notif.failed > 0 ? "text-red-500" : "text-slate-300 dark:text-slate-700"}`}>
                            {notif.failed > 0 ? notif.failed : "—"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="lg:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredHistory.map((notif) => {
                const typeCfg = getTypeConfig(notif.type);
                return (
                  <div key={notif.id} className="p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl">{typeCfg.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{notif.message}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{notif.sentAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pl-9">
                      <div className="flex gap-1">
                        {notif.channels.map((ch) => <span key={ch} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{ch}</span>)}
                      </div>
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">✅ {notif.delivered}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}