import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/UI/Navbar";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/app/globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

/**
 * Metadata generation remains the same,
 * but ensure it correctly awaits params if needed.
 */

/**
 * Dynamic Metadata Generation
 * Standards: Next.js 16.2+
 * Fixes: metadataBase warning for social previews.
 */
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const isPl = lang === "pl";

  // Professional domain configuration
  const siteUrl = process.env.SITE_URL || "https://pmdev.ovh";

  // Dynamic strings based on current locale
  const title = isPl
    ? "pmdev | Digital Architect & Specjalista Google Workspace"
    : "pmdev | Digital Architect & Google Workspace Specialist";

  const description = isPl
    ? "Bezpieczna automatyzacja w chmurze, profesjonalne workflow IT i wydajne rozwiązania webowe."
    : "Secure cloud automation, professional IT workflows, and high-performance web development.";

  return {
    // FIX: This removes the "localhost:3000" warning and ensures absolute URLs
    metadataBase: new URL(siteUrl),

    title: {
      default: title,
      template: "%s | pmdev",
    },
    description: description,
    keywords: [
      "Google Workspace",
      "Next.js",
      "Automation",
      "IT Consultant",
      "Cloud Architect",
      "Google Apps Script",
      "Business Process Automation",
    ],
    authors: [{ name: "pmdev", url: "https://pmdev.ovh" }],
    icons: {
      icon: "/favicon.svg", // Static asset from /public
    },

    openGraph: {
      title: "pmdev | Digital Architect",
      description: isPl
        ? "Zamieniam chaos w zautomatyzowane procesy biznesowe."
        : "Transforming chaos into automated workflows.",
      url: `${siteUrl}/${lang}`,
      siteName: "pmdev",
      locale: isPl ? "pl_PL" : "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png", // Next.js will now resolve this to https://pmdev.ovh/og-image.png
          width: 1200,
          height: 630,
          alt: "pmdev automation preview",
        },
      ],
    },
    // Canonical links and language alternates for SEO compliance
    alternates: {
      canonical: `https://pmdev.ovh/${lang}`,
      languages: {
        pl: "https://pmdev.ovh/pl",
        en: "https://pmdev.ovh/en",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Root Layout - Professional Fix
 * 1. params must be awaited (Next.js 16.2 standard).
 * 2. suppressHydrationWarning is added to <html> to handle
 * browser extensions or theme injections without crashing.
 */
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>; // Typed as Promise for Next.js 15/16 compatibility
}) {
  // Await params to get the correct language before rendering
  const { lang } = await params;

  return (
    <html
      lang={lang}
      className="scroll-smooth"
      suppressHydrationWarning // Essential for preventing hydration errors on <html> and <body>
    >
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
