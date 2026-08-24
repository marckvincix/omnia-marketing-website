import {
  containsKeyword,
  countKeywordOccurrences,
  countWords,
  extractHeadings,
  extractParagraphs,
  splitSentences,
  stripMarkdown,
} from "./text";

export type CheckStatus = "good" | "ok" | "bad";

export interface SeoCheck {
  id: string;
  status: CheckStatus;
  message: string;
}

export type SeoScore = "green" | "orange" | "red";

export interface SeoAnalysis {
  score: SeoScore;
  percent: number;
  checks: SeoCheck[];
}

function scoreFromChecks(checks: SeoCheck[]): { score: SeoScore; percent: number } {
  const points: Record<CheckStatus, number> = { good: 2, ok: 1, bad: 0 };
  const total = checks.reduce((sum, c) => sum + points[c.status], 0);
  const max = checks.length * 2;
  const percent = max === 0 ? 0 : Math.round((total / max) * 100);
  const score: SeoScore = percent >= 70 ? "green" : percent >= 40 ? "orange" : "red";
  return { score, percent };
}

// Elenco curato di parole di collegamento italiane (connettivi logici/testuali), sullo stesso
// principio delle liste per lingua usate da Yoast — non esiste un modo affidabile per
// generarla automaticamente, va mantenuta a mano se si vuole ampliarla.
const TRANSITION_WORDS = [
  "inoltre", "tuttavia", "quindi", "infatti", "ad esempio", "per esempio", "in particolare",
  "di conseguenza", "innanzitutto", "in sintesi", "in conclusione", "invece", "infine",
  "anche se", "nonostante", "cioè", "perciò", "dunque", "pertanto", "in primo luogo",
  "in secondo luogo", "d'altra parte", "al contrario", "in altre parole", "soprattutto",
  "in particolar modo", "grazie a", "a causa di", "oltre a", "così come", "non solo", "ma anche",
];

export interface SeoAnalysisInput {
  focusKeyword: string;
  seoTitle: string;
  fallbackTitle: string;
  seoDescription: string;
  slug: string;
  content: string;
}

export function analyzeSeo(input: SeoAnalysisInput): SeoAnalysis {
  const keyword = input.focusKeyword.trim();

  if (!keyword) {
    return {
      score: "red",
      percent: 0,
      checks: [
        {
          id: "noKeyword",
          status: "bad",
          message: "Imposta una parola chiave principale per attivare l'analisi SEO.",
        },
      ],
    };
  }

  const effectiveTitle = input.seoTitle.trim() || input.fallbackTitle.trim();
  const plainText = stripMarkdown(input.content);
  const wordCount = countWords(plainText);
  const paragraphs = extractParagraphs(input.content);
  const firstParagraph = paragraphs[0] ?? "";
  const headings = extractHeadings(input.content);
  const occurrences = countKeywordOccurrences(plainText, keyword);
  const density = wordCount === 0 ? 0 : (occurrences / wordCount) * 100;

  const checks: SeoCheck[] = [];

  checks.push(
    effectiveTitle && containsKeyword(effectiveTitle, keyword)
      ? { id: "keywordInTitle", status: "good", message: "La parola chiave compare nel meta title." }
      : { id: "keywordInTitle", status: "bad", message: "Aggiungi la parola chiave al meta title." },
  );

  checks.push(
    !input.seoDescription.trim()
      ? { id: "keywordInMeta", status: "bad", message: "Manca la meta description." }
      : containsKeyword(input.seoDescription, keyword)
        ? { id: "keywordInMeta", status: "good", message: "La parola chiave compare nella meta description." }
        : { id: "keywordInMeta", status: "bad", message: "Aggiungi la parola chiave alla meta description." },
  );

  checks.push(
    // Lo slug usa i trattini al posto degli spazi: senza questa sostituzione una keyword
    // multi-parola ("tornei sportivi") non avrebbe mai trovato corrispondenza in
    // "tornei-sportivi", anche quando concettualmente lo slug la conteneva davvero.
    containsKeyword(input.slug.replace(/-/g, " "), keyword)
      ? { id: "keywordInSlug", status: "good", message: "La parola chiave compare nello slug (URL)." }
      : { id: "keywordInSlug", status: "bad", message: "Lo slug (URL) non contiene la parola chiave." },
  );

  checks.push(
    containsKeyword(firstParagraph, keyword)
      ? { id: "keywordInFirstParagraph", status: "good", message: "La parola chiave compare nel primo paragrafo." }
      : { id: "keywordInFirstParagraph", status: "bad", message: "Usa la parola chiave nel primo paragrafo del testo." },
  );

  checks.push(
    occurrences === 0
      ? { id: "keywordDensity", status: "bad", message: "La parola chiave non compare nel corpo del testo." }
      : density < 0.5
        ? { id: "keywordDensity", status: "ok", message: `Densità bassa (${density.toFixed(1)}%): usala qualche volta in più.` }
        : density <= 3
          ? { id: "keywordDensity", status: "good", message: `Densità della parola chiave nella norma (${density.toFixed(1)}%).` }
          : { id: "keywordDensity", status: "bad", message: `Densità troppo alta (${density.toFixed(1)}%): rischio keyword stuffing, riducila.` },
  );

  checks.push(
    headings.length === 0
      ? { id: "keywordInSubheading", status: "ok", message: "Aggiungi qualche sottotitolo (##) e usa la parola chiave in almeno uno." }
      : headings.some((h) => containsKeyword(h, keyword))
        ? { id: "keywordInSubheading", status: "good", message: "La parola chiave compare in almeno un sottotitolo." }
        : { id: "keywordInSubheading", status: "bad", message: "Nessun sottotitolo contiene la parola chiave." },
  );

  const titleLen = effectiveTitle.length;
  checks.push(
    titleLen === 0
      ? { id: "titleLength", status: "bad", message: "Manca il meta title." }
      : titleLen < 30
        ? { id: "titleLength", status: "ok", message: `Meta title un po' corto (${titleLen} caratteri, ideale 40-60).` }
        : titleLen <= 60
          ? { id: "titleLength", status: "good", message: `Lunghezza del meta title corretta (${titleLen} caratteri).` }
          : { id: "titleLength", status: "bad", message: `Meta title troppo lungo (${titleLen} caratteri): rischia di essere troncato nei risultati.` },
  );

  const descLen = input.seoDescription.trim().length;
  checks.push(
    descLen === 0
      ? { id: "descLength", status: "bad", message: "Manca la meta description." }
      : descLen < 120
        ? { id: "descLength", status: "ok", message: `Meta description un po' corta (${descLen} caratteri, ideale 120-156).` }
        : descLen <= 156
          ? { id: "descLength", status: "good", message: `Lunghezza della meta description corretta (${descLen} caratteri).` }
          : { id: "descLength", status: "bad", message: `Meta description troppo lunga (${descLen} caratteri): verrà troncata nei risultati.` },
  );

  checks.push(
    wordCount >= 600
      ? { id: "contentLength", status: "good", message: `Testo di ${wordCount} parole: buona lunghezza.` }
      : wordCount >= 300
        ? { id: "contentLength", status: "ok", message: `Testo di ${wordCount} parole: valuta se approfondire ulteriormente.` }
        : { id: "contentLength", status: "bad", message: `Testo troppo corto (${wordCount} parole, minimo consigliato 300).` },
  );

  const hasLinks = /\[[^\]]+]\([^)]+\)/.test(input.content);
  checks.push(
    hasLinks
      ? { id: "links", status: "good", message: "Il testo contiene almeno un link." }
      : { id: "links", status: "ok", message: "Aggiungi almeno un link (interno o esterno) per dare più contesto." },
  );

  return { ...scoreFromChecks(checks), checks };
}

export function analyzeReadability(content: string): SeoAnalysis {
  const plainText = stripMarkdown(content);
  const wordCount = countWords(plainText);
  const sentences = splitSentences(plainText);
  const paragraphs = extractParagraphs(content);
  const headings = extractHeadings(content);

  if (wordCount < 50) {
    return {
      score: "red",
      percent: 0,
      checks: [{ id: "tooShort", status: "bad", message: "Testo troppo corto per essere analizzato." }],
    };
  }

  const checks: SeoCheck[] = [];

  const longSentences = sentences.filter((s) => countWords(s) > 20).length;
  const longSentenceRatio = sentences.length === 0 ? 0 : longSentences / sentences.length;
  checks.push(
    longSentenceRatio <= 0.25
      ? { id: "sentenceLength", status: "good", message: "Le frasi hanno una lunghezza scorrevole." }
      : longSentenceRatio <= 0.4
        ? { id: "sentenceLength", status: "ok", message: `${Math.round(longSentenceRatio * 100)}% delle frasi è lungo: valuta di accorciarne qualcuna.` }
        : { id: "sentenceLength", status: "bad", message: `${Math.round(longSentenceRatio * 100)}% delle frasi supera le 20 parole: dividile.` },
  );

  const longParagraph = paragraphs.some((p) => countWords(p) > 150);
  checks.push(
    longParagraph
      ? { id: "paragraphLength", status: "bad", message: "Alcuni paragrafi sono troppo lunghi (oltre 150 parole): dividili." }
      : { id: "paragraphLength", status: "good", message: "I paragrafi hanno una lunghezza equilibrata." },
  );

  checks.push(
    wordCount > 300 && headings.length === 0
      ? { id: "subheadings", status: "bad", message: "Il testo è lungo ma non ha sottotitoli: aggiungine per renderlo più scorrevole." }
      : { id: "subheadings", status: "good", message: wordCount <= 300 ? "Testo abbastanza breve da non richiedere sottotitoli." : "I sottotitoli suddividono bene il testo." },
  );

  const sentencesWithTransition = sentences.filter((s) => {
    const normalized = s.toLowerCase();
    return TRANSITION_WORDS.some((w) => normalized.includes(w));
  }).length;
  const transitionRatio = sentences.length === 0 ? 0 : sentencesWithTransition / sentences.length;
  checks.push(
    transitionRatio >= 0.3
      ? { id: "transitionWords", status: "good", message: "Usi parole di collegamento a sufficienza." }
      : transitionRatio >= 0.2
        ? { id: "transitionWords", status: "ok", message: "Usa qualche parola di collegamento in più (es. \"inoltre\", \"tuttavia\", \"quindi\")." }
        : { id: "transitionWords", status: "bad", message: "Poche parole di collegamento: il testo può risultare frammentato." },
  );

  return { ...scoreFromChecks(checks), checks };
}
