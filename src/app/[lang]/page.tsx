import { getDictionary } from "@/lib/get-dictionary";
import PortfolioWithOverlay from "@/components/PortfolioWithOverlay";

/**
 * Server Page Component
 * Standards: Next.js 16.2 Async Params.
 * Comments: English as per technical guidelines.
 */
export default async function Page({ params }: { params: Promise<{ lang: "pl" | "en" }> }) {
  // UNWRAP PARAMS: In Next.js 15+, params is a Promise that must be awaited.
  const { lang } = await params;

  // Fetch dictionary using the awaited language string
  const dict = await getDictionary(lang);

  return (
    <main>
      {/* Pass the dictionary and lang as props. 
        lang is now a plain string ("pl" | "en"). 
      */}
      <PortfolioWithOverlay dict={dict} lang={lang} />
    </main>
  );
}
