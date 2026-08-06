"use client";

import { Pencil, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import type { FaqInput } from "@/lib/validation/admin";
import { FaqForm } from "./faq-form";
import { deleteFaq } from "./actions";

export function FaqTable({
  faqs,
  serviceOptions,
}: {
  faqs: FaqInput[];
  serviceOptions: { id: string; title: string }[];
}) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <FaqForm serviceOptions={serviceOptions} trigger={<Button><Plus className="size-4" /> Nuova FAQ</Button>} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domanda</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-24 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faqs.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-medium max-w-lg">{f.question}</TableCell>
                <TableCell>
                  <Badge variant={f.published ? "default" : "secondary"}>
                    {f.published ? "Pubblicata" : "Bozza"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <FaqForm
                      initial={f}
                      serviceOptions={serviceOptions}
                      trigger={
                        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Modifica">
                          <Pencil className="size-4" />
                        </button>
                      }
                    />
                    <DeleteButton action={() => deleteFaq(f.id!)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {faqs.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Nessuna FAQ ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
