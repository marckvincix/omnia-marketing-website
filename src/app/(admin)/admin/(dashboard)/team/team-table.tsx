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
import type { TeamMemberInput } from "@/lib/validation/admin";
import { TeamForm } from "./team-form";
import { deleteTeamMember } from "./actions";

export function TeamTable({ members }: { members: TeamMemberInput[] }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <TeamForm trigger={<Button><Plus className="size-4" /> Nuovo membro</Button>} />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Ruolo</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-24 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-muted-foreground">{m.role}</TableCell>
                <TableCell>
                  <Badge variant={m.published ? "default" : "secondary"}>
                    {m.published ? "Visibile" : "Nascosto"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <TeamForm
                      initial={m}
                      trigger={
                        <button className="text-muted-foreground hover:text-foreground transition-colors" title="Modifica">
                          <Pencil className="size-4" />
                        </button>
                      }
                    />
                    <DeleteButton action={() => deleteTeamMember(m.id!)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {members.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Nessun membro del team ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
