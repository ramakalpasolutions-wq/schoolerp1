// store/useStore.js
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({

      // ── Auth ────────────────────────────────────────────────
      user:   null,
      token:  null,
      school: null,

      setAuth: (user, token, school) => set({ user, token, school }),
      clearAuth: () => set({ user: null, token: null, school: null }),
      updateUser: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : null })),

      // ── UI ──────────────────────────────────────────────────
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      darkMode: false,
      toggleDarkMode: () =>
        set((s) => ({ darkMode: !s.darkMode })),

      // ── Notifications ───────────────────────────────────────
      notifications:    [],
      unreadCount:      0,

      setNotifications: (notifications) =>
        set({
          notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        }),

      markNotificationRead: (id) =>
        set((s) => {
          const notifications = s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        }),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      addNotification: (notif) =>
        set((s) => {
          const notifications = [
            { ...notif, id: Date.now(), read: false },
            ...s.notifications,
          ];
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          };
        }),

      // ── Global loading ───────────────────────────────────────
      globalLoading: false,
      setGlobalLoading: (v) => set({ globalLoading: v }),

      // ── Toast / snackbar ────────────────────────────────────
      toasts: [],
      addToast: (toast) =>
        set((s) => ({
          toasts: [
            ...s.toasts,
            { id: Date.now(), duration: 3000, ...toast },
          ],
        })),
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name:    "school-erp-store",
      partialize: (s) => ({
        user:             s.user,
        token:            s.token,
        school:           s.school,
        sidebarCollapsed: s.sidebarCollapsed,
        darkMode:         s.darkMode,
      }),
    }
  )
);

export default useStore;