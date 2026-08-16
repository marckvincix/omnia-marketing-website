export interface LeadSignals {
  visitCount: number;
  tier: number;
  interestScore: number;
  contacted: boolean;
}

export type LeadSegment = "Caldo" | "Tiepido" | "Freddo";

// Punteggio 0-100 a partire dai segnali raccolti lato client (nessun dato server-side
// oltre a quello che il visitatore stesso genera navigando): frequenza di ritorno,
// livello di escalation, quante interazioni ha accumulato su qualunque categoria, e se
// ha già inviato il modulo contatti. Chi ci contatta è considerato caldo a prescindere
// dal resto: ha già fatto l'azione che contava davvero.
export function computeLeadScore(signals: LeadSignals): number {
  const visitPoints = Math.min(signals.visitCount * 5, 30);
  const interestPoints = Math.min(signals.interestScore * 3, 30);
  const tierPoints = signals.tier * 10;
  const contactedPoints = signals.contacted ? 40 : 0;
  return Math.min(visitPoints + interestPoints + tierPoints + contactedPoints, 100);
}

export function computeLeadSegment(signals: LeadSignals): LeadSegment {
  if (signals.contacted) return "Caldo";
  const score = computeLeadScore(signals);
  if (score >= 45) return "Caldo";
  if (score >= 20) return "Tiepido";
  return "Freddo";
}
