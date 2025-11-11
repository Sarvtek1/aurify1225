import createMiddleware from 'next-intl/middleware';
import i18n from './next-intl.config';

export default createMiddleware(i18n);

// Keep your matcher (or adjust to your routes)
export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
