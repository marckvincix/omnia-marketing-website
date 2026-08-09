import { prisma } from "@/lib/prisma";

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  complained: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
}

export async function getEmailMetrics(): Promise<EmailMetrics> {
  const [sent, delivered, opened, clicked, bounced, complained, unsubscribed] = await Promise.all([
    prisma.emailEvent.count(),
    prisma.emailEvent.count({ where: { deliveredAt: { not: null } } }),
    prisma.emailEvent.count({ where: { openedAt: { not: null } } }),
    prisma.emailEvent.count({ where: { clickedAt: { not: null } } }),
    prisma.emailEvent.count({ where: { status: "BOUNCED" } }),
    prisma.emailEvent.count({ where: { status: "COMPLAINED" } }),
    prisma.newsletterSubscriber.count({ where: { unsubscribedAt: { not: null } } }),
  ]);

  return {
    sent,
    delivered,
    opened,
    clicked,
    bounced,
    complained,
    unsubscribed,
    openRate: sent > 0 ? Math.round((opened / sent) * 100) : 0,
    clickRate: sent > 0 ? Math.round((clicked / sent) * 100) : 0,
  };
}
