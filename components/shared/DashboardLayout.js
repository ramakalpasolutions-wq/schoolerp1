// components/shared/DashboardLayout.js

"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, user, role, school }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Restore sidebar state from localStorage ─────────────────
  useEffect(() => {
    const stored = localStorage.getItem("sidebar_collapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  function handleToggleCollapse() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  }

  // ── Close mobile sidebar on resize to lg ────────────────────
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar
        role={role}
        user={user}
        school={school}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main — offset left margin based on sidebar width */}
      <div
        className={`
          flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${collapsed ? "lg:ml-[70px]" : "lg:ml-64"}
        `}
      >
        {/* Navbar */}
        <Navbar
          onMobileMenuOpen={() => setMobileOpen(true)}
          user={user}
          role={role}
          school={school}
        />

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-screen-2xl">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
          <div className="mx-auto max-w-screen-2xl flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-600">
              © {new Date().getFullYear()} School ERP — Rajyampet. All rights
              reserved.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-600">
              v1.0.0 &nbsp;•&nbsp; Built with ❤️ in India
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}