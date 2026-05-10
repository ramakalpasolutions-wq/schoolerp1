// hooks/useSocket.js
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useSocket(url) {
  const socketRef             = useRef(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const listenersRef          = useRef({});

  useEffect(() => {
    if (!url) return;

    // ── Connect ─────────────────────────────────────────────
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log("[useSocket] connected");
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("[useSocket] disconnected");
    };

    ws.onerror = (err) => {
      console.error("[useSocket] error:", err);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);

        // Fire typed listeners
        const handlers = listenersRef.current[data.type] || [];
        handlers.forEach((fn) => fn(data.payload ?? data));
      } catch (_) {
        setLastMessage(event.data);
      }
    };

    return () => {
      ws.close();
    };
  }, [url]);

  // ── Send ───────────────────────────────────────────────────
  const send = useCallback((type, payload = {}) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  // ── on(type, handler) ──────────────────────────────────────
  const on = useCallback((type, handler) => {
    if (!listenersRef.current[type]) {
      listenersRef.current[type] = [];
    }
    listenersRef.current[type].push(handler);

    // Return off()
    return () => {
      listenersRef.current[type] = (
        listenersRef.current[type] || []
      ).filter((fn) => fn !== handler);
    };
  }, []);

  return { connected, lastMessage, send, on, socket: socketRef.current };
}