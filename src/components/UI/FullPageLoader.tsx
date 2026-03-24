// /**
//  * Professional Branding Loader for pmdev.ovh
//  * Minimalist, high-performance, and brand-consistent.
//  * Features: Sky Blue & Amber Gold sync.
//  */

// export default function FullPageLoader() {
//   return (
//     <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-slate-950">
//       <div className="relative flex flex-col items-center gap-6">
//         {/* Animated Spinner - Dual Tone */}
//         <div className="relative h-20 w-20">
//           {/* Static outer ring */}
//           <div className="absolute inset-0 rounded-2xl border-2 border-sky-500/10" />

//           {/* Sky Blue Spinning Ring */}
//           <div
//             className="absolute inset-0 animate-spin rounded-2xl border-t-2 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
//             style={{ animationDuration: "0.8s" }}
//           />

//           {/* Amber Gold Pulse Center */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <div className="h-2 w-2 animate-ping rounded-full bg-amber-400 shadow-[0_0_15px_#fbbf24]" />
//             <div className="absolute h-1.5 w-1.5 rounded-full bg-amber-500" />
//           </div>
//         </div>

//         {/* Branding Text with Terminal Cursor Effect */}
//         <div className="flex flex-col items-center gap-1">
//           <div className="flex items-center gap-1.5 font-mono text-xs font-medium tracking-[0.3em] text-white/40">
//             <span>SYSTEM</span>
//             <span className="text-amber-500/50">LOADING</span>
//           </div>

//           <div className="flex items-center gap-1 font-sans text-xl font-bold tracking-tight text-white">
//             <span>pm</span>
//             <span className="text-sky-400">dev</span>
//             <span className="ml-0.5 h-5 w-1 animate-pulse bg-amber-400" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Professional Dynamic Branding Loader
 * Synchronized with global ThemeContext.
 * Standards: Next.js 16.2 Client Component, Theme-aware logic.
 */
export default function FullPageLoader() {
  const { themeConfig: T, theme } = useTheme();

  // Determine a safe background: Absolute black for dark themes to avoid "blueish" slate-950.
  // Light theme gets its standard light background.
  const isLight = theme === "lightClean";
  const bgColor = isLight ? T.page : "bg-black";

  // Extract base color for the pulse/spinner (e.g., from 'text-amber-400' -> 'amber-400')
  const accentBase = T.accentText.replace("text-", "");

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center ${bgColor} transition-colors duration-500`}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Dynamic Spinner */}
        <div className="relative h-24 w-24">
          {/* Static Background Ring */}
          <div className={`absolute inset-0 rounded-3xl border-2 ${isLight ? "border-black/5" : "border-white/5"}`} />

          {/* Theme-based Spinning Ring */}
          <div
            className={`absolute inset-0 animate-spin rounded-3xl border-t-2 ${T.accentText} shadow-[0_0_20px_rgba(0,0,0,0.1)]`}
            style={{ animationDuration: "0.9s" }}
          />

          {/* Theme-based Pulse Center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`h-3 w-3 animate-ping rounded-full ${T.accentText} opacity-75`} />
            <div className={`absolute h-2 w-2 rounded-full ${T.accentText} shadow-[0_0_15px_currentColor]`} />
          </div>
        </div>

        {/* Dynamic Branding Text */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px] font-medium tracking-[0.4em] opacity-40">
            <span className={isLight ? "text-black" : "text-white"}>INITIALIZING</span>
            <span className={T.accentText}>CORE</span>
          </div>

          <div
            className={`flex items-center gap-1 font-sans text-2xl font-bold tracking-tighter ${isLight ? "text-black" : "text-white"}`}
          >
            <span>pm</span>
            <span className={T.accentText}>dev</span>
            {/* Blinking cursor using theme accent */}
            <span
              className={`ml-1 h-6 w-1 animate-pulse ${T.accentText === "text-zinc-900" ? "bg-zinc-900" : T.accentText.replace("text-", "bg-")}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
