import type { ReactNode } from "react";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export const metadata = {
  title: "Aurify1225",
  description: "UAE-first SaaS for Amazon sellers"
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: "en" | "ar" };
}) {
  const { locale } = params;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}
