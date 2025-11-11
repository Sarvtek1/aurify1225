// app/[locale]/page.tsx
"use client";

import {useTranslations} from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");
  return (
    <main style={{padding: 24}}>
      <h1>{t("title")}</h1>
      <p>{t("subtitle")}</p>
    </main>
  );
}
