import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { Ga4Overview, Ga4MetricComparison } from "@/lib/analytics/ga4";

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}

/**
 * Per la maggior parte delle metriche un aumento è positivo (verde); per la frequenza di
 * rimbalzo è il contrario, un aumento è negativo (rosso) — da qui l'inversione dei colori.
 */
function ChangeBadge({ changePercent, invert = false }: { changePercent: number | null; invert?: boolean }) {
  if (changePercent === null) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const rounded = Math.round(changePercent);
  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
        <Minus className="size-3" /> 0%
      </span>
    );
  }
  const isPositive = rounded > 0;
  const isGood = invert ? !isPositive : isPositive;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isGood ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
      }`}
    >
      {isPositive ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(rounded)}%
    </span>
  );
}

function MetricCard({
  label,
  value,
  metric,
  comparisonLabel,
  invert,
}: {
  label: string;
  value: string | number;
  metric: Ga4MetricComparison;
  comparisonLabel: string;
  invert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      <div className="mt-2 flex items-center gap-1.5">
        <ChangeBadge changePercent={metric.changePercent} invert={invert} />
        <span className="text-xs text-muted-foreground truncate">vs {comparisonLabel}</span>
      </div>
    </div>
  );
}

export function Ga4OverviewCards({
  overview,
  comparisonLabel = "periodo precedente",
}: {
  overview: Ga4Overview;
  comparisonLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      <MetricCard
        label="Utenti attivi"
        value={overview.activeUsers.current}
        metric={overview.activeUsers}
        comparisonLabel={comparisonLabel}
      />
      <MetricCard
        label="Sessioni"
        value={overview.sessions.current}
        metric={overview.sessions}
        comparisonLabel={comparisonLabel}
      />
      <MetricCard
        label="Visualizzazioni"
        value={overview.pageViews.current}
        metric={overview.pageViews}
        comparisonLabel={comparisonLabel}
      />
      <MetricCard
        label="Durata media sessione"
        value={formatDuration(overview.avgSessionDurationSeconds.current)}
        metric={overview.avgSessionDurationSeconds}
        comparisonLabel={comparisonLabel}
      />
      <MetricCard
        label="Frequenza di rimbalzo"
        value={`${Math.round(overview.bounceRate.current * 100)}%`}
        metric={overview.bounceRate}
        comparisonLabel={comparisonLabel}
        invert
      />
    </div>
  );
}
