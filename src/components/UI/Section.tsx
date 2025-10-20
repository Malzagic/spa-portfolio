// src/components/Section.tsx
"use client";

import * as React from "react";
import { motion, easeOut, type MotionProps } from "framer-motion";

/**
 * Shared fade-in settings for sections.
 */
const fade: MotionProps = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: easeOut },
};

type Props = {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Section({ id, title, subtitle, children, className }: Props) {
  return (
    <motion.section
      id={id}
      {...fade}
      className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 ${className ?? ""}`}
    >
      <div className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm md:text-base opacity-70 mt-2 max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </motion.section>
  );
}
