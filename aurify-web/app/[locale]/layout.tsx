// app/[locale]/layout.tsx
import type {LayoutProps} from 'next';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import '../globals.css';
import '@fontsource/tajawal';

import {locales, type Locale, localeDirection, defaultLocale} from '../../i18n/locales';

// Prebuild both locales so SSG doesn’t ever pass an undefined locale.
export function generateStaticParams() {
  return locales.map((l) => ({locale: l}));
}

export const metadata = {
  title: 'Aurify1225',
  description: 'UAE-first SaaS for Amazon sellers'
};

// Helper to coerce unknown strings into our Locale union
function coerceLocale(input: string): Locale {
  return (locales as readonly string[]).includes(input) ? (input as Locale) : defaultLocale;
}

// NOTE: Do NOT make this async just to await params; params is NOT a Promise.
// It’s fine to be async because we await getMessages().
export default async function LocaleLayout({children, params}: LayoutProps<'/[locale]'>) {
  const raw = params.locale;          // <- not a Promise
  const locale = coerceLocale(raw);   // narrow to our Locale union

  // next-intl v4: fetch messages for the active locale (set by middleware)
  const messages = await getMessages();

  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body className={locale === 'ar' ? 'font-[Tajawal] antialiased' : 'font-sans antialiased'}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
