// components/shared/LoadingSpinner.js
"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  size = "md",
  text = "Loading...",
  fullScreen = false,
}) {
  const sizes = {
    sm: { spinner: "w-4 h-4", text: "text-xs" },
    md: { spinner: "w-8 h-8", text: "text-sm" },
    lg: { spinner: "w-12 h-12", text: "text-base" },
  };

  const s = sizes[size] || sizes.md;

  // ── Full screen overlay ───────────────────────────────────────
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner rings */}
          <div className="relative">
            <div className={`${s.spinner} rounded-full border-4 border-slate-100 dark:border-slate-800`} />
            <div className={`absolute inset-0 ${s.spinner} rounded-full border-4 border-transparent border-t-blue-500 animate-spin`} />
          </div>
          {text && (
            <p className={`${s.text} font-semibold text-slate-500 dark:text-slate-400`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Inline spinner ────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="relative">
        <div className={`${s.spinner} rounded-full border-4 border-slate-100 dark:border-slate-800`} />
        <div className={`absolute inset-0 ${s.spinner} rounded-full border-4 border-transparent border-t-blue-500 animate-spin`} />
      </div>
      {text && (
        <p className={`${s.text} font-semibold text-slate-500 dark:text-slate-400`}>
          {text}
        </p>
      )}
    </div>
  );
}