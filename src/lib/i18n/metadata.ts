import { getPathname } from "@/i18n/navigation";
import { LOCALES, DEFAULT_LOCALE } from "./locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Costruisce canonical + hreflang per una pagina pubblica, in ogni lingua disponibile
 * più x-default (punta alla versione italiana, lingua di default del sito). `href` è il
 * percorso "neutro" della pagina, es. "/blog" o { pathname: "/progetti/[slug]", params: { slug } }.
 */
export function buildAlternates(href: Parameters<typeof getPathname>[0]["href"], locale: string) {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = getPathname({ href, locale: l });
  }
  languages["x-default"] = getPathname({ href, locale: DEFAULT_LOCALE });

  return {
    canonical: getPathname({ href, locale }),
    languages,
  };
}

export { SITE_URL };
