// src/components/portfolio-theme.ts
export const THEMES = {
  darkGold: {
    name: "Dark Gold",
    page: "bg-zinc-950 text-zinc-100",
    card: "bg-zinc-900/60 backdrop-blur border border-zinc-800",
    select: "bg-zinc-900",
    ring: "ring-amber-500/30",
    accentText: "text-amber-400",
    accentGrad: "bg-gradient-to-tr from-yellow-500 to-amber-600",
    soft: "shadow-[0_0_60px_rgba(251,191,36,0.15)]",
    link: "hover:text-amber-400",
  },
  lightClean: {
    name: "Light Clean",
    page: "bg-white text-zinc-900",
    card: "bg-white/80 backdrop-blur border border-zinc-200",
    select: "bg-white",
    ring: "ring-zinc-300",
    accentText: "text-zinc-900",
    accentGrad: "bg-gradient-to-tr from-zinc-900 to-zinc-700",
    soft: "shadow-[0_0_50px_rgba(0,0,0,0.06)]",
    link: "hover:text-zinc-900/80",
  },
  midnightSlate: {
    name: "Midnight Slate",
    page: "bg-slate-950 text-slate-100",
    card: "bg-slate-900/60 backdrop-blur border border-slate-800",
    select: "bg-slate-900",
    ring: "ring-indigo-400/30",
    accentText: "text-indigo-300",
    accentGrad: "bg-gradient-to-tr from-indigo-500 to-violet-600",
    soft: "shadow-[0_0_60px_rgba(99,102,241,0.15)]",
    link: "hover:text-indigo-300",
  },
} as const;

export type ThemeKey = keyof typeof THEMES;
