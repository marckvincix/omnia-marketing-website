import { DEEPL_TARGET_CODE, type Locale } from "./locales";

const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";
const DEEPL_USAGE_URL = "https://api-free.deepl.com/v2/usage";

export class DeepLQuotaExceededError extends Error {
  constructor() {
    super("Quota mensile DeepL esaurita (HTTP 456).");
    this.name = "DeepLQuotaExceededError";
  }
}

function getApiKey(): string {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error("DEEPL_API_KEY non configurata");
  return key;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

// Con tag_handling "html" DeepL restituisce entità HTML anche per l'apostrofo
// dentro testo semplice (es. "LET&#x27;S TALK" invece di "LET'S TALK"): i cataloghi
// messaggi non passano da un parser HTML, quindi le entità vanno decodificate a
// mano prima di salvarle, altrimenti compaiono lettera per lettera a schermo.
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&(amp|lt|gt|quot|apos);/g, (_, name) => NAMED_ENTITIES[name]);
}

interface TranslateOptions {
  /** Da attivare solo per testi che contengono tag da preservare (es. <privacy>...</privacy>
   * per i link nel catalogo messaggi, o markup reale per i contenuti del blog). Senza tag
   * da preservare va lasciato disattivato: altrimenti DeepL restituisce entità HTML anche
   * per l'apostrofo del testo semplice (es. "LET&#x27;S TALK" invece di "LET'S TALK"). */
  html?: boolean;
  /** Nomi di tag che DeepL non deve mai spezzare a metà frase (es. un singolo <cookie>...
   * </cookie> diventato due tag separati dopo la traduzione) — indispensabile per i tag
   * "finti" usati nel catalogo messaggi per incorporare dei link nella traduzione. */
  nonSplittingTags?: string[];
}

/**
 * Traduce un elenco di testi in una sola chiamata (l'API DeepL accetta più
 * parametri "text" nella stessa richiesta), per restare efficienti sulla quota
 * mensile gratuita invece di una chiamata per ogni campo.
 */
export async function translateTexts(
  texts: string[],
  targetLocale: Exclude<Locale, "it">,
  options: TranslateOptions = {},
): Promise<string[]> {
  if (texts.length === 0) return [];

  const body = new URLSearchParams();
  for (const text of texts) body.append("text", text);
  body.append("target_lang", DEEPL_TARGET_CODE[targetLocale]);
  body.append("source_lang", "IT");
  if (options.html) {
    body.append("tag_handling", "html");
    if (options.nonSplittingTags?.length) {
      body.append("non_splitting_tags", options.nonSplittingTags.join(","));
    }
  }

  const res = await fetch(DEEPL_API_URL, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${getApiKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (res.status === 456) {
    throw new DeepLQuotaExceededError();
  }
  if (!res.ok) {
    throw new Error(`Errore DeepL (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { translations: { text: string }[] };
  const results = data.translations.map((t) => t.text);
  return options.html ? results.map(decodeHtmlEntities) : results;
}

export async function getDeepLUsage(): Promise<{ characterCount: number; characterLimit: number }> {
  const res = await fetch(DEEPL_USAGE_URL, {
    headers: { Authorization: `DeepL-Auth-Key ${getApiKey()}` },
  });
  if (!res.ok) {
    throw new Error(`Errore lettura utilizzo DeepL (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { character_count: number; character_limit: number };
  return { characterCount: data.character_count, characterLimit: data.character_limit };
}
