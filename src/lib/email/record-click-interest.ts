import { prisma } from "@/lib/prisma";

// Un click su un link della newsletter conta come segnale di interesse per la categoria
// dell'articolo collegato alla campagna: usato sia dal webhook Resend (email.clicked) sia
// dal fallback di sync per popolare il profilo interessi di ogni iscritto (SubscriberInterest),
// così da poter segmentare i prossimi invii in base a cosa clicca davvero ciascuno.
export async function recordClickInterest(subscriberId: string, campaignId: string) {
  const campaign = await prisma.emailCampaign.findUnique({
    where: { id: campaignId },
    select: { blogPost: { select: { categoryId: true } } },
  });

  const categoryId = campaign?.blogPost?.categoryId;
  if (!categoryId) return;

  await prisma.subscriberInterest.upsert({
    where: { subscriberId_categoryId: { subscriberId, categoryId } },
    create: { subscriberId, categoryId, clickCount: 1, lastClickedAt: new Date() },
    update: { clickCount: { increment: 1 }, lastClickedAt: new Date() },
  });
}
