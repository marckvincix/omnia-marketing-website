"use client";

import { useMemo, useState, useTransition } from "react";
import { CircleCheck, CircleAlert, CircleX, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SeoScoreBadge as ScoreBadge } from "@/components/admin/seo-score-badge";
import { analyzeSeo, analyzeReadability, type SeoAnalysis } from "@/lib/seo/analyze";
import { fetchRelatedKeywords } from "@/lib/seo/actions";
import type { RelatedKeywordsResult } from "@/lib/seo/trends";

function CheckList({ analysis }: { analysis: SeoAnalysis }) {
  return (
    <ul className="flex flex-col gap-2">
      {analysis.checks.map((check) => (
        <li key={check.id} className="flex items-start gap-2 text-sm">
          {check.status === "good" && <CircleCheck className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />}
          {check.status === "ok" && <CircleAlert className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />}
          {check.status === "bad" && <CircleX className="size-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" aria-hidden="true" />}
          <span className="text-muted-foreground">{check.message}</span>
        </li>
      ))}
    </ul>
  );
}

function RelatedKeywordsSection({ focusKeyword }: { focusKeyword: string }) {
  const [result, setResult] = useState<RelatedKeywordsResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFetch() {
    setError(null);
    startTransition(async () => {
      const res = await fetchRelatedKeywords(focusKeyword);
      if (res.ok) setResult(res.data);
      else setError(res.error);
    });
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="block">Parole chiave correlate (Google Trends)</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleFetch} disabled={!focusKeyword.trim() || isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Cerca
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Cosa cercano davvero le persone intorno a &quot;{focusKeyword || "…"}&quot; in Italia, secondo Google
        Trends. Dato non ufficiale: può essere temporaneamente non disponibile.
      </p>

      {error && <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>}

      {result && (
        <div className="flex flex-col gap-3">
          {result.top.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-1.5">Più cercate</p>
              <div className="flex flex-wrap gap-1.5">
                {result.top.map((k) => (
                  <span key={k.query} className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs">
                    {k.query}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result.rising.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-1.5">In crescita</p>
              <div className="flex flex-wrap gap-1.5">
                {result.rising.map((k) => (
                  <span
                    key={k.query}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-700 dark:text-emerald-400"
                  >
                    {k.query}
                    {k.breakout && <span className="font-semibold">↑</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
          {result.top.length === 0 && result.rising.length === 0 && (
            <p className="text-sm text-muted-foreground">Nessun dato disponibile per questa parola chiave.</p>
          )}
        </div>
      )}
    </div>
  );
}

export function SeoAnalysisPanel({
  focusKeyword,
  onFocusKeywordChange,
  seoTitle,
  fallbackTitle,
  seoDescription,
  slug,
  content,
}: {
  focusKeyword: string;
  onFocusKeywordChange: (value: string) => void;
  seoTitle: string;
  fallbackTitle: string;
  seoDescription: string;
  slug: string;
  content: string;
}) {
  const seoAnalysis = useMemo(
    () => analyzeSeo({ focusKeyword, seoTitle, fallbackTitle, seoDescription, slug, content }),
    [focusKeyword, seoTitle, fallbackTitle, seoDescription, slug, content],
  );
  const readability = useMemo(() => analyzeReadability(content), [content]);

  return (
    <div className="border-t border-border pt-4 flex flex-col gap-5">
      <div>
        <Label className="mb-2 block">Analisi SEO</Label>
        <p className="text-xs text-muted-foreground mb-3">
          Punteggio in stile Yoast SEO: imposta una parola chiave principale e segui la checklist per
          ottimizzare titolo, meta description, testo e struttura.
        </p>
        <Input
          placeholder="Parola chiave principale (es. agenzia web Napoli)"
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          className="mb-4"
        />

        <div className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">SEO</span>
              <ScoreBadge score={seoAnalysis.score} />
            </div>
            <CheckList analysis={seoAnalysis} />
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Leggibilità</span>
              <ScoreBadge score={readability.score} />
            </div>
            <CheckList analysis={readability} />
          </div>
        </div>
      </div>

      <RelatedKeywordsSection focusKeyword={focusKeyword} />
    </div>
  );
}
