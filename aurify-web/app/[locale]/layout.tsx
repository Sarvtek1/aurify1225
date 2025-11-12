import type { ReactNode } from 'react';
import '../globals.css';

export default function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: 'en' | 'ar' };
}) {
  const isRTL = params.locale === 'ar';
  return (
    <html lang={params.locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}
