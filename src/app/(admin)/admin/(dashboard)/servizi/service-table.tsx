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
import type { ServiceInput } from "@/lib/validation/admin";
import { ServiceForm } from "./service-form";
import { deleteService } from "./actions";

export function ServiceTable({ services }: { services: ServiceInput[] }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <ServiceForm
          trigger={
            <Button>
              <Plus className="size-4" /> Nuovo servizio
            </Button>
          }
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titolo</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Sotto-servizi</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-24 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.title}</TableCell>
                <TableCell className="text-muted-foreground">/{service.slug}</TableCell>
                <TableCell>{service.benefits.length}</TableCell>
                <TableCell>
                  <Badge variant={service.published ? "default" : "secondary"}>
                    {service.published ? "Pubblicato" : "Bozza"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <ServiceForm
                      initial={service}
                      trigger={
                        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Modifica">
                          <Pencil className="size-4" />
                        </button>
                      }
                    />
                    <DeleteButton action={() => deleteService(service.id!)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {services.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nessun servizio ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
