import '../globals.css';
import type { ReactNode } from 'react';
import { localeDirection, type Locale } from '../../i18n/locales';

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  const dir = localeDirection[locale] ?? 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head />
      <body>{children}</body>
    </html>
  );
}