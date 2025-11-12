// app/[locale]/layout.tsx
import type { ReactNode } from 'react';
import '../globals.css';
import { locales, type Locale, localeDirection } from '../../i18n/locales';

// Pre-generate /en and /ar routes
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale }; // <-- plain object, not Promise
}) {
  const { locale } = params;

  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body>{children}</body>
    </html>
  );
}
