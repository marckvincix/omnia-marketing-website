"use client";

import { useState } from "react";
import type { Ga4Demographics } from "@/lib/analytics/ga4";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function DemographicsSection({ demographics }: { demographics: Ga4Demographics }) {
  const [view, setView] = useState<"city" | "country">("city");
  const rows = view === "city" ? demographics.byCity : demographics.byCountry;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Dati demografici</h2>
        <div className="inline-flex rounded-lg border border-border p-0.5">
          <button
            type="button"
            onClick={() => setView("city")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              view === "city" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Città
          </button>
          <button
            type="button"
            onClick={() => setView("country")}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              view === "country" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Paese
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-medium">{view === "city" ? "Città" : "Paese"}</th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">Utenti attivi</th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">Nuovi utenti</th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">Sessioni</th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">Tasso di coinvolgimento</th>
              <th className="px-4 py-2.5 font-medium text-right whitespace-nowrap">Durata media sessione</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <td className="px-4 py-2.5 text-muted-foreground">{row.label}</td>
                <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{row.activeUsers}</td>
                <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{row.newUsers}</td>
                <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{row.sessions}</td>
                <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">
                  {Math.round(row.engagementRate * 100)}%
                </td>
                <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">
                  {formatDuration(row.avgSessionDurationSeconds)}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-muted-foreground" colSpan={6}>
                  Nessun dato ancora disponibile.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
