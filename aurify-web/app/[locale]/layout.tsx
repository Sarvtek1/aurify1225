// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { setRequestLocale, getMessages } from "next-intl/server";

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

// ✅ Make this a *sync* component — no async/await at top level
export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  // Dynamically require messages (not awaited)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
