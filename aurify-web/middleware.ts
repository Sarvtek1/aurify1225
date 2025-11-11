import createMiddleware from "next-intl/middleware";
import i18n from "./next-intl.config";

export default createMiddleware(i18n);

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"]
};
