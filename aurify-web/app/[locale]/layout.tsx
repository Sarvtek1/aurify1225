// app/[locale]/layout.tsx
import type {ReactNode} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import '../globals.css';
import '@fontsource/tajawal';
import {locales, type Locale, localeDirection, defaultLocale} from '../../i18n/locales';

// Pre-generate /en and /ar
export function generateStaticParams() {
  return locales.map((l) => ({locale: l}));
}

export const metadata = {
  title: 'Aurify1225',
  description: 'UAE-first SaaS for Amazon sellers'
};

function coerceLocale(input?: string): Locale {
  return (locales as readonly string[]).includes(input ?? '')
    ? (input as Locale)
    : defaultLocale;
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: {locale?: string};
}) {
  const locale = coerceLocale(params?.locale);
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
