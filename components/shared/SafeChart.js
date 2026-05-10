// components/shared/SafeChart.js
// ✅ Definitive fix for Recharts "width -1 height -1" warning
// Uses ResizeObserver to only render charts when container has real dimensions

"use client";

import { useState, useEffect, useRef } from "react";

export default function SafeChart({ children, height = 300, className = "" }) {
  const containerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check immediately if already has size
    if (el.offsetWidth > 0 && el.offsetHeight > 0) {
      setReady(true);
      return;
    }

    // Use ResizeObserver to wait until container has real dimensions
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height: h } = entry.contentRect;
        if (width > 0 && h > 0) {
          setReady(true);
          observer.disconnect();
          break;
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className={`w-full relative ${className}`}
    >
      {ready ? (
        children
      ) : (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 border-[2.5px] border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400 font-medium">Loading chart...</span>
          </div>
        </div>
      )}
    </div>
  );
}