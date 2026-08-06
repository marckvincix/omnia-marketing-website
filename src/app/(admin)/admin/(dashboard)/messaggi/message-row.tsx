"use client";

import { useTransition } from "react";
import { Mail, MailOpen, Loader2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { toggleHandled, deleteMessage } from "./actions";

export interface MessageRowData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  handled: boolean;
  createdAt: string;
}

export function MessageRow({ message }: { message: MessageRowData }) {
  const [isPending, startTransition] = useTransition();

  return (
    <TableRow className={message.handled ? "opacity-60" : undefined}>
      <TableCell>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => toggleHandled(message.id, !message.handled))}
          title={message.handled ? "Segna da leggere" : "Segna come gestito"}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : message.handled ? (
            <MailOpen className="size-4" />
          ) : (
            <Mail className="size-4" />
          )}
        </button>
      </TableCell>
      <TableCell className="font-medium">{message.name}</TableCell>
      <TableCell className="text-muted-foreground">
        <a href={`mailto:${message.email}`} className="hover:text-foreground">{message.email}</a>
      </TableCell>
      <TableCell className="text-muted-foreground">{message.phone || "—"}</TableCell>
      <TableCell className="max-w-sm truncate text-muted-foreground">{message.message}</TableCell>
      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
        {new Date(message.createdAt).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })}
      </TableCell>
      <TableCell>
        <Badge variant={message.handled ? "secondary" : "default"}>
          {message.handled ? "Gestito" : "Da leggere"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DeleteButton action={() => deleteMessage(message.id)} />
      </TableCell>
    </TableRow>
  );
}
