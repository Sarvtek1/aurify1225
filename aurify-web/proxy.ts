// proxy.ts (Next.js 16+ replacement for middleware.ts)
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED = ["en", "ar"] as const;
type Locale = (typeof SUPPORTED)[number];

function pickLocale(header: string | null): Locale {
  if (!header) return "en";
  // very lightweight detection
  const h = header.toLowerCase();
  if (h.includes("ar")) return "ar";
  return "en";
}

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // 1) Skip Next internals, static assets, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2) If path already has a supported locale (/en, /ar), continue
  const alreadyLocalized = SUPPORTED.some(
    (lc) => pathname === `/${lc}` || pathname.startsWith(`/${lc}/`)
  );
  if (alreadyLocalized) {
    const res = NextResponse.next();
    res.headers.set("Vary", "Accept-Language");
    return res;
  }

  // 3) Choose best locale & redirect
  const locale = pickLocale(req.headers.get("accept-language"));
  const redirectTo = `/${locale}${pathname === "/" ? "" : pathname}`;

  const res = NextResponse.redirect(new URL(redirectTo, url));
  // help caches/CDNs vary correctly by language
  res.headers.set("Vary", "Accept-Language");
  return res;
}
