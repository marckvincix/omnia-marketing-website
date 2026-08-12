"use client";

import { useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { syncMetrics } from "./actions";

export function SyncMetricsButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function handleSync() {
    setResult(null);
    startTransition(async () => {
      const res = await syncMetrics();
      setResult(
        res.updated > 0
          ? `Aggiornate ${res.updated}/${res.checked} email`
          : `Nessuna novità (${res.checked} email controllate)`,
      );
    });
  }

  return (
    <div className="flex items-center gap-3">
      {result && <span className="text-xs text-muted-foreground">{result}</span>}
      <Button size="sm" variant="outline" disabled={isPending} onClick={handleSync}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
        Aggiorna metriche da Resend
      </Button>
    </div>
  );
}
