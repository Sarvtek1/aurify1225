import {NextIntlClientProvider} from "next-intl";
import {getMessages} from "next-intl/server";
import type {ReactNode} from "react";
import "../globals.css";

type Locale = "en" | "ar";
const locales: Locale[] = ["en", "ar"] as const;
const localeDirection: Record<Locale, "ltr" | "rtl"> = {en: "ltr", ar: "rtl"};

export function generateStaticParams() {
  return locales.map((l) => ({locale: l}));
}

export const metadata = {
  title: "Aurify1225",
  description: "UAE-first SaaS for Amazon sellers"
};

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{locale: Locale}>;
}) {
  const {children} = props;
  const {locale} = await props.params;

  const messages = await getMessages();

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
