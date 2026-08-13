"use client";

import { useState, useTransition } from "react";
import { Reply, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getReplySubject, getReplyTemplate } from "@/lib/email/reply-templates";
import { sendMessageReply } from "./actions";

export function MessageReplyDialog({
  message,
}: {
  message: { id: string; name: string; email: string; service: string | null };
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(getReplySubject());
  const [body, setBody] = useState(() => getReplyTemplate(message.name, message.service));
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (v) {
      setSubject(getReplySubject());
      setBody(getReplyTemplate(message.name, message.service));
      setError(null);
      setSent(false);
    }
  }

  function handleSend() {
    setError(null);
    startTransition(async () => {
      const res = await sendMessageReply(message.id, subject, body);
      if (res.error) {
        setError(res.error);
      } else {
        setSent(true);
        setTimeout(() => setOpen(false), 1200);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => handleOpenChange(true)}
        title="Rispondi"
        className="text-muted-foreground hover:text-foreground"
      >
        <Reply className="size-4" />
      </Button>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rispondi a {message.name}</DialogTitle>
          <DialogDescription>
            La risposta viene inviata a {message.email}. Il messaggio è già precompilato in base al servizio
            richiesto — puoi modificarlo liberamente prima di inviarlo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="reply-subject">Oggetto</Label>
            <Input id="reply-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="reply-body">Messaggio</Label>
            <Textarea
              id="reply-body"
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="resize-none"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleSend} disabled={isPending || sent}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {sent && <Check className="size-4" />}
            {sent ? "Inviata" : "Invia risposta"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
