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
import { SeoScoreDot } from "@/components/admin/seo-score-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import type { SeoScore } from "@/lib/seo/analyze";
import type { PagePerformance } from "@/lib/seo/search-console";
import { deleteProject } from "./actions";

export interface ProjectRowData {
  id: string;
  client: string;
  category: string[];
  published: boolean;
  seoScore: SeoScore;
  performance: PagePerformance | null;
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
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-auto">Cliente</TableHead>
              <TableHead className="w-32">Categoria</TableHead>
              <TableHead className="w-12">SEO</TableHead>
              <TableHead className="w-32">Performance</TableHead>
              <TableHead className="w-24">Stato</TableHead>
              <TableHead className="w-16 text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium truncate" title={project.client}>
                  {project.client}
                </TableCell>
                <TableCell className="text-muted-foreground truncate" title={project.category.join(" · ")}>
                  {project.category.join(" · ")}
                </TableCell>
                <TableCell>
                  <SeoScoreDot score={project.seoScore} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {project.performance
                    ? `${project.performance.clicks} clic · ${project.performance.impressions} impr.`
                    : "—"}
                </TableCell>
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
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
