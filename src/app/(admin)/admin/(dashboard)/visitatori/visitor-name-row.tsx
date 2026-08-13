"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteVisitorName } from "./actions";

const INTEREST_LABELS: Record<string, string> = {
  web: "Sito Web",
  branding: "Branding",
  social: "Social",
};

export interface VisitorNameRowData {
  id: string;
  name: string;
  topInterest: string | null;
  createdAt: string;
}

export function VisitorNameRow({ visitor }: { visitor: VisitorNameRowData }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{visitor.name}</TableCell>
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
