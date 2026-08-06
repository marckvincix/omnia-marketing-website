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
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import type { BlogTaxonomyInput } from "@/lib/validation/admin";
import { TaxonomyForm } from "./taxonomy-form";

export function TaxonomyTable({
  items,
  label,
  onSave,
  onDelete,
}: {
  items: BlogTaxonomyInput[];
  label: string;
  onSave: (input: BlogTaxonomyInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <TaxonomyForm
          title={`Nuovo ${label.toLowerCase()}`}
          onSave={onSave}
          trigger={<Button><Plus className="size-4" /> Nuovo {label.toLowerCase()}</Button>}
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-24 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground">/{item.slug}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <TaxonomyForm
                      title={`Modifica ${label.toLowerCase()}`}
                      initial={item}
                      onSave={onSave}
                      trigger={
                        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Modifica">
                          <Pencil className="size-4" />
                        </button>
                      }
                    />
                    <DeleteButton action={() => onDelete(item.id!)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                  Nessun elemento ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
