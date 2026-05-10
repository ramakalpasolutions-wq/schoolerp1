// src/app/(dashboard)/settings/page.js
// This is a general redirect — role-specific settings pages exist already

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function SettingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const roleSettingsMap = {
        SUPER_ADMIN: "/super-admin/settings",
        SCHOOL_ADMIN: "/admin/settings",
        TEACHER: "/profile",
        STUDENT: "/profile",
        PARENT: "/profile",
        ACCOUNTANT: "/profile",
      };
      const target = roleSettingsMap[user.role] || "/profile";
      router.replace(target);
    } catch {
      router.replace("/profile");
    }
  }, [router]);

  return <LoadingSpinner variant="page" text="Loading settings..." />;
}