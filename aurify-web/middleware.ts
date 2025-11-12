import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, mapToSupported } from './i18n/locales';

function parseAcceptLanguage(headerVal: string | null): string[] {
  if (!headerVal) return [];
  return headerVal
    .split(',')
    .map((part) => {
      const [tagRaw, ...params] = part.trim().split(';');
      const tag = tagRaw.trim();
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number(qParam.split('=')[1]) : 1;
      return { tag, q: Number.isFinite(q) ? q : 1 };
    })
    .filter((x) => !!x.tag)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Ignore Next internals, static assets, API routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/assets') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|css|js|txt|map)$/)
  ) {
    return NextResponse.next();
  }

  // If path already has /en or /ar, let it through
  const alreadyLocalized = SUPPORTED_LOCALES.some(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );
  if (alreadyLocalized) {
    return NextResponse.next();
  }

  // Detect preferred locale
  const ranked = parseAcceptLanguage(req.headers.get('accept-language'));
  let chosen = DEFAULT_LOCALE;
  for (const tag of ranked) {
    const mapped = mapToSupported(tag);
    if (SUPPORTED_LOCALES.includes(mapped)) {
      chosen = mapped;
      break;
    }
  }

  // Redirect to /<locale>/<original-path>
  const url = req.nextUrl.clone();
  url.pathname = `/${chosen}${pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|assets).*)'],
};
