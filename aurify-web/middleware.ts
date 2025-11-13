// aurify-web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Default: deny caching for HTML navigations (dynamic pages)
  if (req.headers.get("accept")?.includes("text/html")) {
    res.headers.set("Cache-Control", "private, no-store");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|assets/).*)"]
};
