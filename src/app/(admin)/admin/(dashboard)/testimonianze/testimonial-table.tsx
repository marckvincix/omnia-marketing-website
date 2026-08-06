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
import type { TestimonialInput } from "@/lib/validation/admin";
import { TestimonialForm } from "./testimonial-form";
import { deleteTestimonial } from "./actions";

export function TestimonialTable({
  testimonials,
  projectOptions,
}: {
  testimonials: TestimonialInput[];
  projectOptions: { id: string; client: string }[];
}) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <TestimonialForm
          projectOptions={projectOptions}
          trigger={<Button><Plus className="size-4" /> Nuova testimonianza</Button>}
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autore</TableHead>
              <TableHead>Testimonianza</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-24 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.authorName}</TableCell>
                <TableCell className="text-muted-foreground max-w-md truncate">{t.quote}</TableCell>
                <TableCell>
                  <Badge variant={t.published ? "default" : "secondary"}>
                    {t.published ? "Pubblicata" : "Bozza"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <TestimonialForm
                      initial={t}
                      projectOptions={projectOptions}
                      trigger={
                        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Modifica">
                          <Pencil className="size-4" />
                        </button>
                      }
                    />
                    <DeleteButton action={() => deleteTestimonial(t.id!)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {testimonials.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nessuna testimonianza ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
