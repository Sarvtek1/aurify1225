export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: "en" | "ar" };
}) {
  const dir = params.locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={params.locale} dir={dir}>
      <body>{children}</body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}
