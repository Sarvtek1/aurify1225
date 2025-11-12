// aurify-web/app/[locale]/layout.tsx
import type { ReactNode } from "react";
import "../globals.css";

// Pre-generate the only two locales we support
export function generateStaticParams(): Array<{ locale: "en" | "ar" }> {
  return [{ locale: "en" }, { locale: "ar" }];
}

// Optional: keep static metadata — but do not make this file async
export const metadata = {
  title: "Aurify1225",
  description: "UAE-first SaaS for Amazon sellers",
};

// IMPORTANT: Must be synchronous, no Promise return type
export default function LocaleLayout({
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
