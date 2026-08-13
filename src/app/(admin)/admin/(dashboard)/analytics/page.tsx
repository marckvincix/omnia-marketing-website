import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getGa4Report, isGa4Configured } from "@/lib/analytics/ga4";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

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

const CHANNEL_LABELS: Record<string, string> = {
  "Direct": "Diretto",
  "Organic Search": "Ricerca organica",
  "Paid Search": "Ricerca a pagamento",
  "Organic Social": "Social organico",
  "Paid Social": "Social a pagamento",
  "Referral": "Referral",
  "Email": "Email",
  "Unassigned": "Non assegnato",
};

export default async function AdminAnalyticsPage() {
  if (!isGa4Configured()) {
    return (
      <div>
        <AdminPageHeader
          title="Analytics"
          description="Statistiche di traffico del sito, dalla Google Analytics Data API."
        />
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm max-w-2xl">
          <p className="font-medium text-amber-600 dark:text-amber-400">Google Analytics non è ancora collegato</p>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Il tracciamento sul sito pubblico è già attivo (tag di misurazione), ma per vedere qui le statistiche
            serve collegare la Google Analytics Data API con un account di servizio Google Cloud. Servono due
            variabili d&apos;ambiente su Vercel:
          </p>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            <li>
              <code className="rounded bg-muted px-1 py-0.5">GOOGLE_ANALYTICS_PROPERTY_ID</code> — l&apos;ID
              numerico della proprietà GA4 (Amministrazione → Impostazioni proprietà su analytics.google.com).
            </li>
            <li>
              <code className="rounded bg-muted px-1 py-0.5">GOOGLE_SERVICE_ACCOUNT_KEY</code> — il contenuto
              del file JSON di un account di servizio Google Cloud, a cui va dato accesso in sola lettura
              (&quot;Viewer&quot;) alla proprietà GA4 da Amministrazione → Gestione accessi proprietà.
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const report = await getGa4Report(28);

  if ("error" in report) {
    return (
      <div>
        <AdminPageHeader
          title="Analytics"
          description="Statistiche di traffico del sito, dalla Google Analytics Data API."
        />
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm max-w-2xl">
          <p className="font-medium text-destructive">Errore nel recupero delle statistiche</p>
          <p className="mt-2 text-muted-foreground">{report.error}</p>
        </div>
      </div>
    );
  }

  const { overview, topPages, trafficSources } = report;

  return (
    <div className="flex flex-col gap-10">
      <div>
        <AdminPageHeader
          title="Analytics"
          description="Statistiche di traffico del sito negli ultimi 28 giorni, da Google Analytics."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <MetricCard label="Utenti attivi" value={overview.activeUsers} />
          <MetricCard label="Sessioni" value={overview.sessions} />
          <MetricCard label="Visualizzazioni" value={overview.pageViews} />
          <MetricCard label="Durata media sessione" value={formatDuration(overview.avgSessionDurationSeconds)} />
          <MetricCard label="Frequenza di rimbalzo" value={`${Math.round(overview.bounceRate * 100)}%`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-semibold mb-3">Pagine più visitate</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.path} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground truncate max-w-0">{p.path}</td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{p.views}</td>
                  </tr>
                ))}
                {topPages.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={2}>
                      Nessun dato ancora disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-3">Sorgenti di traffico</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {trafficSources.map((s) => (
                  <tr key={s.channel} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground">{CHANNEL_LABELS[s.channel] ?? s.channel}</td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{s.sessions}</td>
                  </tr>
                ))}
                {trafficSources.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={2}>
                      Nessun dato ancora disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
