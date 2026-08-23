export const LOCALES = ["it", "en", "de", "es", "ru", "zh", "ja", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "it";

// Lingue diverse dall'italiano: quelle su cui gira la traduzione automatica DeepL
// (content nel DB, cataloghi messaggi statici).
export const TARGET_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

export const RTL_LOCALES: Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale as Locale);
}

export const LOCALE_META: Record<Locale, { label: string; flag: string }> = {
  it: { label: "Italiano", flag: "🇮🇹" },
  en: { label: "English", flag: "🇬🇧" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  es: { label: "Español", flag: "🇪🇸" },
  ru: { label: "Русский", flag: "🇷🇺" },
  zh: { label: "中文", flag: "🇨🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ar: { label: "العربية", flag: "🇸🇦" },
};

// Codice locale in stile Open Graph (og:locale), usato nei metadata di ogni pagina.
export const OG_LOCALE: Record<Locale, string> = {
  it: "it_IT",
  en: "en_US",
  de: "de_DE",
  es: "es_ES",
  ru: "ru_RU",
  zh: "zh_CN",
  ja: "ja_JP",
  ar: "ar_SA",
};

// Codici lingua target attesi dall'API DeepL (l'inglese richiede una variante
// specifica come target, non basta "EN"; le altre coincidono con l'ISO a due lettere).
export const DEEPL_TARGET_CODE: Record<Exclude<Locale, "it">, string> = {
  en: "EN-US",
  de: "DE",
  es: "ES",
  ru: "RU",
  zh: "ZH",
  ja: "JA",
  ar: "AR",
};
