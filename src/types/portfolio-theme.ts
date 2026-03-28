/**
 * Global Theme Configuration
 * Standards: Refined Light Mode for high accessibility (WCAG compliant).
 * Improvements: Better card separation, solid link colors, deeper accents.
 */

export const THEMES = {
  darkGold: {
    name: "Dark Gold",
    page: "bg-zinc-950 text-zinc-100",
    card: "bg-zinc-900/60 backdrop-blur-md border border-zinc-800",
    tag: "bg-zinc-800/50 border-zinc-700 text-amber-400",
    select: "bg-zinc-900 text-zinc-100",
    ring: "ring-amber-500/30",
    accentText: "text-amber-400",
    accentGrad: "bg-gradient-to-tr from-yellow-500 to-amber-600",
    soft: "shadow-[0_0_60px_rgba(251,191,36,0.15)]",
    link: "text-zinc-400 hover:text-amber-400",
  },
  midnightSlate: {
    name: "Midnight Slate",
    page: "bg-slate-950 text-slate-100",
    card: "bg-slate-900/60 backdrop-blur-md border border-slate-800",
    tag: "bg-slate-800/50 border-slate-700 text-indigo-300",
    select: "bg-slate-900 text-slate-100",
    ring: "ring-indigo-400/30",
    accentText: "text-indigo-300",
    accentGrad: "bg-gradient-to-tr from-indigo-500 to-violet-600",
    soft: "shadow-[0_0_60px_rgba(99,102,241,0.15)]",
    link: "text-slate-400 hover:text-indigo-300",
  },
  lightClean: {
    name: "Light Clean",
    // IMPROVEMENT: Use a very subtle off-white for the page to make white cards "pop"
    page: "bg-zinc-50 text-zinc-900",
    // IMPROVEMENT: Solid white cards with a more defined border
    card: "bg-white border-zinc-200 shadow-sm",
    // IMPROVEMENT: High contrast tags with darker text for readability
    tag: "bg-zinc-100 border-zinc-300 text-zinc-800 font-semibold",
    select: "bg-white text-zinc-900 border-zinc-300",
    ring: "ring-zinc-400/50",
    accentText: "text-zinc-900",
    accentGrad: "bg-gradient-to-tr from-zinc-900 to-zinc-600",
    // IMPROVEMENT: Darker shadow for better depth on light backgrounds
    soft: "shadow-[0_10px_40px_rgba(0,0,0,0.08)]",
    // IMPROVEMENT: Base color zinc-600 is much more readable than 500
    link: "text-zinc-600 hover:text-zinc-950 font-medium",
  },
} as const;

export type ThemeKey = keyof typeof THEMES;
