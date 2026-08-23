export type FixedSegmentKey = "all" | "openers" | "clickers" | "never_opened" | "bounced";

// I segmenti per interesse sono dinamici (uno per ogni BlogCategory: web/branding/social),
// quindi la chiave non è un enum fisso ma "category:<id categoria>".
export type SegmentKey = FixedSegmentKey | `category:${string}`;

export const CATEGORY_SEGMENT_PREFIX = "category:";

export function categorySegmentKey(categoryId: string): SegmentKey {
  return `${CATEGORY_SEGMENT_PREFIX}${categoryId}`;
}

export function parseCategorySegment(segment: SegmentKey): string | null {
  return segment.startsWith(CATEGORY_SEGMENT_PREFIX)
    ? segment.slice(CATEGORY_SEGMENT_PREFIX.length)
    : null;
}

export const FIXED_SEGMENTS: { key: FixedSegmentKey; label: string; description: string }[] = [
  { key: "all", label: "Tutti gli iscritti", description: "L'intera mailing list attiva." },
  { key: "openers", label: "Ha aperto almeno un'email", description: "Iscritti più coinvolti." },
  { key: "clickers", label: "Ha cliccato un link", description: "Iscritti che interagiscono di più." },
  { key: "never_opened", label: "Non ha mai aperto", description: "Ha ricevuto email ma non le ha mai aperte." },
  { key: "bounced", label: "Email rimbalzate", description: "Consegna fallita: da verificare o rimuovere." },
];
