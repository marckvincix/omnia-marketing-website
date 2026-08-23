import { translateTexts } from "./deepl";
import type { Locale } from "./locales";

/**
 * Traduce tutti i campi di testo di un contenuto (es. un articolo del blog) in una
 * lingua target con **una sola chiamata DeepL** (i campi vuoti/assenti non vengono
 * inviati), per restare efficienti sulla quota mensile gratuita.
 */
export async function translateEntityFields<T extends Record<string, string | null | undefined>>(
  fields: T,
  targetLocale: Exclude<Locale, "it">,
): Promise<Partial<Record<keyof T, string>>> {
  const entries = Object.entries(fields).filter(([, value]) => value != null && value !== "") as [
    keyof T,
    string,
  ][];
  if (entries.length === 0) return {};

  const translated = await translateTexts(
    entries.map(([, value]) => value),
    targetLocale,
  );

  const result: Partial<Record<keyof T, string>> = {};
  entries.forEach(([key], i) => {
    result[key] = translated[i];
  });
  return result;
}
