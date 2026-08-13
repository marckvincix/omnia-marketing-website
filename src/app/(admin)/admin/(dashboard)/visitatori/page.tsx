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
import { VisitorNameRow } from "./visitor-name-row";

export const metadata: Metadata = {
  title: "Visitatori",
  robots: { index: false, follow: false },
};

export default async function AdminVisitorsPage() {
  const visitors = await prisma.visitorName.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="Visitatori"
        description={`${visitors.length} ${visitors.length === 1 ? "persona ha lasciato" : "persone hanno lasciato"} il proprio nome sul sito, accettando la personalizzazione.`}
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Registrato il</TableHead>
              <TableHead className="w-16 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitor) => (
              <VisitorNameRow
                key={visitor.id}
                visitor={{
                  id: visitor.id,
                  name: visitor.name,
                  createdAt: visitor.createdAt.toISOString(),
                }}
              />
            ))}
            {visitors.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
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
