import { prisma } from "@/lib/prisma";
import { resend, RESEND_FROM_EMAIL } from "./resend";
import { renderNewsletterEmail } from "./newsletter-template";
import { getSubscriberIdsForSegment, type SegmentKey } from "./segments";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendNewsletterForPost(postId: string, segment: SegmentKey = "all") {
  const post = await prisma.blogPost.findUniqueOrThrow({ where: { id: postId } });

  const segmentIds = await getSubscriberIdsForSegment(segment);
  const subscribers = await prisma.newsletterSubscriber.findMany({
    where: {
      unsubscribedAt: null,
      ...(segmentIds ? { id: { in: segmentIds } } : {}),
    },
  });

  if (subscribers.length === 0) {
    return { sent: 0, total: 0 };
  }

  const campaign = await prisma.emailCampaign.create({
    data: {
      subject: post.title,
      blogPostId: post.id,
      totalRecipients: subscribers.length,
    },
  });

  const articleUrl = `${SITE_URL}/blog/${post.slug}`;
  let sent = 0;

  for (const subscriber of subscribers) {
    const unsubscribeUrl = `${SITE_URL}/disiscriviti?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
    const html = renderNewsletterEmail({
      title: post.title,
      excerpt: post.excerpt,
      articleUrl,
      unsubscribeUrl,
      siteUrl: SITE_URL,
    });

    try {
      const { data, error } = await resend.emails.send({
        from: RESEND_FROM_EMAIL,
        to: subscriber.email,
        subject: post.title,
        html,
      });
      if (error || !data) {
        console.error(`Errore invio newsletter a ${subscriber.email}`, error);
      } else {
        sent++;
        await prisma.emailEvent.create({
          data: {
            campaignId: campaign.id,
            subscriberId: subscriber.id,
            resendEmailId: data.id,
            status: "SENT",
            sentAt: new Date(),
          },
        });
      }
    } catch (error) {
      console.error(`Errore invio newsletter a ${subscriber.email}`, error);
    }

    // Resta sotto i limiti di rate del piano Resend.
    await wait(400);
  }

  if (sent > 0) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { newsletterSentAt: new Date() },
    });
  }

  return { sent, total: subscribers.length };
}
