// Utility di solo testo condivise dall'analizzatore SEO: niente di specifico per blog o
// progetti, lavorano su stringhe semplici (markdown o testo semplice) passate dal chiamante.

// Rimuove la sintassi Markdown mantenendo il testo leggibile (i link diventano solo il loro
// testo, i titoli perdono i cancelletti, ecc.) — usato per contare parole/frasi/densità della
// keyword senza che i caratteri di markup sporchino il conteggio.
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/\|/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function extractHeadings(md: string): string[] {
  const matches = md.matchAll(/^#{2,3}\s+(.+)$/gm);
  return Array.from(matches, (m) => m[1].trim());
}

export function extractParagraphs(md: string): string[] {
  return stripMarkdown(md)
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

const SENTENCE_SPLIT = /(?<=[.!?])\s+(?=[A-ZÀ-Ú0-9])/;

export function splitSentences(text: string): string[] {
  return text
    .split(SENTENCE_SPLIT)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function countWords(text: string): number {
  const words = text.trim().match(/[\p{L}\p{N}]+/gu);
  return words ? words.length : 0;
}

// Normalizza per confronti "contiene la keyword" indipendenti da maiuscole/accenti: minuscolo
// + rimozione diacritici, così "città" combacia con "citta" nello slug.
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function containsKeyword(haystack: string, keyword: string): boolean {
  if (!keyword.trim()) return false;
  return normalize(haystack).includes(normalize(keyword));
}

export function slugify(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Occorrenze della keyword nel testo (parola/frase intera, non sottostringa: "app" non deve
// combaciare dentro "whatsapp") — usata per il calcolo della densità.
export function countKeywordOccurrences(text: string, keyword: string): number {
  const trimmed = keyword.trim();
  if (!trimmed) return 0;
  const escaped = normalize(trimmed).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`\\b${escaped}\\b`, "g");
  const matches = normalize(text).match(re);
  return matches ? matches.length : 0;
}
