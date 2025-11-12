export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Map common BCP-47 tags to supported locales */
const map: Record<string, Locale> = {
  en: 'en',
  'en-US': 'en',
  'en-GB': 'en',
  ar: 'ar',
  'ar-AE': 'ar',
  'ar-SA': 'ar'
};

export function mapToSupported(code: string | undefined): Locale {
  if (!code) return DEFAULT_LOCALE;
  if (map[code]) return map[code];
  const primary = code.split('-')[0]; // e.g. "en-US" -> "en"
  return map[primary] ?? DEFAULT_LOCALE;
}
