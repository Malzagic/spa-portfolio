"use client";

/**
 * OverlayNotice Component - Professional Entry Gate
 * Handles demo-mode notifications with persistence and accessibility.
 * Principles: English-only UI/Comments, Context-integrated, A11y compliant.
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
  const { themeConfig: T } = useTheme();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Detect URL overrides for development/debugging
  const params = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  }, []);

  const isSuppressed = params?.get(suppressParam) === "1";
  const isResetForced = params?.get(resetParam) === "1";

  /**
   * Initialization logic
   * Checks persistence and URL flags to determine visibility
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

  // Auto-dismiss logic
  useEffect(() => {
    if (!visible || durationMs <= 0) return;
    const timer = setTimeout(handleClose, durationMs);
    return () => clearTimeout(timer);
  }, [visible, durationMs, handleClose]);

  // Accessibility: Focus management
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
          {/* Backdrop with Glassmorphism */}
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={handleClose} />

          {/* Modal Panel */}
          <motion.div
            className={`relative w-full max-w-lg rounded-3xl p-8 overflow-hidden border border-white/10 ${T.card}`}
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Theme-driven accent glow */}
            <div
              className={`absolute -top-24 -left-24 h-48 w-48 rounded-full blur-[80px] opacity-20 ${T.accentGrad}`}
            />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-3">{title}</h2>
              <p className="text-slate-400 leading-relaxed mb-8">{message}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  ref={buttonRef}
                  onClick={handleClose}
                  className={`flex-1 rounded-2xl py-4 font-bold text-white transition-all active:scale-95 shadow-lg ${T.accentGrad} ${T.soft}`}
                >
                  {ctaLabel}
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 rounded-2xl py-4 font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** * Storage Utilities
 */
function safeSet(store: Storage, key: string, ttlMs?: number) {
  try {
    const exp = ttlMs ? Date.now() + ttlMs : undefined;
    store.setItem(key, JSON.stringify({ exp }));
  } catch (e) {
    console.error("Storage write failed", e);
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
