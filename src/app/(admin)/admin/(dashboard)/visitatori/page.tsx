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
import { computeLeadScore, computeLeadSegment, type LeadSegment } from "@/lib/lead-score";
import { VisitorNameRow } from "./visitor-name-row";
import { VisitorFilters } from "./visitor-filters";

export const metadata: Metadata = {
  title: "Visitatori",
  robots: { index: false, follow: false },
};

export default async function AdminVisitorsPage({
  searchParams,
}: {
  searchParams: Promise<{ segment?: string; city?: string }>;
}) {
  const { segment: segmentFilter, city: cityFilter } = await searchParams;
  const visitors = await prisma.visitorName.findMany({ orderBy: { createdAt: "desc" } });

  // Collega chi ha lasciato il nome a chi si è anche iscritto alla newsletter, tramite lo
  // stesso visitorId anonimo: due form diversi, nessuna chiave comune se non questa.
  const visitorIds = visitors.map((v) => v.visitorId).filter((id): id is string => !!id);
  const subscribers =
    visitorIds.length > 0
      ? await prisma.newsletterSubscriber.findMany({
          where: { visitorId: { in: visitorIds }, unsubscribedAt: null },
          select: { visitorId: true, email: true },
        })
      : [];
  const emailByVisitorId = new Map(subscribers.map((s) => [s.visitorId as string, s.email]));

  // Il punteggio non è salvato nel database (si ricalcola qui dai segnali grezzi), così
  // l'algoritmo si può affinare in qualunque momento senza dover rimigrare i dati storici.
  const ranked = visitors
    .map((v) => ({
      visitor: v,
      score: computeLeadScore(v),
      segment: computeLeadSegment(v),
    }))
    .sort((a, b) => b.score - a.score);

  const counts = { Caldo: 0, Tiepido: 0, Freddo: 0 };
  for (const { segment } of ranked) counts[segment]++;

  // Le opzioni del filtro città vengono dall'elenco completo, non da quello già filtrato,
  // altrimenti sparirebbero le altre città disponibili non appena se ne seleziona una.
  const cities = [...new Set(visitors.map((v) => v.city).filter((c): c is string => !!c))].sort();

  const filtered = ranked.filter(({ visitor, segment }) => {
    if (segmentFilter && segment !== (segmentFilter as LeadSegment)) return false;
    if (cityFilter && visitor.city !== cityFilter) return false;
    return true;
  });

  return (
    <div>
      <AdminPageHeader
        title="Visitatori"
        description={
          visitors.length === 0
            ? "Nessun visitatore ha ancora lasciato il proprio nome sul sito."
            : `${visitors.length} ${visitors.length === 1 ? "persona ha lasciato" : "persone hanno lasciato"} il proprio nome — ${counts.Caldo} caldi, ${counts.Tiepido} tiepidi, ${counts.Freddo} freddi. Ordinati dal lead più promettente.`
        }
      />

      {visitors.length > 0 && <VisitorFilters cities={cities} />}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email newsletter</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Città</TableHead>
              <TableHead>Sorgente</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Registrato il</TableHead>
              <TableHead className="w-16 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(({ visitor, segment }) => (
              <VisitorNameRow
                key={visitor.id}
                visitor={{
                  id: visitor.id,
                  name: visitor.name,
                  topInterest: visitor.topInterest,
                  city: visitor.city,
                  trafficSource: visitor.trafficSource,
                  segment,
                  email: (visitor.visitorId && emailByVisitorId.get(visitor.visitorId)) || null,
                  createdAt: visitor.createdAt.toISOString(),
                }}
              />
            ))}
            {visitors.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nessun visitatore ha ancora lasciato il proprio nome.
                </TableCell>
              </TableRow>
            )}
            {visitors.length > 0 && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nessun visitatore corrisponde ai filtri selezionati.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
