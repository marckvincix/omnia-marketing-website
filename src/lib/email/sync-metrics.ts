import { prisma } from "@/lib/prisma";
import { resend } from "./resend";
import { EmailEventStatus } from "@/generated/prisma/client";
import { recordClickInterest } from "./record-click-interest";

const TERMINAL_STATUSES: EmailEventStatus[] = ["CLICKED", "BOUNCED", "COMPLAINED"];
const MAX_BATCH = 200;
const RATE_LIMIT_DELAY_MS = 350;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const LAST_EVENT_MAP: Partial<Record<string, { status: EmailEventStatus; fields: string[] }>> = {
  sent: { status: EmailEventStatus.SENT, fields: ["sentAt"] },
  delivered: { status: EmailEventStatus.DELIVERED, fields: ["sentAt", "deliveredAt"] },
  delivery_delayed: { status: EmailEventStatus.DELIVERY_DELAYED, fields: ["sentAt"] },
  opened: { status: EmailEventStatus.OPENED, fields: ["sentAt", "deliveredAt", "openedAt"] },
  clicked: {
    status: EmailEventStatus.CLICKED,
    fields: ["sentAt", "deliveredAt", "openedAt", "clickedAt"],
  },
  bounced: { status: EmailEventStatus.BOUNCED, fields: ["sentAt", "bouncedAt"] },
  complained: {
    status: EmailEventStatus.COMPLAINED,
    fields: ["sentAt", "deliveredAt", "complainedAt"],
  },
};

/**
 * Ripiego per il webhook Resend, che non riesce a raggiungere l'app in sviluppo locale
 * (localhost non è esposto pubblicamente). Interroga l'API Resend per ogni invio non ancora
 * in stato finale e allinea lo stato/le date in base all'evento più avanzato raggiunto
 * (sent < delivered < opened < clicked), riempiendo le tappe intermedie non ancora registrate.
 */
export async function syncEmailMetricsFromResend(): Promise<{
  checked: number;
  updated: number;
  errors: number;
  /** Messaggio del primo errore incontrato, per capire subito la causa (es. chiave Resend
   * con permessi limitati) invece di un generico "nessuna novità" che nasconde il problema. */
  firstErrorMessage: string | null;
}> {
  const pending = await prisma.emailEvent.findMany({
    where: { status: { notIn: TERMINAL_STATUSES } },
    orderBy: { createdAt: "desc" },
    take: MAX_BATCH,
  });

  let updated = 0;
  let errors = 0;
  let firstErrorMessage: string | null = null;

  for (const event of pending) {
    try {
      // L'SDK Resend non lancia un'eccezione sugli errori API: ritorna { data: null, error }.
      // Leggere solo "data" (come prima) faceva fallire ogni richiesta in silenzio, senza
      // errore né log, mostrando un fuorviante "nessuna novità" anche quando la chiave API
      // non aveva i permessi di lettura.
      const { data, error: apiError } = await resend.emails.get(event.resendEmailId);
      if (apiError) {
        throw new Error(apiError.message);
      }

      const mapping = data?.last_event ? LAST_EVENT_MAP[data.last_event] : undefined;

      if (mapping && mapping.status !== event.status) {
        const patch: Record<string, unknown> = { status: mapping.status };
        for (const field of mapping.fields) {
          if (!event[field as keyof typeof event]) {
            patch[field] = new Date();
          }
        }
        await prisma.emailEvent.update({ where: { id: event.id }, data: patch });
        updated++;

        if (mapping.status === EmailEventStatus.CLICKED && event.status !== EmailEventStatus.CLICKED) {
          await recordClickInterest(event.subscriberId, event.campaignId);
        }
      }
    } catch (error) {
      console.error(`Errore sync metriche per ${event.resendEmailId}`, error);
      errors++;
      if (!firstErrorMessage) {
        firstErrorMessage = error instanceof Error ? error.message : "Errore sconosciuto";
      }
    }

    await wait(RATE_LIMIT_DELAY_MS);
  }

  return { checked: pending.length, updated, errors, firstErrorMessage };
}
