import type { ReactNode } from "react";
import "../globals.css";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
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
  params: { locale: "en" | "ar" };
}) {
  const { locale } = params;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        style={{
          fontFamily:
            locale === "ar"
              ? "Tajawal, system-ui, sans-serif"
              : "system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
