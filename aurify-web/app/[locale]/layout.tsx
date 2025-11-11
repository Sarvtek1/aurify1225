// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import "../globals.css";
import "@fontsource/tajawal";

import { locales, type Locale, localeDirection } from "../../i18n/locales";

// Pre-generate /en and /ar
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Aurify1225",
  description: "UAE-first SaaS for Amazon sellers",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  // Tell next-intl which locale this request is for
  setRequestLocale(locale);

  // Load messages for this locale
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} dir={localeDirection[locale]}>
      <body className={locale === "ar" ? "font-[Tajawal] antialiased" : "font-sans antialiased"}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
