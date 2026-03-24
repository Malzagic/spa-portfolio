"use client";

/**
 * Section Component - Professional UI Base
 * This version separates Motion logic from HTML attributes to prevent DOM pollution.
 * Uses tailwind-merge pattern for safe class manipulation.
 */

import * as React from "react";
import { motion, easeOut, type Variants } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// Animation variants defined as constants for performance (Optimal)
const SECTION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function Section({ id, title, subtitle, children, className = "", ...rest }: SectionProps) {
  const { themeConfig: T } = useTheme();

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`relative w-full overflow-hidden py-20 md:py-28 ${className}`}
      {...rest}
    >
      <motion.div
        variants={SECTION_VARIANTS}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-6xl mx-auto px-6 md:px-8"
      >
        {/* Header Section */}
        <header className="mb-12 md:mb-20">
          <motion.div className={`h-1.5 w-12 rounded-full mb-8 ${T.accentGrad}`} layoutId={`${id}-accent`} />

          <h2 id={`${id}-heading`} className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {title}
          </h2>

          {subtitle && <p className="mt-6 text-lg md:text-xl opacity-60 max-w-2xl leading-relaxed">{subtitle}</p>}
        </header>

        {/* Content Area */}
        <div className="relative w-full">{children}</div>
      </motion.div>
    </section>
  );
}
