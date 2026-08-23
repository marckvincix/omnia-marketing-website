import { prisma } from "@/lib/prisma";

// Limiti del piano Resend Free per l'invio "Transactional" (resend.emails.send), l'unica
// API che il sito usa per ogni email (newsletter, benvenuto, conferme contatto, risposte
// admin). Da aggiornare a mano se in futuro si passa a un piano a pagamento con limiti
// diversi — Resend non espone questo dato tramite API, va controllato su
// resend.com/settings/usage.
export const TRANSACTIONAL_DAILY_LIMIT = 100;
export const TRANSACTIONAL_MONTHLY_LIMIT = 3000;

export interface TransactionalUsage {
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
}

// Conteggio interno (non il dato ufficiale Resend, che non è raggiungibile via API): stima
// quante email il sito ha inviato oggi e questo mese sommando EmailSendLog, scritto da
// sendTrackedEmail per ogni invio andato a buon fine.
export async function getTransactionalUsage(): Promise<TransactionalUsage> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [dailyCount, monthlyCount] = await Promise.all([
    prisma.emailSendLog.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.emailSendLog.count({ where: { createdAt: { gte: startOfMonth } } }),
  ]);

  return {
    dailyCount,
    dailyLimit: TRANSACTIONAL_DAILY_LIMIT,
    monthlyCount,
    monthlyLimit: TRANSACTIONAL_MONTHLY_LIMIT,
  };
}
