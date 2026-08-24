import type { SeoScore } from "@/lib/seo/analyze";

const SCORE_STYLES: Record<SeoScore, string> = {
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  orange: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  red: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
};

const SCORE_DOT_STYLES: Record<SeoScore, string> = {
  green: "bg-emerald-500",
  orange: "bg-amber-500",
  red: "bg-red-500",
};

export const SEO_SCORE_LABEL: Record<SeoScore, string> = {
  green: "Buono",
  orange: "Da migliorare",
  red: "Insufficiente",
};

export function SeoScoreBadge({ score }: { score: SeoScore }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${SCORE_STYLES[score]}`}>
      {SEO_SCORE_LABEL[score]}
    </span>
  );
}

// Semaforo compatto per le tabelle elenco (blog/progetti): un pallino colorato con il
// punteggio a tooltip, per non dover aprire ogni contenuto per sapere se la SEO va bene.
export function SeoScoreDot({ score }: { score: SeoScore }) {
  return (
    <span
      className="inline-flex items-center justify-center"
      title={`SEO: ${SEO_SCORE_LABEL[score]}`}
    >
      <span className={`size-2.5 rounded-full ${SCORE_DOT_STYLES[score]}`} aria-hidden="true" />
      <span className="sr-only">{SEO_SCORE_LABEL[score]}</span>
    </span>
  );
}
