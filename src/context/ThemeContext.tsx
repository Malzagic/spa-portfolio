"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { THEMES, type ThemeKey } from "@/types/portfolio-theme";

type ThemeContextType = {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
  themeConfig: (typeof THEMES)[ThemeKey];
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>("darkGold");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pmdev-theme") as ThemeKey;
    if (saved && THEMES[saved]) {
      setThemeState(saved);
    }
    setMounted(true);
  }, []);

  const setTheme = (newTheme: ThemeKey) => {
    setThemeState(newTheme);
    localStorage.setItem("pmdev-theme", newTheme);
  };

  const value = {
    theme,
    setTheme,
    themeConfig: THEMES[theme],
  };

  // IMPORTANT: The Provider must ALWAYS wrap children.
  // We use opacity or a fragment to handle the mounting flicker.
  return (
    <ThemeContext.Provider value={value}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
