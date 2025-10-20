"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type RememberOpts = {
  /** Storage key to remember that overlay was seen */
  key: string;
  /** Where to store the remember flag (default: "session") */
  storage?: "session" | "local";
  /** Time to live in ms. If omitted, never expires (until user clears storage). */
  ttlMs?: number;
};

type OverlayNoticeProps = {
  open?: boolean;
  durationMs?: number; // auto-dismiss after N ms (0 disables)
  onClose?: () => void;
  theme: {
    card: string;
    accentGrad: string;
    focusRing?: string;
    target?: string;
  };
  title?: string;
  message?: string;
  ctaLabel?: string;
  reduceMotion?: boolean;
  /** Show only if key absent or expired; set key, storage, ttl */
  remember?: RememberOpts;
  /** Optional: query flag to suppress overlay (e.g. ?no-overlay=1) */
  suppressParam?: string;
  /** Optional: query flag to reset memory (e.g. ?reset-overlay=1) */
  resetParam?: string;
};

export default function OverlayNotice({
  open = true,
  durationMs = 7000,
  onClose,
  theme,
  title = "Ta strona jest w budowie",
  message = "Oglądasz wersję demonstracyjną. Część funkcji może być ograniczona.",
  ctaLabel = "Zobacz demo",
  reduceMotion,
  remember,
  suppressParam = "no-overlay",
  resetParam = "reset-overlay",
}: OverlayNoticeProps) {
  const [visible, setVisible] = React.useState(open);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  // Query param overrides (client only)
  const params = React.useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  }, []);
  const suppressed = params?.get(suppressParam) === "1";
  const forceReset = params?.get(resetParam) === "1";

  // Handle remember/read with expiry
  React.useEffect(() => {
    if (!open) return;
    if (typeof window === "undefined") return;

    const storage = remember?.storage === "local" ? window.localStorage : window.sessionStorage;

    if (forceReset && remember?.key) {
      safeRemove(storage, remember.key);
    }

    if (remember?.key) {
      const v = safeGet(storage, remember.key);
      if (v && !isExpired(v)) {
        setVisible(false); // already seen & not expired
        return;
      }
    }

    if (suppressed) {
      setVisible(false); // suppressed by query param
      return;
    }

    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Auto-dismiss timer
  React.useEffect(() => {
    if (!visible || durationMs <= 0) return;
    const t = setTimeout(handleClose, durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, durationMs]);

  // Focus CTA on show
  React.useEffect(() => {
    if (!visible) return;
    const id = requestAnimationFrame(() => buttonRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [visible]);

  // ESC to close
  React.useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey, { passive: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  const prefersReduced = usePrefersReducedMotion();
  const doAnimate = !reduceMotion && !prefersReduced;

  const remKey = remember?.key;
  const remStorage = remember?.storage;
  const remTtl = remember?.ttlMs;

  // stable deps for callback (avoid re-creating when remember object identity changes)
  const handleClose = React.useCallback(() => {
    if (typeof window !== "undefined" && remKey) {
      const storage = remStorage === "local" ? window.localStorage : window.sessionStorage;
      safeSet(storage, remKey, remTtl);
    }
    setVisible(false);
    onClose?.();
  }, [remKey, remStorage, remTtl, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="overlay-title"
          aria-describedby="overlay-desc"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: doAnimate ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: doAnimate ? 0 : 1 }}
          transition={{ duration: doAnimate ? 0.2 : 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            className={`relative mx-4 w-full max-w-lg rounded-3xl p-6 ${theme.card}`}
            initial={{ y: doAnimate ? 12 : 0, opacity: doAnimate ? 0 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: doAnimate ? 12 : 0, opacity: doAnimate ? 0 : 1 }}
            transition={{ duration: doAnimate ? 0.25 : 0 }}
          >
            <div className={`absolute -inset-x-6 -top-8 h-24 rounded-3xl blur-3xl opacity-40 ${theme.accentGrad}`} />
            <div className="relative">
              <h2 id="overlay-title" className="text-xl font-semibold tracking-tight">
                {title}
              </h2>
              <p id="overlay-desc" className="mt-2 opacity-80">
                {message}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  ref={buttonRef}
                  type="button"
                  onClick={handleClose}
                  className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium text-white ${
                    theme.accentGrad
                  } hover:opacity-95 transition ${theme.focusRing ?? ""} ${theme.target ?? ""}`}
                >
                  {ctaLabel}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 font-medium hover:opacity-90 transition ${
                    theme.card
                  } ${theme.focusRing ?? ""} ${theme.target ?? ""}`}
                >
                  Close
                </button>
              </div>
              <p className="sr-only">Naciśnij Escape, aby zamknąć ten komunikat.</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** JSON helpers with expiry */
type Stored = { exp?: number }; // Unix ms
function safeSet(store: Storage, key: string, ttlMs?: number) {
  try {
    const exp = typeof ttlMs === "number" && ttlMs > 0 ? Date.now() + ttlMs : undefined;
    store.setItem(key, JSON.stringify({ exp }));
  } catch {}
}
function safeGet(store: Storage, key: string): Stored | null {
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as Stored;
  } catch {
    return null;
  }
}
function safeRemove(store: Storage, key: string) {
  try {
    store.removeItem(key);
  } catch {}
}
function isExpired(v: Stored) {
  return typeof v?.exp === "number" ? Date.now() > v.exp : false;
}

/** Hook: prefers-reduced-motion */
function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return prefersReduced;
}
