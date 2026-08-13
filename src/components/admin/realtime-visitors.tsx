"use client";

import { useEffect, useState } from "react";
import { fetchRealtimeVisitors } from "@/lib/analytics/actions";
import type { Ga4Realtime } from "@/lib/analytics/ga4";

const REFRESH_MS = 30_000;

function PulsingDot() {
  return (
    <span className="relative flex size-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  );
}

function locationLabel(city: string, country: string) {
  const validCity = city && city !== "(not set)" ? city : "";
  const validCountry = country && country !== "(not set)" ? country : "";
  return [validCity, validCountry].filter(Boolean).join(", ") || "Località sconosciuta";
}

export function RealtimeVisitors({ variant = "card" }: { variant?: "card" | "panel" }) {
  const [data, setData] = useState<Ga4Realtime | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetchRealtimeVisitors();
      if (cancelled) return;
      if ("error" in res) {
        setUnavailable(true);
      } else {
        setUnavailable(false);
        setData(res);
      }
    }

    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (unavailable) return null;

  if (variant === "card") {
    const topLocation = data?.byLocation[0];
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <PulsingDot />
          In tempo reale
        </div>
        <p className="mt-1 text-2xl font-semibold">{data ? data.activeUsers : "—"}</p>
        <p className="text-sm text-muted-foreground">
          {data?.activeUsers === 1 ? "persona sul sito ora" : "persone sul sito ora"}
          {topLocation && ` · ${locationLabel(topLocation.city, topLocation.country)}`}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <PulsingDot />
          In tempo reale
        </div>
        <p className="text-2xl font-semibold">{data ? data.activeUsers : "—"}</p>
      </div>

      {data && (data.byPage.length > 0 || data.byLocation.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.byPage.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Pagine</p>
              <div className="flex flex-col gap-2">
                {data.byPage.map((p) => (
                  <div key={p.page} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{p.page}</span>
                    <span className="font-medium shrink-0 ml-3">{p.activeUsers}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data.byLocation.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Località</p>
              <div className="flex flex-col gap-2">
                {data.byLocation.map((l, i) => (
                  <div key={`${l.city}-${l.country}-${i}`} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{locationLabel(l.city, l.country)}</span>
                    <span className="font-medium shrink-0 ml-3">{l.activeUsers}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {data && data.byPage.length === 0 && data.activeUsers === 0 && (
        <p className="text-sm text-muted-foreground">Nessuno sul sito in questo momento.</p>
      )}
    </div>
  );
}
