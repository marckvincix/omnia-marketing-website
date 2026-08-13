import type { Ga4Overview } from "@/lib/analytics/ga4";

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

export function Ga4OverviewCards({ overview }: { overview: Ga4Overview }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <MetricCard label="Utenti attivi" value={overview.activeUsers} />
      <MetricCard label="Sessioni" value={overview.sessions} />
      <MetricCard label="Visualizzazioni" value={overview.pageViews} />
      <MetricCard label="Durata media sessione" value={formatDuration(overview.avgSessionDurationSeconds)} />
      <MetricCard label="Frequenza di rimbalzo" value={`${Math.round(overview.bounceRate * 100)}%`} />
    </div>
  );
}
