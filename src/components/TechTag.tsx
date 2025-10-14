// src/components/TechTag.tsx
"use client";

import * as React from "react";

/** Small reusable technology badge. */
export default function TechTag({ label }: { label: string }) {
  return <span className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-xs">{label}</span>;
}
