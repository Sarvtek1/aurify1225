export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** Map BCP-47 language codes to our supported locales */
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
  // exact match
  if (map[code]) return map[code];
  // try primary subtag (e.g., en-US -> en)
  const primary = code.split('-')[0];
  if (map[primary]) return map[primary];
  return DEFAULT_LOCALE;
}
