import type { ReactNode } from 'react';

/** Generate only known locales at build time */
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

type Locale = 'en' | 'ar';

type LayoutProps = {
  children: ReactNode;
  params: { locale: Locale };
};

/** NOTE:
 * - Do NOT make this function async.
 * - Do NOT type params as Promise<...>.
 * - Keep locale typed as the union: 'en' | 'ar'.
 */
export default function LocaleLayout({ children, params }: LayoutProps) {
  const dir = params.locale === 'ar' ? 'rtl' : 'ltr';
  const lang = params.locale;

  return (
    <html lang={lang} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
