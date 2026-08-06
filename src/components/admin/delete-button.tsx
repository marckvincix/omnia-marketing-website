"use client";

import { useEffect, useState, useTransition } from "react";
import { Trash2, Loader2, Check } from "lucide-react";

export function DeleteButton({ action }: { action: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(timer);
  }, [confirming]);

  if (confirming) {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setConfirming(false);
          startTransition(() => {
            action();
          });
        }}
        className="flex items-center gap-1 text-xs font-medium text-destructive hover:opacity-80 transition-opacity disabled:opacity-50"
        title="Conferma eliminazione"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Check className="size-4" aria-hidden="true" />
        )}
        Conferma
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-muted-foreground hover:text-destructive transition-colors"
      title="Elimina"
      aria-label="Elimina"
    >
      <Trash2 className="size-4" aria-hidden="true" />
    </button>
  );
}
