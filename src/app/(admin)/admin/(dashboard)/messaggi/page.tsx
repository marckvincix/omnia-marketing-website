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
import { MessageRow } from "./message-row";

export const metadata: Metadata = {
  title: "Messaggi",
  robots: { index: false, follow: false },
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: { select: { title: true } } },
  });

  return (
    <div>
      <AdminPageHeader
        title="Messaggi"
        description="Le richieste ricevute tramite il form contatti del sito."
      />

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefono</TableHead>
              <TableHead>Servizio</TableHead>
              <TableHead>Messaggio</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-16 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((m) => (
              <MessageRow
                key={m.id}
                message={{
                  id: m.id,
                  name: m.name,
                  email: m.email,
                  phone: m.phone,
                  service: m.service?.title ?? null,
                  message: m.message,
                  handled: m.handled,
                  createdAt: m.createdAt.toISOString(),
                }}
              />
            ))}
            {messages.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Nessun messaggio ricevuto ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
