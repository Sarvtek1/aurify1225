import '../globals.css';
import type { ReactNode } from 'react';
import { localeDirection, type Locale } from '../../i18n/locales';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }> | { locale: Locale };
}) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const dir = localeDirection[locale as Locale] ?? 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head />
      <body>{children}</body>
    </html>
  );
}