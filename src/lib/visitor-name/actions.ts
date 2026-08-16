"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const MAX_NAME_LENGTH = 60;

export interface VisitorProfileSnapshot {
  topInterest: string | null;
  visitCount: number;
  tier: number;
  interestScore: number;
  contacted: boolean;
}

// L'header di geolocalizzazione lo calcola la rete edge di Vercel per ogni richiesta:
// non leggiamo né salviamo mai l'indirizzo IP del visitatore, solo la città che ne deduce.
async function geoCity(): Promise<string | null> {
  const h = await headers();
  const raw = h.get("x-vercel-ip-city");
  return raw ? decodeURIComponent(raw) : null;
}

// Azione pubblica (nessuna sessione admin): chiamata dal popup di benvenuto sul sito,
// solo quando il visitatore ha accettato la personalizzazione nel banner cookie.
export async function recordVisitorName(
  name: string,
  visitorId: string,
  profile?: Partial<VisitorProfileSnapshot>,
) {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  if (!trimmed || !visitorId) return;

  const city = await geoCity();

  await prisma.visitorName.upsert({
    where: { visitorId },
    create: {
      name: trimmed,
      visitorId,
      city,
      topInterest: profile?.topInterest || null,
      visitCount: profile?.visitCount ?? 1,
      tier: profile?.tier ?? 0,
      interestScore: profile?.interestScore ?? 0,
      contacted: profile?.contacted ?? false,
    },
    update: {
      name: trimmed,
      ...(city ? { city } : {}),
      ...(profile?.topInterest ? { topInterest: profile.topInterest } : {}),
      ...(profile?.visitCount !== undefined ? { visitCount: profile.visitCount } : {}),
      ...(profile?.tier !== undefined ? { tier: profile.tier } : {}),
      ...(profile?.interestScore !== undefined ? { interestScore: profile.interestScore } : {}),
      ...(profile?.contacted !== undefined ? { contacted: profile.contacted } : {}),
    },
  });
}

// Chiamata quando il visitatore revoca il consenso: cancella anche il record server-side,
// non solo i dati locali, per coerenza con "cancella i dati salvati" nelle preferenze cookie.
export async function deleteVisitorNameRecord(visitorId: string) {
  if (!visitorId) return;
  await prisma.visitorName.deleteMany({ where: { visitorId } });
}

// Chiamata ad ogni pagina/interazione tracciata (e quando il visitatore ci contatta):
// aggiorna i segnali usati per il punteggio lead per un visitatore che ha già lasciato
// il nome. Se non esiste ancora un record per questo visitorId (il nome non è stato
// lasciato) non fa nulla, senza crearne uno vuoto.
export async function syncVisitorProfile(visitorId: string, profile: VisitorProfileSnapshot) {
  if (!visitorId) return;
  await prisma.visitorName.updateMany({
    where: { visitorId },
    data: {
      ...(profile.topInterest ? { topInterest: profile.topInterest } : {}),
      visitCount: profile.visitCount,
      tier: profile.tier,
      interestScore: profile.interestScore,
      contacted: profile.contacted,
    },
  });
}
