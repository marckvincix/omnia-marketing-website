import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/locales";

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // L'italiano (lingua di default) resta senza prefisso nell'URL — non tocca
  // nessuna delle URL già indicizzate da Google dopo il lavoro SEO fatto sul sito.
  // Le altre lingue vivono sotto /en, /de, /ar ecc.
  localePrefix: "as-needed",
});
