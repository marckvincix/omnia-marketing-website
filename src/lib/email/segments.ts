import { prisma } from "@/lib/prisma";
import type { SegmentKey } from "./segment-labels";

export type { SegmentKey } from "./segment-labels";
export { SEGMENTS } from "./segment-labels";

export async function getSubscriberIdsForSegment(segment: SegmentKey): Promise<string[] | null> {
  if (segment === "all") return null; // null = nessun filtro, tutti gli attivi

  if (segment === "openers") {
    const rows = await prisma.emailEvent.findMany({
      where: { status: { in: ["OPENED", "CLICKED"] } },
      select: { subscriberId: true },
      distinct: ["subscriberId"],
    });
    return rows.map((r) => r.subscriberId);
  }

  if (segment === "clickers") {
    const rows = await prisma.emailEvent.findMany({
      where: { status: "CLICKED" },
      select: { subscriberId: true },
      distinct: ["subscriberId"],
    });
    return rows.map((r) => r.subscriberId);
  }

  if (segment === "bounced") {
    const rows = await prisma.emailEvent.findMany({
      where: { status: "BOUNCED" },
      select: { subscriberId: true },
      distinct: ["subscriberId"],
    });
    return rows.map((r) => r.subscriberId);
  }

  if (segment === "never_opened") {
    const [sent, opened] = await Promise.all([
      prisma.emailEvent.findMany({ select: { subscriberId: true }, distinct: ["subscriberId"] }),
      prisma.emailEvent.findMany({
        where: { status: { in: ["OPENED", "CLICKED"] } },
        select: { subscriberId: true },
        distinct: ["subscriberId"],
      }),
    ]);
    const openedIds = new Set(opened.map((r) => r.subscriberId));
    return sent.map((r) => r.subscriberId).filter((id) => !openedIds.has(id));
  }

  return null;
}

export interface SubscriberEngagement {
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
}

export async function getSubscriberEngagementMap(): Promise<Map<string, SubscriberEngagement>> {
  const events = await prisma.emailEvent.findMany({
    select: { subscriberId: true, status: true },
  });

  const map = new Map<string, SubscriberEngagement>();
  for (const event of events) {
    const entry = map.get(event.subscriberId) ?? {
      sentCount: 0,
      openedCount: 0,
      clickedCount: 0,
      bouncedCount: 0,
    };
    entry.sentCount++;
    if (event.status === "OPENED" || event.status === "CLICKED") entry.openedCount++;
    if (event.status === "CLICKED") entry.clickedCount++;
    if (event.status === "BOUNCED") entry.bouncedCount++;
    map.set(event.subscriberId, entry);
  }
  return map;
}
