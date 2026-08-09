"use client";

import Link from "next/link";
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
import { deleteProject } from "./actions";

export interface ProjectRowData {
  id: string;
  client: string;
  category: string;
  slug: string;
  published: boolean;
}

export function ProjectTable({ projects }: { projects: ProjectRowData[] }) {
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button render={<Link href="/admin/progetti/nuovo" />}>
          <Plus className="size-4" /> Nuovo progetto
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="w-24 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.client}</TableCell>
                <TableCell className="text-muted-foreground">{project.category}</TableCell>
                <TableCell className="text-muted-foreground">/progetti/{project.slug}</TableCell>
                <TableCell>
                  <Badge variant={project.published ? "default" : "secondary"}>
                    {project.published ? "Pubblicato" : "Bozza"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/progetti/${project.id}`}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Modifica"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <DeleteButton action={() => deleteProject(project.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nessun progetto ancora.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
