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
import { computeLeadScore, computeLeadSegment } from "@/lib/lead-score";
import { VisitorNameRow } from "./visitor-name-row";

export const metadata: Metadata = {
  title: "Visitatori",
  robots: { index: false, follow: false },
};

export default async function AdminVisitorsPage() {
  const visitors = await prisma.visitorName.findMany({ orderBy: { createdAt: "desc" } });

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

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Città</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Registrato il</TableHead>
              <TableHead className="w-16 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ranked.map(({ visitor, segment }) => (
              <VisitorNameRow
                key={visitor.id}
                visitor={{
                  id: visitor.id,
                  name: visitor.name,
                  topInterest: visitor.topInterest,
                  city: visitor.city,
                  segment,
                  createdAt: visitor.createdAt.toISOString(),
                }}
              />
            ))}
            {visitors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nessun visitatore ha ancora lasciato il proprio nome.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
