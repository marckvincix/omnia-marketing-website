"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sendUpdateEmail } from "./actions";

export interface PostSendRowData {
  id: string;
  title: string;
  publishedAt: string | null;
  newsletterSentAt: string | null;
}

export function PostSendRow({ post, subscriberCount }: { post: PostSendRowData; subscriberCount: number }) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function handleSend() {
    setConfirming(false);
    startTransition(async () => {
      const res = await sendUpdateEmail(post.id);
      setResult(`Inviata a ${res.sent}/${res.total} iscritti`);
    });
  }

  return (
    <TableRow>
      <TableCell className="font-medium max-w-sm truncate">{post.title}</TableCell>
      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
        {post.publishedAt
          ? new Date(post.publishedAt).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })
          : "—"}
      </TableCell>
      <TableCell>
        {post.newsletterSentAt ? (
          <Badge variant="secondary">
            Inviata il{" "}
            {new Date(post.newsletterSentAt).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </Badge>
        ) : (
          <Badge variant="outline">Non inviata</Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        {result ? (
          <span className="text-xs text-muted-foreground">{result}</span>
        ) : confirming ? (
          <Button size="sm" variant="destructive" disabled={isPending} onClick={handleSend}>
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Conferma invio"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={subscriberCount === 0}
            onClick={() => setConfirming(true)}
            title={subscriberCount === 0 ? "Nessun iscritto alla newsletter" : undefined}
          >
            <Send className="size-4" />
            {post.newsletterSentAt ? "Invia di nuovo" : "Invia agli iscritti"}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
