"use client";

/**
 * Professional Theme Controller
 * Replaces native select with a custom, animated UI.
 * Standards: Framer Motion animations, Theme-aware, Accessible.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuPalette, LuCheck, LuSun, LuMoon, LuSparkles } from "react-icons/lu";
import { useTheme } from "@/context/ThemeContext";
import { THEMES, type ThemeKey } from "@/types/portfolio-theme";

export default function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, themeConfig: T } = useTheme();

  // Mapping icons to theme keys for visual guidance
  const themeIcons: Record<ThemeKey, React.ReactNode> = {
    darkGold: <LuSparkles className="text-amber-400" />,
    midnightSlate: <LuMoon className="text-indigo-400" />,
    lightClean: <LuSun className="text-zinc-600" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-100 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`flex flex-col gap-2 p-2 rounded-2xl border backdrop-blur-xl shadow-2xl ${T.card}`}
          >
            {Object.entries(THEMES).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setTheme(key as ThemeKey);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between gap-4 px-4 py-3 rounded-xl transition-all group
                  ${theme === key ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{themeIcons[key as ThemeKey]}</span>
                  <span
                    className={`text-xs font-bold tracking-wide ${theme === key ? "opacity-100" : "opacity-50 group-hover:opacity-80"}`}
                  >
                    {config.name}
                  </span>
                </div>
                {theme === key && (
                  <motion.div layoutId="activeCheck">
                    <LuCheck className={T.accentText} size={14} />
                  </motion.div>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl backdrop-blur-md transition-all 
          ${T.select} ${T.ring} ${isOpen ? "rotate-90" : "rotate-0"}`}
        aria-label="Toggle theme menu"
      >
        {isOpen ? <LuPalette size={24} /> : themeIcons[theme]}
      </motion.button>
    </div>
  );
}
