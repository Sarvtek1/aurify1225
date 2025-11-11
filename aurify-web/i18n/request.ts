// i18n/request.ts
import {getRequestConfig, type GetRequestConfigParams} from 'next-intl/server';
import {defaultLocale, locales, type Locale} from './locales';

function coerceLocale(input?: string): Locale {
  return (locales as readonly string[]).includes(input ?? '')
    ? (input as Locale)
    : defaultLocale;
}

export default getRequestConfig(async (params: GetRequestConfigParams) => {
  const l = coerceLocale(params.locale);
  const messages = (await import(`../messages/${l}.json`)).default;
  return {locale: l, messages};
});
