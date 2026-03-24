/**
 * Next.js Proxy (formerly Middleware)
 * Handles i18n routing and URL rewrites at the Edge.
 * Standards: Next.js 16.2+ "Proxy" convention.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["pl", "en"];
const defaultLocale = "pl";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path already has a supported locale
  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect to default locale if missing
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;

  // Use rewrite instead of redirect for better SEO (URL stays clean)
  return NextResponse.rewrite(request.nextUrl);
}

/**
 * Proxy Configuration
 * Excludes internal Next.js assets and public static files.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, favicon.svg, og-image.png, cv.pdf (static assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|og-image.png|cv.pdf).*)",
  ],
};
