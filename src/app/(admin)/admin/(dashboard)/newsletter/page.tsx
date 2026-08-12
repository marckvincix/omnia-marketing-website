import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEmailMetrics } from "@/lib/email/metrics";
import { getSubscriberEngagementMap } from "@/lib/email/segments";
import { SubscriberRow } from "./subscriber-row";
import { PostSendRow } from "./post-send-row";
import { SyncMetricsButton } from "./sync-metrics-button";

export const metadata: Metadata = {
  title: "Newsletter",
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

export default async function AdminNewsletterPage() {
  const [allSubscribers, posts, metrics, engagement] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    }),
    getEmailMetrics(),
    getSubscriberEngagementMap(),
  ]);

  const subscribers = allSubscribers.filter((s) => !s.unsubscribedAt);
  const webhookConfigured = !!process.env.RESEND_WEBHOOK_SECRET;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const isLocalSite = siteUrl.includes("localhost");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <AdminPageHeader
            title="Newsletter"
            description="Piattaforma di email marketing: invia aggiornamenti, segmenta gli iscritti e monitora le performance."
          />
          <SyncMetricsButton />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <MetricCard label="Inviate" value={metrics.sent} />
          <MetricCard label="Consegnate" value={metrics.delivered} />
          <MetricCard label="Aperte" value={`${metrics.opened} (${metrics.openRate}%)`} />
          <MetricCard label="Cliccate" value={`${metrics.clicked} (${metrics.clickRate}%)`} />
          <MetricCard label="Rimbalzate" value={metrics.bounced} />
          <MetricCard label="Reclami" value={metrics.complained} />
          <MetricCard label="Disiscritti" value={metrics.unsubscribed} />
        </div>

        {!webhookConfigured && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Metriche in tempo reale non ancora attive
            </p>
            <p className="mt-1 text-muted-foreground">
              Per ricevere aperture, click e bounce, aggiungi un webhook su{" "}
              <a href="https://resend.com/webhooks" target="_blank" rel="noreferrer" className="underline">
                resend.com/webhooks
              </a>{" "}
              con URL <code className="rounded bg-muted px-1 py-0.5">{siteUrl}/api/webhooks/resend</code>,
              seleziona tutti gli eventi email.*, poi copia il signing secret nella variabile{" "}
              <code className="rounded bg-muted px-1 py-0.5">RESEND_WEBHOOK_SECRET</code>.
            </p>
          </div>
        )}

        {webhookConfigured && isLocalSite && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
            <p className="font-medium text-amber-600 dark:text-amber-400">
              Webhook non raggiungibile in locale
            </p>
            <p className="mt-1 text-muted-foreground">
              Resend non riesce a consegnare gli eventi a un indirizzo <code className="rounded bg-muted px-1 py-0.5">localhost</code>,
              quindi in sviluppo le metriche non si aggiornano da sole. Usa il pulsante{" "}
              <span className="font-medium text-foreground">Aggiorna metriche da Resend</span> per interrogare
              l&apos;API e sincronizzarle manualmente. Una volta pubblicato il sito su un dominio pubblico, il
              webhook funzionerà automaticamente.
            </p>
          </div>
        )}
      </div>

      <div>
        <AdminPageHeader
          title="Invia aggiornamento"
          description="Scegli un articolo e, facoltativamente, un segmento di iscritti a cui inviarlo."
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Articolo</TableHead>
                <TableHead>Pubblicato</TableHead>
                <TableHead>Invio</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <PostSendRow
                  key={post.id}
                  post={{
                    id: post.id,
                    title: post.title,
                    publishedAt: post.publishedAt?.toISOString() ?? null,
                    newsletterSentAt: post.newsletterSentAt?.toISOString() ?? null,
                  }}
                  subscriberCount={subscribers.length}
                />
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nessun articolo pubblicato ancora.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <AdminPageHeader
          title="Iscritti"
          description={`${subscribers.length} ${subscribers.length === 1 ? "iscritto attivo" : "iscritti attivi"} alla newsletter.`}
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Iscritto il</TableHead>
                <TableHead>Coinvolgimento</TableHead>
                <TableHead className="w-16 text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => {
                const stats = engagement.get(subscriber.id);
                return (
                  <SubscriberRow
                    key={subscriber.id}
                    subscriber={{
                      id: subscriber.id,
                      email: subscriber.email,
                      createdAt: subscriber.createdAt.toISOString(),
                      openedCount: stats?.openedCount ?? 0,
                      clickedCount: stats?.clickedCount ?? 0,
                      bouncedCount: stats?.bouncedCount ?? 0,
                    }}
                  />
                );
              })}
              {subscribers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Nessun iscritto ancora.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
