import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import "../globals.css";
import "@fontsource/tajawal";
import { locales, type Locale, localeDirection } from "../../i18n/locales";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata = {
  title: "Aurify1225",
  description: "UAE-first SaaS for Amazon sellers",
};

// ✅ Temporary Next.js 16.0 typing workaround — cast params as any
export default function LocaleLayout({ children, params }: any) {
  const { locale } = params as { locale: Locale };
  setRequestLocale(locale);

  const messages = require(`../../messages/${locale}.json`);

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
