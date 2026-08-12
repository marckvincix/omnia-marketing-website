import { prisma } from "@/lib/prisma";
import { resend } from "./resend";
import { EmailEventStatus } from "@/generated/prisma/client";

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
export async function syncEmailMetricsFromResend(): Promise<{ checked: number; updated: number }> {
  const pending = await prisma.emailEvent.findMany({
    where: { status: { notIn: TERMINAL_STATUSES } },
    orderBy: { createdAt: "desc" },
    take: MAX_BATCH,
  });

  let updated = 0;

  for (const event of pending) {
    try {
      const { data } = await resend.emails.get(event.resendEmailId);
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
      }
    } catch (error) {
      console.error(`Errore sync metriche per ${event.resendEmailId}`, error);
    }

    await wait(RATE_LIMIT_DELAY_MS);
  }

  return { checked: pending.length, updated };
}
