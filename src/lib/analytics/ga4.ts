import { BetaAnalyticsDataClient } from "@google-analytics/data";

export interface Ga4Overview {
  activeUsers: number;
  sessions: number;
  pageViews: number;
  avgSessionDurationSeconds: number;
  bounceRate: number;
}

export interface Ga4TopPage {
  path: string;
  views: number;
}

export interface Ga4TrafficSource {
  channel: string;
  sessions: number;
}

export interface Ga4Report {
  overview: Ga4Overview;
  topPages: Ga4TopPage[];
  trafficSources: Ga4TrafficSource[];
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

export type Ga4Period = "day" | "month" | "year";

const PERIOD_START_DATE: Record<Ga4Period, string> = {
  day: "today",
  month: "30daysAgo",
  year: "365daysAgo",
};

export async function getGa4Report(period: Ga4Period = "month"): Promise<Ga4Report | { error: string }> {
  const setup = getClient();
  if (!setup) return { error: "Google Analytics non è ancora configurato." };
  const { client, propertyId } = setup;
  const property = `properties/${propertyId}`;
  const dateRanges = [{ startDate: PERIOD_START_DATE[period], endDate: "today" }];

  try {
    const [overviewRes, pagesRes, sourcesRes] = await Promise.all([
      client.runReport({
        property,
        dateRanges,
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
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      }),
      client.runReport({
        property,
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
    ]);

    const overviewRow = overviewRes[0].rows?.[0];
    const overview: Ga4Overview = {
      activeUsers: num(overviewRow?.metricValues?.[0]?.value),
      sessions: num(overviewRow?.metricValues?.[1]?.value),
      pageViews: num(overviewRow?.metricValues?.[2]?.value),
      avgSessionDurationSeconds: num(overviewRow?.metricValues?.[3]?.value),
      bounceRate: num(overviewRow?.metricValues?.[4]?.value),
    };

    const topPages: Ga4TopPage[] = (pagesRes[0].rows ?? []).map((row) => ({
      path: row.dimensionValues?.[0]?.value ?? "—",
      views: num(row.metricValues?.[0]?.value),
    }));

    const trafficSources: Ga4TrafficSource[] = (sourcesRes[0].rows ?? []).map((row) => ({
      channel: row.dimensionValues?.[0]?.value ?? "—",
      sessions: num(row.metricValues?.[0]?.value),
    }));

    return { overview, topPages, trafficSources };
  } catch (error) {
    console.error("Errore lettura metriche Google Analytics", error);
    return {
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la lettura delle metriche",
    };
  }
}
