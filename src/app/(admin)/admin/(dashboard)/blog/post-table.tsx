"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SeoScoreDot } from "@/components/admin/seo-score-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import type { SeoScore } from "@/lib/seo/analyze";
import type { PagePerformance } from "@/lib/seo/search-console";
import { deleteBlogPost } from "./actions";

export interface PostRow {
  id: string;
  title: string;
  categoryName: string | null;
  published: boolean;
  seoScore: SeoScore;
  performance: PagePerformance | null;
}

export function PostTable({ posts }: { posts: PostRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-auto">Titolo</TableHead>
            <TableHead className="w-24">Categoria</TableHead>
            <TableHead className="w-12">SEO</TableHead>
            <TableHead className="w-32">Performance</TableHead>
            <TableHead className="w-24">Stato</TableHead>
            <TableHead className="w-16 text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium truncate" title={post.title}>
                {post.title}
              </TableCell>
              <TableCell className="text-muted-foreground truncate">{post.categoryName ?? "—"}</TableCell>
              <TableCell>
                <SeoScoreDot score={post.seoScore} />
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {post.performance
                  ? `${post.performance.clicks} clic · ${post.performance.impressions} impr.`
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Pubblicato" : "Bozza"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/blog/${post.id}`} className="text-muted-foreground hover:text-foreground transition-colors" title="Modifica">
                    <Pencil className="size-4" />
                  </Link>
                  <DeleteButton action={() => deleteBlogPost(post.id)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
          {posts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Nessun articolo ancora.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
