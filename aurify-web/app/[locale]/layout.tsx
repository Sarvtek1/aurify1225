import type { ReactNode } from 'react';
import '../globals.css';
import type { Locale } from '../../i18n/locales';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: Locale }> | { locale: Locale };
}) {
  const { locale } = await params;
  const isRTL = locale === 'ar';
  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
