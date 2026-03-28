/**
 * src/proxy.ts
 * Standards: Next.js 16.2+ "Proxy" Convention.
 * This replaces the deprecated middleware.ts.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pl", "en"];
const defaultLocale = "pl";

// EXPORT NAME: Must be 'proxy' for the new convention
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip if it's a static file or internal Next.js path
  if (pathname.startsWith("/_next") || pathname.includes(".") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Check if locale is already present
  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) return NextResponse.next();

  // 3. Rewrite to default locale (Internal Proxying)
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.rewrite(url);
}

/**
 * Proxy Configuration
 * Standard matcher for i18n routing.
 */
export const config = {
  matcher: [
    // Exclude static assets and api routes
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|og-image.png|cv.pdf).*)",
  ],
};
