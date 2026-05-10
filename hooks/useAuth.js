// hooks/useAuth.js
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const raw   = localStorage.getItem("user");
      if (!token || !raw) { setLoading(false); return; }

      // Check expiry
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp && Date.now() / 1000 > payload.exp) {
        logout();
        return;
      }

      setUser(JSON.parse(raw));
    } catch (_) {
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch (_) {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.replace("/login");
  }, [router]);

  const getToken = useCallback(() => {
    return localStorage.getItem("token") || null;
  }, []);

  const authHeaders = useCallback(() => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [getToken]);

  return { user, loading, logout, getToken, authHeaders, isLoggedIn: !!user };
}