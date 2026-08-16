"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import type { LeadSegment } from "@/lib/lead-score";
import { deleteVisitorName } from "./actions";

const INTEREST_LABELS: Record<string, string> = {
  web: "Sito Web",
  branding: "Branding",
  social: "Social",
};

const SEGMENT_STYLES: Record<LeadSegment, string> = {
  Caldo: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Tiepido: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Freddo: "border-border bg-muted/40 text-muted-foreground",
};

export interface VisitorNameRowData {
  id: string;
  name: string;
  topInterest: string | null;
  city: string | null;
  segment: LeadSegment;
  createdAt: string;
}

export function VisitorNameRow({ visitor }: { visitor: VisitorNameRowData }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{visitor.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className={SEGMENT_STYLES[visitor.segment]}>
          {visitor.segment}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">
        {visitor.city || "—"}
      </TableCell>
      <TableCell>
        {visitor.topInterest ? (
          <Badge variant="secondary">
            {INTEREST_LABELS[visitor.topInterest] ?? visitor.topInterest}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
        {new Date(visitor.createdAt).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell className="text-right">
        <DeleteButton action={() => deleteVisitorName(visitor.id)} />
      </TableCell>
    </TableRow>
  );
}
