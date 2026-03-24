"use client";

/**
 * PortfolioWithOverlay Component
 * Wraps the main Portfolio with a demo notice.
 * Now synchronized with the global ThemeContext.
 */

import React from "react";
import OverlayNotice from "@/components/OverlayNotice";
import Portfolio from "@/components/Portfolio";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext"; // Import our new hook
import { I18nProps } from "@/types/i18n"; // Import our new types

export default function PortfolioWithOverlay({ dict, lang }: I18nProps) {
  const search = useSearchParams();
  const disable = search?.get("no-overlay") === "1";

  // Get the active theme config (T) from global context
  const { themeConfig: T } = useTheme();

  // Safety check: If theme is not yet loaded (during SSR), don't render properties
  if (!T) return null;

  return (
    <div className="relative">
      {!disable && (
        <OverlayNotice
          open
          durationMs={7000}
          // Remember user visit for 14 days
          remember={{
            key: "overlay_demo_seen",
            storage: "local",
            ttlMs: 1000 * 60 * 60 * 24 * 14,
          }}
          suppressParam="no-overlay"
          resetParam="reset-overlay"
          title="This website is under construction"
          message="You are viewing a public demo. Some features may be limited."
          ctaLabel="View demo"
        />
      )}
      <Portfolio dict={dict} lang={lang} />
    </div>
  );
}
