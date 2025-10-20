// app/page.tsx (server component)
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const PortfolioWithOverlay = dynamic(() => import("@/components/PortfolioWithOverlay"));

export default function Page() {
  return (
    <Suspense fallback={<div>Ładowanie…</div>}>
      <PortfolioWithOverlay />
    </Suspense>
  );
}
