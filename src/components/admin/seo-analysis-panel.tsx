"use client";

import { useMemo, useState, useTransition } from "react";
import { CircleCheck, CircleAlert, CircleX, Loader2, Search, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SeoScoreBadge as ScoreBadge } from "@/components/admin/seo-score-badge";
import { analyzeSeo, analyzeReadability, type SeoAnalysis } from "@/lib/seo/analyze";
import { fetchRelatedKeywords, fetchPageSearchConsoleInsights } from "@/lib/seo/actions";
import type { RelatedKeywordsResult } from "@/lib/seo/trends";
import type { SearchConsoleQueryRow } from "@/lib/seo/search-console";

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

function SearchConsoleSection({ pagePath }: { pagePath: string }) {
  const [result, setResult] = useState<{
    overview: { clicks: number; impressions: number; ctr: number; position: number };
    topQueries: SearchConsoleQueryRow[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFetch() {
    setError(null);
    startTransition(async () => {
      const res = await fetchPageSearchConsoleInsights(pagePath);
      if (res.ok) setResult(res.data);
      else setError(res.error);
    });
  }

  return (
    <div className="border-t border-border pt-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="block">Performance su Google (Search Console)</Label>
        <Button type="button" variant="outline" size="sm" onClick={handleFetch} disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <BarChart3 className="size-4" />}
          Aggiorna
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Click, impression e posizione media reali su Google per questa pagina, ultimi 30 giorni.
      </p>

      {error && <p className="text-sm text-amber-600 dark:text-amber-400">{error}</p>}

      {result && (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            <div className="rounded-lg border border-border p-2.5">
              <p className="text-[11px] text-muted-foreground">Click</p>
              <p className="text-lg font-semibold">{result.overview.clicks}</p>
            </div>
            <div className="rounded-lg border border-border p-2.5">
              <p className="text-[11px] text-muted-foreground">Impression</p>
              <p className="text-lg font-semibold">{result.overview.impressions}</p>
            </div>
            <div className="rounded-lg border border-border p-2.5">
              <p className="text-[11px] text-muted-foreground">CTR</p>
              <p className="text-lg font-semibold">{(result.overview.ctr * 100).toFixed(1)}%</p>
            </div>
            <div className="rounded-lg border border-border p-2.5">
              <p className="text-[11px] text-muted-foreground">Posizione</p>
              <p className="text-lg font-semibold">{result.overview.position.toFixed(1)}</p>
            </div>
          </div>

          {result.topQueries.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-1.5">Query che portano traffico a questa pagina</p>
              <ul className="flex flex-col gap-1">
                {result.topQueries.map((q) => (
                  <li key={q.query} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">{q.query}</span>
                    <span className="shrink-0 text-xs text-muted-foreground ml-2">
                      {q.clicks} click · pos. {q.position.toFixed(1)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.overview.impressions === 0 && (
            <p className="text-sm text-muted-foreground">
              Nessuna impression registrata negli ultimi 30 giorni per questa pagina.
            </p>
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
  pagePath,
}: {
  focusKeyword: string;
  onFocusKeywordChange: (value: string) => void;
  seoTitle: string;
  fallbackTitle: string;
  seoDescription: string;
  slug: string;
  content: string;
  // Percorso pubblico della pagina (es. "/blog/il-mio-slug"), per interrogare Search
  // Console su questo contenuto specifico invece che sull'intero sito.
  pagePath: string;
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
      <SearchConsoleSection pagePath={pagePath} />
    </div>
  );
}
