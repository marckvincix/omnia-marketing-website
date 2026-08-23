import { prisma } from "@/lib/prisma";

// Limiti del piano Resend Free per l'invio "Transactional" (resend.emails.send), l'unica
// API che il sito usa per ogni email (newsletter, benvenuto, conferme contatto, risposte
// admin). Da aggiornare a mano se in futuro si passa a un piano a pagamento con limiti
// diversi — Resend non espone questo dato tramite API, va controllato su
// resend.com/settings/usage.
export const TRANSACTIONAL_DAILY_LIMIT = 100;
export const TRANSACTIONAL_MONTHLY_LIMIT = 3000;

// Il ciclo mensile di Resend non riparte il giorno 1, ma il giorno 9 di ogni mese (data di
// attivazione dell'account). Il giornaliero invece è una finestra di 24h a partire da
// mezzanotte, quindi coincide con il giorno di calendario.
const BILLING_CYCLE_START_DAY = 9;

// EmailSendLog esiste solo da quando abbiamo aggiunto questo tracciamento: da solo non
// vede le email inviate da Resend prima di allora. Calibrazione una tantum, letta a mano
// dalla dashboard Resend (resend.com/settings/usage) il 24/08/2026 alle 00:43, per allineare
// il conteggio interno a quello reale invece di ripartire da zero. Si "esaurisce" da sola:
// una volta che il giorno o il ciclo mensile corrente supera questo istante, il conteggio
// torna a basarsi solo su EmailSendLog — se serve ricalibrare di nuovo in futuro (es. dopo un
// lungo periodo senza deploy in cui il tracciamento ha perso colpi), aggiorna qui i valori con
// un nuovo numero e una nuova data letti dalla dashboard.
const CALIBRATION_CAPTURED_AT = new Date("2026-08-24T00:43:00+02:00");
const DAILY_BASELINE = 12;
const MONTHLY_BASELINE = 33;

export interface TransactionalUsage {
  dailyCount: number;
  dailyLimit: number;
  monthlyCount: number;
  monthlyLimit: number;
}

function startOfDay(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfBillingCycle(now: Date): Date {
  const day = now.getDate();
  if (day >= BILLING_CYCLE_START_DAY) {
    return new Date(now.getFullYear(), now.getMonth(), BILLING_CYCLE_START_DAY);
  }
  return new Date(now.getFullYear(), now.getMonth() - 1, BILLING_CYCLE_START_DAY);
}

// Conta gli invii tracciati da noi in un periodo, aggiungendo la baseline di calibrazione
// solo se è stata catturata dentro quello stesso periodo (altrimenti il periodo è già
// cambiato da allora e la baseline apparteneva al ciclo precedente, non a questo).
async function countSince(periodStart: Date, baseline: number): Promise<number> {
  if (CALIBRATION_CAPTURED_AT >= periodStart) {
    const trackedSinceCalibration = await prisma.emailSendLog.count({
      where: { createdAt: { gt: CALIBRATION_CAPTURED_AT } },
    });
    return baseline + trackedSinceCalibration;
  }
  return prisma.emailSendLog.count({ where: { createdAt: { gte: periodStart } } });
}

// Conteggio interno (non il dato ufficiale Resend, che non è raggiungibile via API): stima
// quante email il sito ha inviato oggi e in questo ciclo mensile sommando EmailSendLog
// (scritto da sendTrackedEmail per ogni invio andato a buon fine) sopra la baseline di
// calibrazione finché resta valida.
export async function getTransactionalUsage(): Promise<TransactionalUsage> {
  const now = new Date();

  const [dailyCount, monthlyCount] = await Promise.all([
    countSince(startOfDay(now), DAILY_BASELINE),
    countSince(startOfBillingCycle(now), MONTHLY_BASELINE),
  ]);

  return {
    dailyCount,
    dailyLimit: TRANSACTIONAL_DAILY_LIMIT,
    monthlyCount,
    monthlyLimit: TRANSACTIONAL_MONTHLY_LIMIT,
  };
}
