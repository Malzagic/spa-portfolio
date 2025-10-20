"use client";

import React from "react";
import OverlayNotice from "@/components/OverlayNotice";
import Portfolio from "@/components/Portfolio";
import { THEMES } from "@/types/portfolio-theme";
import { useSearchParams } from "next/navigation";

/**
 * Wrapper component for Portfolio that adds a temporary demo overlay on initial visit.
 * The overlay is remembered for a defined period (e.g., 14 days) using localStorage.
 * Query parameters allow disabling or resetting the overlay (`?no-overlay=1`, `?reset-overlay=1`).
 */
export default function PortfolioWithOverlay() {
  const search = useSearchParams();
  const disable = search?.get("no-overlay") === "1";
  const T = THEMES.darkGold;

  return (
    <div className="relative">
      {!disable && (
        <OverlayNotice
          open
          durationMs={7000}
          // Remember user visit for 14 days (stored in localStorage)
          remember={{ key: "overlay_demo_seen", storage: "local", ttlMs: 1000 * 60 * 60 * 24 * 14 }}
          // Optional query params for control: disable or reset overlay
          suppressParam="no-overlay"
          resetParam="reset-overlay"
          theme={{
            card: T.card,
            accentGrad: T.accentGrad,
            focusRing: "",
            target: "min-w-6 min-h-6 inline-flex items-center justify-center",
          }}
          title="This website is under construction"
          message="You are viewing a public demo. Some features may be limited."
          ctaLabel="View demo"
        />
      )}
      <Portfolio />
    </div>
  );
}
