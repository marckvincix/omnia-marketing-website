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

export interface PostEmailStats {
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  openRate: number;
  clickRate: number;
}

// Statistiche per articolo (non per singolo invio): un articolo può essere inviato più
// volte ("Invia di nuovo" a un nuovo segmento), quindi qui si sommano tutte le campagne
// collegate a quel blogPostId, invece di mostrare solo l'ultimo invio.
export async function getEmailStatsByPost(): Promise<Map<string, PostEmailStats>> {
  const campaigns = await prisma.emailCampaign.findMany({
    where: { blogPostId: { not: null } },
    select: {
      blogPostId: true,
      events: { select: { openedAt: true, clickedAt: true, status: true } },
    },
  });

  const map = new Map<string, PostEmailStats>();
  for (const campaign of campaigns) {
    if (!campaign.blogPostId) continue;
    const entry = map.get(campaign.blogPostId) ?? {
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
      openRate: 0,
      clickRate: 0,
    };
    for (const event of campaign.events) {
      entry.sentCount++;
      if (event.openedAt) entry.openedCount++;
      if (event.clickedAt) entry.clickedCount++;
      if (event.status === "BOUNCED") entry.bouncedCount++;
    }
    map.set(campaign.blogPostId, entry);
  }

  for (const entry of map.values()) {
    entry.openRate = entry.sentCount > 0 ? Math.round((entry.openedCount / entry.sentCount) * 100) : 0;
    entry.clickRate = entry.sentCount > 0 ? Math.round((entry.clickedCount / entry.sentCount) * 100) : 0;
  }

  return map;
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
