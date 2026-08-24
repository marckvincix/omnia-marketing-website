import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { RealtimeVisitors } from "@/components/admin/realtime-visitors";
import { Ga4OverviewCards } from "@/components/admin/ga4-overview-cards";
import { SearchConsoleOverviewCards } from "@/components/admin/search-console-overview-cards";
import { getGa4Report, isGa4Configured } from "@/lib/analytics/ga4";
import { getSearchConsoleReport, isSearchConsoleConfigured } from "@/lib/seo/search-console";
import { isValidGa4Period } from "@/lib/analytics/period";
import { PeriodFilter } from "./period-filter";
import { DemographicsSection } from "./demographics-section";

export const metadata: Metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

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

function SetupBanner({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-sm max-w-2xl">
      <p className="font-medium text-amber-600 dark:text-amber-400">{title}</p>
      <div className="mt-2 text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm max-w-2xl">
      <p className="font-medium text-destructive">Errore nel recupero delle statistiche</p>
      <p className="mt-2 text-muted-foreground">{message}</p>
    </div>
  );
}

async function Ga4Section({ period }: { period: string }) {
  if (!isGa4Configured()) {
    return (
      <SetupBanner title="Google Analytics non è ancora collegato">
        <p>
          Il tracciamento sul sito pubblico è già attivo (tag di misurazione), ma per vedere qui le statistiche
          serve collegare la Google Analytics Data API con un account di servizio Google Cloud. Servono due
          variabili d&apos;ambiente su Vercel:
        </p>
        <ul className="mt-3 space-y-1">
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
      </SetupBanner>
    );
  }

  const report = await getGa4Report(period);
  if ("error" in report) return <ErrorBanner message={report.error} />;

  const { overview, topPages, trafficSources, demographics } = report;

  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2 max-w-sm">
        <RealtimeVisitors variant="panel" />
      </div>

      <Ga4OverviewCards overview={overview} comparisonLabel={report.comparisonLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold mb-3">Pagine più visitate</h3>
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
          <h3 className="text-sm font-semibold mb-3">Sorgenti di traffico</h3>
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

      <DemographicsSection demographics={demographics} />
    </div>
  );
}

async function SearchConsoleSection({ period }: { period: string }) {
  if (!isSearchConsoleConfigured()) {
    return (
      <SetupBanner title="Google Search Console non è ancora collegata">
        <p>
          Riusa lo stesso account di servizio già configurato per Google Analytics
          (<code className="rounded bg-muted px-1 py-0.5">GOOGLE_SERVICE_ACCOUNT_KEY</code>): va solo aggiunto
          come utente anche in Search Console. Due passaggi:
        </p>
        <ol className="mt-3 space-y-1 list-decimal list-inside">
          <li>
            Su <code className="rounded bg-muted px-1 py-0.5">search.google.com/search-console</code>, apri la
            proprietà del sito → Impostazioni → Utenti e permessi → Aggiungi utente → incolla l&apos;email
            dell&apos;account di servizio (nel file JSON, campo <code className="rounded bg-muted px-1 py-0.5">client_email</code>)
            con ruolo &quot;Con restrizioni&quot; (basta per la sola lettura).
          </li>
          <li>
            Aggiungi su Vercel la variabile{" "}
            <code className="rounded bg-muted px-1 py-0.5">GOOGLE_SEARCH_CONSOLE_SITE_URL</code> con
            l&apos;identificativo esatto della proprietà mostrato in Search Console (es.{" "}
            <code className="rounded bg-muted px-1 py-0.5">https://omniamarketing.it/</code> o{" "}
            <code className="rounded bg-muted px-1 py-0.5">sc-domain:omniamarketing.it</code>).
          </li>
        </ol>
      </SetupBanner>
    );
  }

  const report = await getSearchConsoleReport(period);
  if ("error" in report) return <ErrorBanner message={report.error} />;

  const { overview, topQueries, topPages, comparisonLabel } = report;

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted-foreground -mt-2">
        I dati di Search Console hanno un ritardo di 2-3 giorni rispetto a oggi: negli ultimi giorni del periodo
        possono risultare incompleti, non è un calo reale di traffico.
      </p>

      <SearchConsoleOverviewCards overview={overview} comparisonLabel={comparisonLabel} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-semibold mb-3">Query più cercate</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Query</th>
                  <th className="px-4 py-2 font-medium text-right">Click</th>
                  <th className="px-4 py-2 font-medium text-right">Posizione</th>
                </tr>
              </thead>
              <tbody>
                {topQueries.map((q) => (
                  <tr key={q.query} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground truncate max-w-0">{q.query}</td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{q.clicks}</td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">{q.position.toFixed(1)}</td>
                  </tr>
                ))}
                {topQueries.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={3}>
                      Nessun dato ancora disponibile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3">Pagine più cliccate</h3>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-2 font-medium">Pagina</th>
                  <th className="px-4 py-2 font-medium text-right">Click</th>
                  <th className="px-4 py-2 font-medium text-right">Posizione</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((p) => (
                  <tr key={p.page} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-muted-foreground truncate max-w-0">{p.page}</td>
                    <td className="px-4 py-2.5 text-right font-medium whitespace-nowrap">{p.clicks}</td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">{p.position.toFixed(1)}</td>
                  </tr>
                ))}
                {topPages.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-center text-muted-foreground" colSpan={3}>
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

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const { period: periodParam } = await searchParams;
  const period = isValidGa4Period(periodParam) ? periodParam : "30d";

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader title="Analytics" description="Statistiche di traffico e di ricerca del sito." />
        <PeriodFilter period={period} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Google Analytics</h2>
        <Ga4Section period={period} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Google Search Console</h2>
        <SearchConsoleSection period={period} />
      </div>
    </div>
  );
}
