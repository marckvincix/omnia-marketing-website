import { GoogleAuth } from "google-auth-library";
import { resolvePeriod } from "@/lib/analytics/period";

// Riusa lo stesso account di servizio Google Cloud già configurato per Google Analytics
// (GOOGLE_SERVICE_ACCOUNT_KEY): va solo aggiunto come utente in Search Console (Impostazioni
// → Utenti e permessi → Aggiungi utente, ruolo "Con restrizioni" basta per la sola lettura).
// GOOGLE_SEARCH_CONSOLE_SITE_URL è l'identificativo esatto mostrato in Search Console:
// "https://dominio.it/" per una proprietà a prefisso URL, oppure "sc-domain:dominio.it" per
// una proprietà a dominio.
const SEARCH_CONSOLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export interface SearchConsoleMetricComparison {
  current: number;
  previous: number;
  changePercent: number | null;
}

export interface SearchConsoleOverview {
  clicks: SearchConsoleMetricComparison;
  impressions: SearchConsoleMetricComparison;
  ctr: SearchConsoleMetricComparison;
  // Posizione media: valore più basso = meglio (opposto delle altre metriche).
  position: SearchConsoleMetricComparison;
}

export interface SearchConsoleQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsolePageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleReport {
  overview: SearchConsoleOverview;
  topQueries: SearchConsoleQueryRow[];
  topPages: SearchConsolePageRow[];
  currentLabel: string;
  comparisonLabel: string;
}

export function isSearchConsoleConfigured(): boolean {
  return !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !!process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
}

function getAuth(): GoogleAuth | null {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) return null;
  const credentials = JSON.parse(keyJson);
  return new GoogleAuth({ credentials, scopes: [SEARCH_CONSOLE_SCOPE] });
}

interface QueryRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

interface QueryResponse {
  rows?: QueryRow[];
}

async function querySearchAnalytics(
  accessToken: string,
  siteUrl: string,
  body: Record<string, unknown>,
): Promise<QueryResponse> {
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Search Console API ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function comparison(current: number, previous: number): SearchConsoleMetricComparison {
  const changePercent = previous > 0 ? ((current - previous) / previous) * 100 : null;
  return { current, previous, changePercent };
}

function totalsFrom(rows: QueryRow[] | undefined) {
  const row = rows?.[0];
  return {
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    ctr: row?.ctr ?? 0,
    position: row?.position ?? 0,
  };
}

// I dati di Search Console arrivano con circa 2-3 giorni di ritardo rispetto a oggi: gli
// ultimi giorni di un periodo "recente" possono risultare vuoti, non è un calo di traffico
// reale. Segnalato anche nell'interfaccia admin, non solo qui nel commento.
export async function getSearchConsoleReport(period: string = "30d"): Promise<SearchConsoleReport | { error: string }> {
  const auth = getAuth();
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!auth || !siteUrl) return { error: "Google Search Console non è ancora configurato." };

  const { current, previous, currentLabel, comparisonLabel } = resolvePeriod(period);

  try {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    if (!token) return { error: "Impossibile ottenere un token di accesso Google." };

    const [currentTotals, previousTotals, queriesRes, pagesRes] = await Promise.all([
      querySearchAnalytics(token, siteUrl, { startDate: current.startDate, endDate: current.endDate }),
      querySearchAnalytics(token, siteUrl, { startDate: previous.startDate, endDate: previous.endDate }),
      querySearchAnalytics(token, siteUrl, {
        startDate: current.startDate,
        endDate: current.endDate,
        dimensions: ["query"],
        rowLimit: 10,
      }),
      querySearchAnalytics(token, siteUrl, {
        startDate: current.startDate,
        endDate: current.endDate,
        dimensions: ["page"],
        rowLimit: 10,
      }),
    ]);

    const curr = totalsFrom(currentTotals.rows);
    const prev = totalsFrom(previousTotals.rows);

    const overview: SearchConsoleOverview = {
      clicks: comparison(curr.clicks, prev.clicks),
      impressions: comparison(curr.impressions, prev.impressions),
      ctr: comparison(curr.ctr, prev.ctr),
      position: comparison(curr.position, prev.position),
    };

    const topQueries: SearchConsoleQueryRow[] = (queriesRes.rows ?? []).map((r) => ({
      query: r.keys?.[0] ?? "—",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));

    const topPages: SearchConsolePageRow[] = (pagesRes.rows ?? []).map((r) => ({
      page: r.keys?.[0] ?? "—",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));

    return { overview, topQueries, topPages, currentLabel, comparisonLabel };
  } catch (error) {
    console.error("Errore lettura Google Search Console", error);
    return {
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la lettura di Search Console",
    };
  }
}

export interface PagePerformance {
  clicks: number;
  impressions: number;
}

// Click e impression di TUTTE le pagine in un'unica chiamata (invece di una per riga),
// usato nelle tabelle elenco blog/progetti per mostrare la colonna Performance senza fare
// una query Search Console per ogni singolo articolo/progetto. Mappa per percorso (es.
// "/blog/il-mio-slug"), non per URL completo, così il confronto non dipende dal formato
// esatto della proprietà (prefisso URL o dominio).
export async function getAllPagesPerformance(period: string = "30d"): Promise<Map<string, PagePerformance> | { error: string }> {
  const auth = getAuth();
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!auth || !siteUrl) return { error: "Google Search Console non è ancora configurato." };

  const { current } = resolvePeriod(period);

  try {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    if (!token) return { error: "Impossibile ottenere un token di accesso Google." };

    const res = await querySearchAnalytics(token, siteUrl, {
      startDate: current.startDate,
      endDate: current.endDate,
      dimensions: ["page"],
      rowLimit: 5000,
    });

    const map = new Map<string, PagePerformance>();
    for (const row of res.rows ?? []) {
      const url = row.keys?.[0];
      if (!url) continue;
      let path: string;
      try {
        path = new URL(url).pathname;
      } catch {
        path = url;
      }
      map.set(path, { clicks: row.clicks ?? 0, impressions: row.impressions ?? 0 });
    }
    return map;
  } catch (error) {
    console.error("Errore lettura performance pagine Search Console", error);
    return {
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la lettura di Search Console",
    };
  }
}

// Query e posizione media per una singola pagina, usato nel pannello SEO dell'editor
// (blog/progetti) per mostrare come sta andando davvero quel contenuto su Google, non solo
// la checklist statica dell'analizzatore.
export async function getSearchConsolePageInsights(
  pagePath: string,
): Promise<{ overview: { clicks: number; impressions: number; ctr: number; position: number }; topQueries: SearchConsoleQueryRow[] } | { error: string }> {
  const auth = getAuth();
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;
  if (!auth || !siteUrl) return { error: "Google Search Console non è ancora configurato." };

  const { current } = resolvePeriod("30d");
  const siteUrlNormalized = siteUrl.startsWith("sc-domain:") ? null : siteUrl.replace(/\/$/, "");
  const fullPageUrl = siteUrlNormalized ? `${siteUrlNormalized}${pagePath}` : null;

  try {
    const client = await auth.getClient();
    const { token } = await client.getAccessToken();
    if (!token) return { error: "Impossibile ottenere un token di accesso Google." };

    const filters = fullPageUrl
      ? [{ dimension: "page", operator: "equals", expression: fullPageUrl }]
      : [{ dimension: "page", operator: "contains", expression: pagePath }];

    const [totalsRes, queriesRes] = await Promise.all([
      querySearchAnalytics(token, siteUrl, {
        startDate: current.startDate,
        endDate: current.endDate,
        dimensionFilterGroups: [{ filters }],
      }),
      querySearchAnalytics(token, siteUrl, {
        startDate: current.startDate,
        endDate: current.endDate,
        dimensions: ["query"],
        dimensionFilterGroups: [{ filters }],
        rowLimit: 5,
      }),
    ]);

    const overview = totalsFrom(totalsRes.rows);
    const topQueries: SearchConsoleQueryRow[] = (queriesRes.rows ?? []).map((r) => ({
      query: r.keys?.[0] ?? "—",
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
      position: r.position ?? 0,
    }));

    return { overview, topQueries };
  } catch (error) {
    console.error("Errore lettura Search Console per pagina", error);
    return {
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la lettura di Search Console",
    };
  }
}
