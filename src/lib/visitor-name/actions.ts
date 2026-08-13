"use server";

import { prisma } from "@/lib/prisma";

const MAX_NAME_LENGTH = 60;

// Azione pubblica (nessuna sessione admin): chiamata dal popup di benvenuto sul sito,
// solo quando il visitatore ha accettato la personalizzazione nel banner cookie.
export async function recordVisitorName(name: string, visitorId: string, topInterest?: string | null) {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  if (!trimmed || !visitorId) return;

  await prisma.visitorName.upsert({
    where: { visitorId },
    create: { name: trimmed, visitorId, topInterest: topInterest || null },
    update: { name: trimmed, ...(topInterest ? { topInterest } : {}) },
  });
}

// Chiamata quando il visitatore revoca il consenso: cancella anche il record server-side,
// non solo i dati locali, per coerenza con "cancella i dati salvati" nelle preferenze cookie.
export async function deleteVisitorNameRecord(visitorId: string) {
  if (!visitorId) return;
  await prisma.visitorName.deleteMany({ where: { visitorId } });
}

// Chiamata ad ogni pagina/interazione tracciata: aggiorna l'interesse principale rilevato
// per un visitatore che ha già lasciato il nome. Se non esiste ancora un record per questo
// visitorId (il nome non è stato lasciato) non fa nulla, senza crearne uno vuoto.
export async function syncVisitorInterest(visitorId: string, topInterest: string) {
  if (!visitorId || !topInterest) return;
  await prisma.visitorName.updateMany({ where: { visitorId }, data: { topInterest } });
}
