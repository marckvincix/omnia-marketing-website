import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { resolvePeriod } from "./period";

export interface Ga4MetricComparison {
  current: number;
  previous: number;
  /** null quando il periodo precedente è a zero: la variazione percentuale non è definibile. */
  changePercent: number | null;
}

export interface Ga4Overview {
  activeUsers: Ga4MetricComparison;
  sessions: Ga4MetricComparison;
  pageViews: Ga4MetricComparison;
  avgSessionDurationSeconds: Ga4MetricComparison;
  bounceRate: Ga4MetricComparison;
}

export interface Ga4TopPage {
  path: string;
  views: number;
}

export interface Ga4TrafficSource {
  channel: string;
  sessions: number;
}

export interface Ga4DemographicRow {
  label: string;
  activeUsers: number;
  newUsers: number;
  sessions: number;
  /** 0-1: percentuale di sessioni con coinvolgimento (equivalente al "Tasso di coinvolgimento" di GA4). */
  engagementRate: number;
  avgSessionDurationSeconds: number;
}

export interface Ga4Demographics {
  byCity: Ga4DemographicRow[];
  byCountry: Ga4DemographicRow[];
}

export interface Ga4Report {
  overview: Ga4Overview;
  topPages: Ga4TopPage[];
  trafficSources: Ga4TrafficSource[];
  demographics: Ga4Demographics;
  currentLabel: string;
  comparisonLabel: string;
}

function getClient(): { client: BetaAnalyticsDataClient; propertyId: string } | null {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
  if (!keyJson || !propertyId) return null;

  const credentials = JSON.parse(keyJson);
  return { client: new BetaAnalyticsDataClient({ credentials }), propertyId };
}

export function isGa4Configured(): boolean {
  return !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY && !!process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
}

function num(value: string | null | undefined): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export interface Ga4RealtimePage {
  page: string;
  activeUsers: number;
}

export interface Ga4RealtimeLocation {
  city: string;
  country: string;
  activeUsers: number;
}

export interface Ga4Realtime {
  activeUsers: number;
  byPage: Ga4RealtimePage[];
  byLocation: Ga4RealtimeLocation[];
}

export async function getGa4Realtime(): Promise<Ga4Realtime | { error: string }> {
  const setup = getClient();
  if (!setup) return { error: "Google Analytics non è ancora configurato." };
  const { client, propertyId } = setup;
  const property = `properties/${propertyId}`;

  try {
    const [totalRes, pagesRes, locationsRes] = await Promise.all([
      client.runRealtimeReport({ property, metrics: [{ name: "activeUsers" }] }),
      client.runRealtimeReport({
        property,
        dimensions: [{ name: "unifiedScreenName" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 5,
      }),
      client.runRealtimeReport({
        property,
        dimensions: [{ name: "city" }, { name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 5,
      }),
    ]);

    const activeUsers = num(totalRes[0].rows?.[0]?.metricValues?.[0]?.value);
    const byPage: Ga4RealtimePage[] = (pagesRes[0].rows ?? []).map((row) => ({
      page: row.dimensionValues?.[0]?.value || "(senza titolo)",
      activeUsers: num(row.metricValues?.[0]?.value),
    }));

    const byLocation: Ga4RealtimeLocation[] = (locationsRes[0].rows ?? []).map((row) => ({
      city: row.dimensionValues?.[0]?.value || "",
      country: row.dimensionValues?.[1]?.value || "",
      activeUsers: num(row.metricValues?.[0]?.value),
    }));

    return { activeUsers, byPage, byLocation };
  } catch (error) {
    console.error("Errore lettura metriche in tempo reale Google Analytics", error);
    return {
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la lettura delle metriche",
    };
  }
}

function comparison(current: number, previous: number): Ga4MetricComparison {
  const changePercent = previous > 0 ? ((current - previous) / previous) * 100 : null;
  return { current, previous, changePercent };
}

export async function getGa4Report(period: string = "30d"): Promise<Ga4Report | { error: string }> {
  const setup = getClient();
  if (!setup) return { error: "Google Analytics non è ancora configurato." };
  const { client, propertyId } = setup;
  const property = `properties/${propertyId}`;
  const { current, previous, currentLabel, comparisonLabel } = resolvePeriod(period);
  const comparisonDateRanges = [
    { ...current, name: "current" },
    { ...previous, name: "previous" },
  ];

  try {
    const demographicMetrics = [
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "sessions" },
      { name: "engagementRate" },
      { name: "averageSessionDuration" },
    ];

    const [overviewRes, pagesRes, sourcesRes, cityRes, countryRes] = await Promise.all([
      client.runReport({
        property,
        dateRanges: comparisonDateRanges,
        // Non va dichiarato in "dimensions": con più dateRanges la API lo aggiunge da sola
        // come prima colonna di ogni riga (dichiararlo esplicitamente dà INVALID_ARGUMENT).
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
      }),
      client.runReport({
        property,
        dateRanges: [current],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges: [current],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
      client.runReport({
        property,
        dateRanges: [current],
        dimensions: [{ name: "city" }],
        metrics: demographicMetrics,
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges: [current],
        dimensions: [{ name: "country" }],
        metrics: demographicMetrics,
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
      }),
    ]);

    const currentRow = overviewRes[0].rows?.find((r) => r.dimensionValues?.[0]?.value === "current");
    const previousRow = overviewRes[0].rows?.find((r) => r.dimensionValues?.[0]?.value === "previous");
    const curr = (i: number) => num(currentRow?.metricValues?.[i]?.value);
    const prev = (i: number) => num(previousRow?.metricValues?.[i]?.value);

    const overview: Ga4Overview = {
      activeUsers: comparison(curr(0), prev(0)),
      sessions: comparison(curr(1), prev(1)),
      pageViews: comparison(curr(2), prev(2)),
      avgSessionDurationSeconds: comparison(curr(3), prev(3)),
      bounceRate: comparison(curr(4), prev(4)),
    };

    const topPages: Ga4TopPage[] = (pagesRes[0].rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "—",
      views: num(row.metricValues?.[0]?.value),
    }));

    const trafficSources: Ga4TrafficSource[] = (sourcesRes[0].rows ?? []).map((row) => ({
      channel: row.dimensionValues?.[0]?.value ?? "—",
      sessions: num(row.metricValues?.[0]?.value),
    }));

    const toDemographicRows = (res: (typeof cityRes)): Ga4DemographicRow[] =>
      (res[0].rows ?? []).map((row) => ({
        label: row.dimensionValues?.[0]?.value || "(non impostata)",
        activeUsers: num(row.metricValues?.[0]?.value),
        newUsers: num(row.metricValues?.[1]?.value),
        sessions: num(row.metricValues?.[2]?.value),
        engagementRate: num(row.metricValues?.[3]?.value),
        avgSessionDurationSeconds: num(row.metricValues?.[4]?.value),
      }));

    const demographics: Ga4Demographics = {
      byCity: toDemographicRows(cityRes),
      byCountry: toDemographicRows(countryRes),
    };

    return { overview, topPages, trafficSources, demographics, currentLabel, comparisonLabel };
  } catch (error) {
    console.error("Errore lettura metriche Google Analytics", error);
    return {
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la lettura delle metriche",
    };
  }
}
