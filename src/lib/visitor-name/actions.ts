"use server";

import { prisma } from "@/lib/prisma";

const MAX_NAME_LENGTH = 60;

// Azione pubblica (nessuna sessione admin): chiamata dal popup di benvenuto sul sito,
// solo quando il visitatore ha accettato la personalizzazione nel banner cookie.
export async function recordVisitorName(name: string, visitorId: string) {
  const trimmed = name.trim().slice(0, MAX_NAME_LENGTH);
  if (!trimmed || !visitorId) return;

  await prisma.visitorName.upsert({
    where: { visitorId },
    create: { name: trimmed, visitorId },
    update: { name: trimmed },
  });
}

// Chiamata quando il visitatore revoca il consenso: cancella anche il record server-side,
// non solo i dati locali, per coerenza con "cancella i dati salvati" nelle preferenze cookie.
export async function deleteVisitorNameRecord(visitorId: string) {
  if (!visitorId) return;
  await prisma.visitorName.deleteMany({ where: { visitorId } });
}
