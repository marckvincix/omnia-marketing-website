"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteSubscriber } from "./actions";

export interface SubscriberRowData {
  id: string;
  email: string;
  createdAt: string;
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
      <TableCell className="text-right">
        <DeleteButton action={() => deleteSubscriber(subscriber.id)} />
      </TableCell>
    </TableRow>
  );
}
