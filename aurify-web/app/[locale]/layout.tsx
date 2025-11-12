import type { ReactNode } from 'react';
import '../globals.css';
// Load Tajawal font for Arabic pages (installed via @fontsource/tajawal)
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/700.css';
import type { Locale } from '../../i18n/locales';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Use a broad string type for params to satisfy Next.js generated types
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const rawParams = await params;
  const locale = rawParams.locale as Locale;
  const isRTL = locale === 'ar';
  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
