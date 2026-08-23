import { getDeepLUsage } from "@/lib/i18n/deepl";

// Le chiavi DeepL Free sono su un endpoint/piano separato da quelle a pagamento: non
// possono trasformarsi in una fattura a sorpresa da sole. L'unico rischio reale è restare
// senza traduzioni fino al reset mensile (il 1° del mese), quindi qui avvisiamo prima che
// succeda, non solo dopo.
export async function DeeplUsageCard() {
  let usage: { characterCount: number; characterLimit: number } | null = null;
  let error: string | null = null;

  try {
    usage = await getDeepLUsage();
  } catch (err) {
    error = err instanceof Error ? err.message : "Errore sconosciuto";
  }

  if (!usage) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm mb-8">
        <p className="font-medium text-amber-600 dark:text-amber-400">
          Traduzioni automatiche: impossibile leggere lo stato di DeepL
        </p>
        <p className="mt-1 text-muted-foreground">{error}</p>
      </div>
    );
  }

  const percent = Math.round((usage.characterCount / usage.characterLimit) * 100);
  const exhausted = usage.characterCount >= usage.characterLimit;
  const nearLimit = percent >= 90;

  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-8">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Traduzioni automatiche (DeepL Free)</p>
        <p className="text-sm text-muted-foreground">
          {usage.characterCount.toLocaleString("it-IT")} / {usage.characterLimit.toLocaleString("it-IT")} caratteri
          questo mese
        </p>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${exhausted ? "bg-destructive" : nearLimit ? "bg-amber-500" : "bg-primary"}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {exhausted && (
        <p className="mt-3 text-sm text-destructive">
          Quota mensile esaurita: le nuove traduzioni sono in pausa fino al reset del 1° del mese prossimo. I
          contenuti già tradotti restano visibili, quelli nuovi mostrano l&apos;italiano finché la quota non si
          rinnova.
        </p>
      )}
      {!exhausted && nearLimit && (
        <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
          Stai per esaurire la quota gratuita mensile: se serve più margine, valuta un piano DeepL a pagamento prima
          che le traduzioni si interrompano.
        </p>
      )}
    </div>
  );
}
