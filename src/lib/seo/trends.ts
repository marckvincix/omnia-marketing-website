// google-trends-api non è una libreria ufficiale Google: legge gli stessi endpoint usati
// dall'interfaccia trends.google.com in modo non documentato, quindi può smettere di
// funzionare o essere temporaneamente bloccata da Google senza preavviso. Ogni chiamata è
// avvolta in un try/catch che restituisce un errore leggibile invece di far crashare la
// pagina admin.
import googleTrends from "google-trends-api";

export interface RelatedKeyword {
  query: string;
  value: number;
  breakout: boolean;
}

export interface RelatedKeywordsResult {
  top: RelatedKeyword[];
  rising: RelatedKeyword[];
}

interface RankedKeywordEntry {
  query: string;
  value: number;
  formattedValue: string;
}

interface RelatedQueriesResponse {
  default?: {
    rankedList?: [{ rankedKeyword?: RankedKeywordEntry[] }, { rankedKeyword?: RankedKeywordEntry[] }];
  };
}

function toKeywords(entries: RankedKeywordEntry[] | undefined): RelatedKeyword[] {
  if (!entries) return [];
  return entries.map((e) => ({
    query: e.query,
    value: e.value,
    breakout: e.formattedValue === "Breakout",
  }));
}

// Query correlate/in crescita per una parola chiave, limitate all'Italia (geo IT, lingua it):
// aiuta a capire quali varianti/frasi la gente cerca davvero intorno al tema scelto.
export async function getRelatedKeywords(seed: string): Promise<
  { ok: true; data: RelatedKeywordsResult } | { ok: false; error: string }
> {
  const keyword = seed.trim();
  if (!keyword) return { ok: false, error: "Nessuna parola chiave da cercare." };

  try {
    const raw = await googleTrends.relatedQueries({ keyword, geo: "IT", hl: "it" });
    const parsed: RelatedQueriesResponse = JSON.parse(raw);
    const [topEntry, risingEntry] = parsed.default?.rankedList ?? [];
    return {
      ok: true,
      data: {
        top: toKeywords(topEntry?.rankedKeyword).slice(0, 10),
        rising: toKeywords(risingEntry?.rankedKeyword).slice(0, 10),
      },
    };
  } catch (err) {
    console.error("[seo] Google Trends non raggiungibile", err);
    return {
      ok: false,
      error: "Google Trends non ha risposto (servizio non ufficiale, può essere temporaneamente non disponibile). Riprova tra qualche minuto.",
    };
  }
}
