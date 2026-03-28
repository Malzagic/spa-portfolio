"use client";

/**
 * OverlayNotice Component - Professional Entry Gate
 * Standards: Next.js 16.2 Client Component, Theme-aware logic.
 * Principles: English-only UI/Comments, Professional UX, Accessibility.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

type RememberOpts = {
  key: string;
  storage?: "session" | "local";
  ttlMs?: number;
};

type OverlayNoticeProps = {
  open?: boolean;
  durationMs?: number;
  onClose?: () => void;
  title?: string;
  message?: string;
  ctaLabel?: string;
  remember?: RememberOpts;
  suppressParam?: string;
  resetParam?: string;
};

export default function OverlayNotice({
  open = true,
  durationMs = 7000,
  onClose,
  title = "System Under Construction",
  message = "You are accessing the pmdev.ovh technical preview. Some automation modules are currently in sandbox mode.",
  ctaLabel = "Enter Preview",
  remember,
  suppressParam = "no-overlay",
  resetParam = "reset-overlay",
}: OverlayNoticeProps) {
  const [visible, setVisible] = useState(false);
  const { themeConfig: T, theme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const isLight = theme === "lightClean";

  // URL override detection for bypass/reset
  const params = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  }, []);

  const isSuppressed = params?.get(suppressParam) === "1";
  const isResetForced = params?.get(resetParam) === "1";

  /**
   * Visibility Logic
   * Handles persistence checks and force-resets.
   */
  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    const storage = remember?.storage === "local" ? localStorage : sessionStorage;

    if (isResetForced && remember?.key) {
      storage.removeItem(remember.key);
    }

    if (remember?.key) {
      const stored = safeGet(storage, remember.key);
      if (stored && !isExpired(stored)) {
        setVisible(false);
        return;
      }
    }

    if (isSuppressed) {
      setVisible(false);
      return;
    }

    setVisible(true);
  }, [open, remember, isSuppressed, isResetForced]);

  const handleClose = useCallback(() => {
    if (typeof window !== "undefined" && remember?.key) {
      const storage = remember.storage === "local" ? localStorage : sessionStorage;
      safeSet(storage, remember.key, remember.ttlMs);
    }
    setVisible(false);
    onClose?.();
  }, [remember, onClose]);

  // Auto-dismiss management
  useEffect(() => {
    if (!visible || durationMs <= 0) return;
    const timer = setTimeout(handleClose, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, handleClose]);

  // Accessibility: Focus management for screen readers and keyboard users
  useEffect(() => {
    if (visible) {
      const raf = requestAnimationFrame(() => buttonRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Theme-aware Backdrop */}
          <div
            className={`absolute inset-0 backdrop-blur-md transition-colors duration-500
              ${isLight ? "bg-white/40" : "bg-black/80"}`}
            onClick={handleClose}
          />

          {/* Modal Panel */}
          <motion.div
            className={`relative w-full max-w-lg rounded-[2.5rem] p-10 overflow-hidden shadow-2xl border ${T.card} ${T.soft}`}
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
          >
            {/* Dynamic Ambient Glow */}
            <div
              className={`absolute -top-32 -left-32 h-64 w-64 rounded-full blur-[100px] opacity-20 transition-colors duration-700 ${T.accentGrad}`}
            />

            <div className="relative z-10">
              <h2 className={`text-3xl font-bold tracking-tighter mb-4 ${isLight ? "text-zinc-900" : "text-white"}`}>
                {title}
              </h2>
              <p
                className={`text-base leading-relaxed mb-10 font-medium opacity-60 ${isLight ? "text-zinc-800" : "text-zinc-300"}`}
              >
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* CTA - Primary Button */}
                <button
                  ref={buttonRef}
                  onClick={handleClose}
                  className={`flex-1 rounded-2xl py-4 font-bold text-white transition-all active:scale-95 shadow-lg ${T.accentGrad}`}
                >
                  {ctaLabel}
                </button>

                {/* Secondary Button */}
                <button
                  onClick={handleClose}
                  className={`flex-1 rounded-2xl py-4 font-bold transition-all hover:bg-white/5 ${T.link} ${isLight ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** * Storage Utilities - Encapsulated Logic
 */
function safeSet(store: Storage, key: string, ttlMs?: number) {
  try {
    const exp = ttlMs ? Date.now() + ttlMs : undefined;
    store.setItem(key, JSON.stringify({ exp }));
  } catch (e) {
    console.error("[STORAGE] Write failed:", e);
  }
}

function safeGet(store: Storage, key: string): { exp?: number } | null {
  try {
    const item = store.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

function isExpired(stored: { exp?: number }) {
  return stored.exp ? Date.now() > stored.exp : false;
}
