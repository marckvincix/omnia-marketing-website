import { prisma } from "@/lib/prisma";
import { sendTrackedEmail, RESEND_FROM_EMAIL } from "./resend";
import { renderNewsletterEmail } from "./newsletter-template";
import { getSubscriberIdsForSegment, type SegmentKey } from "./segments";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendNewsletterForPost(postId: string, segment: SegmentKey = "all") {
  const post = await prisma.blogPost.findUniqueOrThrow({
    where: { id: postId },
    include: { translations: true },
  });
  const translationByLocale = new Map(post.translations.map((t) => [t.locale, t]));

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

  let sent = 0;

  for (const subscriber of subscribers) {
    const locale = subscriber.locale || DEFAULT_LOCALE;
    // Nella lingua di default l'URL non ha prefisso (/blog/slug); nelle altre sì
    // (/en/blog/slug ecc.), stesso schema "as-needed" usato dal routing del sito.
    const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
    const t = translationByLocale.get(locale);
    const title = t?.title || post.title;
    const excerpt = t?.excerpt || post.excerpt;
    const articleUrl = `${SITE_URL}${localePrefix}/blog/${post.slug}`;

    const unsubscribeUrl = `${SITE_URL}/disiscriviti?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.unsubscribeToken}`;
    const html = await renderNewsletterEmail({
      title,
      excerpt,
      articleUrl,
      unsubscribeUrl,
      siteUrl: SITE_URL,
      locale,
    });

    try {
      const { data, error } = await sendTrackedEmail({
        from: RESEND_FROM_EMAIL,
        to: subscriber.email,
        subject: title,
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
