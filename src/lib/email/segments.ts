import { prisma } from "@/lib/prisma";
import { FIXED_SEGMENTS, categorySegmentKey, parseCategorySegment } from "./segment-labels";
import type { SegmentKey } from "./segment-labels";

export type { SegmentKey } from "./segment-labels";
export { FIXED_SEGMENTS } from "./segment-labels";

export interface SegmentOption {
  key: SegmentKey;
  label: string;
  description: string;
  count: number;
}

// Segmenti fissi (aperture/click/bounce) + un segmento per ogni categoria di articolo
// (web/branding/social): permette di inviare una newsletter mirata solo a chi ha già
// mostrato interesse per quella categoria, invece che a tutta la lista. Sempre elencate
// tutte, anche senza click ancora registrati, altrimenti il filtro resterebbe invisibile
// finché qualcuno non clicca almeno un link — cosa che non può succedere se il filtro
// stesso non è mai comparso per inviare una prima email mirata.
//
// Ogni opzione porta con sé anche il numero di iscritti attivi che rientrano nel segmento
// (stessa logica di filtro usata dall'invio vero e proprio in send-newsletter.ts), così l'admin
// vede subito a quante persone arriverebbe l'email prima di scegliere.
export async function getSegmentOptions(): Promise<SegmentOption[]> {
  const [categories, activeSubscribers] = await Promise.all([
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.newsletterSubscriber.findMany({ where: { unsubscribedAt: null }, select: { id: true } }),
  ]);
  const activeIds = new Set(activeSubscribers.map((s) => s.id));

  const baseOptions: { key: SegmentKey; label: string; description: string }[] = [
    ...FIXED_SEGMENTS,
    ...categories.map((category) => ({
      key: categorySegmentKey(category.id),
      label: `Interessati: ${category.name}`,
      description: `Ha cliccato almeno un articolo di categoria "${category.name}" in una newsletter precedente.`,
    })),
  ];

  return Promise.all(
    baseOptions.map(async (option) => {
      const ids = await getSubscriberIdsForSegment(option.key);
      const count = ids === null ? activeIds.size : ids.filter((id) => activeIds.has(id)).length;
      return { ...option, count };
    }),
  );
}

export async function getSubscriberIdsForSegment(segment: SegmentKey): Promise<string[] | null> {
  if (segment === "all") return null; // null = nessun filtro, tutti gli attivi

  const categoryId = parseCategorySegment(segment);
  if (categoryId) {
    const rows = await prisma.subscriberInterest.findMany({
      where: { categoryId },
      select: { subscriberId: true },
    });
    return rows.map((r) => r.subscriberId);
  }

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

// Categoria con più click per ciascun iscritto, da mostrare nella lista Iscritti così l'admin
// vede a colpo d'occhio di cosa si interessa davvero ognuno.
export async function getSubscriberTopInterestMap(): Promise<Map<string, string>> {
  const interests = await prisma.subscriberInterest.findMany({
    select: { subscriberId: true, clickCount: true, category: { select: { name: true } } },
    orderBy: { clickCount: "desc" },
  });

  const map = new Map<string, string>();
  for (const interest of interests) {
    if (!map.has(interest.subscriberId)) {
      map.set(interest.subscriberId, interest.category.name);
    }
  }
  return map;
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
