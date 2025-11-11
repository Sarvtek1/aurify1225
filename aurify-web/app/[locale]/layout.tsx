// app/[locale]/layout.tsx
import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {locales, type Locale, localeDirection} from '../../i18n/locales';
import getRequestConfig from '../../i18n/request';
import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export const metadata: Metadata = {
  title: 'Aurify1225',
  description: 'UAE-first SaaS for Amazon sellers'
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: {locale: Locale};
}) {
  // resolve messages via our request config (handles fallback)
  const {locale, messages} = await getRequestConfig({locale: params.locale});

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
