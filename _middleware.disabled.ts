// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // You can add localeDetection: false if you want to always force /en
});

export const config = {
  // Match all paths except Next internals and static assets
  matcher: ['/((?!_next|.*\\..*).*)']
};
