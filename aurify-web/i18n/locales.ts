// i18n/locales.ts
export const locales = ["en", "ar"] as const;
export type Locale = typeof locales[number];

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};
