// src/app/(dashboard)/layout.js

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardLayout from "../../../components/shared/DashboardLayout";
import LoadingSpinner from "../../../components/shared/LoadingSpinner";

// ── Which path prefix belongs to which role ──────────────────────
const ROLE_PREFIX = {
  SUPER_ADMIN: "/super-admin",
  SCHOOL_ADMIN: "/admin",
  TEACHER: "/teacher",
  STUDENT: "/student",
  PARENT: "/parent",
  ACCOUNTANT: "/accountant",
};

function canAccess(pathname, role) {
  if (role === "SUPER_ADMIN") return true; // full access

  // School admin can also view accountant routes
  if (role === "SCHOOL_ADMIN") {
    return pathname.startsWith("/admin") || pathname.startsWith("/accountant");
  }

  const prefix = ROLE_PREFIX[role];
  return !!prefix && pathname.startsWith(prefix);
}

export default function DashboardRootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [authUser, setAuthUser] = useState(null);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function authenticate() {
    try {
      const token = localStorage.getItem("token");
      const raw = localStorage.getItem("user");

      // ── No credentials ───────────────────────────────────────
      if (!token || !raw) {
        router.replace("/login");
        return;
      }

      // ── Parse user ───────────────────────────────────────────
      let user;
      try {
        user = JSON.parse(raw);
      } catch {
        clear();
        return;
      }

      // ── Check JWT expiry (client-side guard) ─────────────────
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.exp && Date.now() / 1000 > payload.exp) {
          clear();
          return;
        }
      } catch {
        // malformed — let server reject it
      }

      // ── Role-based path guard ─────────────────────────────────
      if (!canAccess(pathname, user.role)) {
        const home = ROLE_PREFIX[user.role] || "/login";
        router.replace(home);
        return;
      }

      // ── All good ─────────────────────────────────────────────
      setAuthUser(user);
      if (user.school) setSchool(user.school);
      setLoading(false);
    } catch (err) {
      console.error("[Dashboard] auth error:", err);
      clear();
    }
  }

  function clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  // ── Render ───────────────────────────────────────────────────
  if (loading) return <LoadingSpinner variant="page" text="Authenticating…" />;
  if (!authUser) return <LoadingSpinner variant="page" text="Redirecting…" />;

  return (
    <DashboardLayout user={authUser} role={authUser.role} school={school}>
      {children}
    </DashboardLayout>
  );
}