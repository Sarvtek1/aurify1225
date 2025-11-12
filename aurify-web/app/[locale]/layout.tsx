import type { ReactNode } from "react";
import "../globals.css";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export const metadata = {
  title: "Aurify1225",
  description: "UAE-first SaaS for Amazon sellers",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === "ar" ? "ar" : "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
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
