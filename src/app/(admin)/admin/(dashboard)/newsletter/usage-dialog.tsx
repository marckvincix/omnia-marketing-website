"use client";

import { useState, useTransition } from "react";
import { Loader2, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTransactionalUsageStats } from "./actions";
import type { TransactionalUsage } from "@/lib/email/usage";

function UsageBar({ label, count, limit }: { label: string; count: number; limit: number }) {
  const percent = Math.round((count / limit) * 100);
  const exhausted = count >= limit;
  const nearLimit = percent >= 90;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          {count.toLocaleString("it-IT")} / {limit.toLocaleString("it-IT")}
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${exhausted ? "bg-destructive" : nearLimit ? "bg-amber-500" : "bg-primary"}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function UsageDialog() {
  const [isPending, startTransition] = useTransition();
  const [usage, setUsage] = useState<TransactionalUsage | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleOpenChange(open: boolean) {
    if (!open) return;
    setError(null);
    startTransition(async () => {
      try {
        setUsage(await getTransactionalUsageStats());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Errore sconosciuto");
      }
    });
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            <Gauge className="size-4" />
            Consumi
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Consumi invio email (Resend)</DialogTitle>
          <DialogDescription>
            Conteggio interno, non il dato ufficiale Resend: Resend non espone i propri limiti
            tramite API pubblica, solo nella dashboard. Qui contiamo ogni email che il sito ha
            davvero inviato (newsletter, benvenuto, conferme contatto, risposte admin), tutte
            sotto il limite &quot;Transactional&quot; del piano.
          </DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Caricamento in corso…
          </div>
        )}

        {!isPending && error && <p className="text-sm text-destructive py-4">{error}</p>}

        {!isPending && usage && (
          <div className="flex flex-col gap-5 py-2">
            <UsageBar label="Oggi" count={usage.dailyCount} limit={usage.dailyLimit} />
            <UsageBar label="Questo mese" count={usage.monthlyCount} limit={usage.monthlyLimit} />
            <p className="text-xs text-muted-foreground">
              Per il dato ufficiale e i limiti del piano Marketing (contatti, segmenti,
              broadcast — non usati da questo sito), vedi{" "}
              <a
                href="https://resend.com/settings/usage"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-foreground"
              >
                resend.com/settings/usage
              </a>
              .
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
