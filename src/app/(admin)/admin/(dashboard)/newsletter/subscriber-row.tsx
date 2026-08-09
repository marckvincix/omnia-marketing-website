"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSubscriber } from "./actions";

export interface SubscriberRowData {
  id: string;
  email: string;
  createdAt: string;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
}

export function SubscriberRow({ subscriber }: { subscriber: SubscriberRowData }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{subscriber.email}</TableCell>
      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
        {new Date(subscriber.createdAt).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1.5">
          {subscriber.openedCount > 0 && (
            <Badge variant="secondary">{subscriber.openedCount} aperture</Badge>
          )}
          {subscriber.clickedCount > 0 && (
            <Badge variant="secondary">{subscriber.clickedCount} click</Badge>
          )}
          {subscriber.bouncedCount > 0 && (
            <Badge variant="destructive">rimbalzata</Badge>
          )}
          {subscriber.openedCount === 0 && subscriber.clickedCount === 0 && subscriber.bouncedCount === 0 && (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <DeleteButton action={() => deleteSubscriber(subscriber.id)} />
      </TableCell>
    </TableRow>
  );
}
