// aurify-web/i18n/request.ts
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is never undefined (default to English)
  const currentLocale = locale || "en";

  const messages = (await import(`../messages/${currentLocale}.json`)).default;

  return {
    locale: currentLocale,
    messages,
  };
});
