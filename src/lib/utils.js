// lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── Admission Number Generator ───────────────────────────────────
export function generateAdmissionNumber(schoolCode = "RAJ", year = null) {
  const currentYear = year || new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ADM/${currentYear}/${random}`;
}

// ── Student ID Generator ─────────────────────────────────────────
export function generateStudentId(classNo = "10", section = "A") {
  const random = Math.floor(100 + Math.random() * 900);
  const year = new Date().getFullYear().toString().slice(-2);
  return `STU${year}${classNo}${section}${random}`;
}

// ── Format Date ──────────────────────────────────────────────────
export function formatDate(dateStr, options = {}) {
  if (!dateStr) return "—";
  const defaultOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  };
  return new Date(dateStr).toLocaleDateString("en-IN", defaultOptions);
}

// ── Format Currency ──────────────────────────────────────────────
export function formatCurrency(amount, symbol = "₹") {
  if (!amount && amount !== 0) return "—";
  if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}K`;
  return `${symbol}${amount.toLocaleString("en-IN")}`;
}

// ── Get Initials ─────────────────────────────────────────────────
export function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Capitalize ───────────────────────────────────────────────────
export function capitalize(str = "") {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// ── Truncate ─────────────────────────────────────────────────────
export function truncate(str = "", maxLength = 30) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

// ── Calculate Age ─────────────────────────────────────────────────
export function calculateAge(dob) {
  if (!dob) return null;
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// ── Grade Calculator ─────────────────────────────────────────────
export function getGrade(marks, maxMarks) {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return { grade: "A+", color: "text-emerald-600" };
  if (pct >= 80) return { grade: "A", color: "text-blue-600" };
  if (pct >= 70) return { grade: "B+", color: "text-indigo-600" };
  if (pct >= 60) return { grade: "B", color: "text-purple-600" };
  if (pct >= 50) return { grade: "C", color: "text-amber-600" };
  if (pct >= 35) return { grade: "D", color: "text-orange-600" };
  return { grade: "F", color: "text-red-600" };
}

// ── Attendance Percentage ─────────────────────────────────────────
export function attendancePct(present, total) {
  if (!total) return 0;
  return Math.round((present / total) * 100);
}

// ── File size formatter ──────────────────────────────────────────
export function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Debounce ─────────────────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}