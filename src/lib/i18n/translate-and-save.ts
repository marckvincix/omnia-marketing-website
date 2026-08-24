import { prisma } from "@/lib/prisma";
import { translateEntityFields } from "./translate-content";
import { DeepLQuotaExceededError } from "./deepl";
import { TARGET_LOCALES, type Locale } from "./locales";

type TargetLocale = Exclude<Locale, "it">;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Traduce un set di campi nelle 7 lingue target e salva ogni risultato tramite
 * `saveTranslation`. Ogni lingua è indipendente: se la quota DeepL si esaurisce a metà,
 * le lingue già tradotte restano salvate e ci si ferma lì invece di continuare a
 * chiamare un'API che rifiuterebbe comunque le richieste successive. La pausa tra una
 * lingua e l'altra evita di sforare il rate limit per-secondo di DeepL quando si
 * traducono più contenuti in sequenza (es. lo script di backfill iniziale).
 */
async function translateAndSaveAllLocales(
  fields: Record<string, string | null | undefined>,
  saveTranslation: (locale: TargetLocale, translated: Record<string, string>) => Promise<unknown>,
): Promise<void> {
  for (const locale of TARGET_LOCALES) {
    try {
      const translated = await translateEntityFields(fields, locale);
      await saveTranslation(locale, translated as Record<string, string>);
    } catch (err) {
      if (err instanceof DeepLQuotaExceededError) {
        console.error(`[i18n] Quota DeepL esaurita: traduzione interrotta a "${locale}".`);
        return;
      }
      console.error(`[i18n] Errore traduzione verso "${locale}"`, err);
    }
    await wait(350);
  }
}

export async function translateAndSaveBlogPost(postId: string) {
  const post = await prisma.blogPost.findUnique({ where: { id: postId } });
  if (!post) return;
  await translateAndSaveAllLocales(
    {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      geoTitle: post.geoTitle,
      geoDescription: post.geoDescription,
    },
    (locale, t) =>
      prisma.blogPostTranslation.upsert({
        where: { postId_locale: { postId, locale } },
        create: { postId, locale, ...t } as never,
        update: { ...t },
      }),
  );
}

export async function translateAndSaveProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return;
  await translateAndSaveAllLocales(
    {
      title: project.title,
      description: project.description,
      processText: project.processText,
      resultsText: project.resultsText,
      testimonialAuthor: project.testimonialAuthor,
      testimonialRole: project.testimonialRole,
      testimonialQuote: project.testimonialQuote,
      seoTitle: project.seoTitle,
      seoDescription: project.seoDescription,
      geoTitle: project.geoTitle,
      geoDescription: project.geoDescription,
    },
    (locale, t) =>
      prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId, locale } },
        create: { projectId, locale, ...t } as never,
        update: { ...t },
      }),
  );
}

export async function translateAndSaveService(serviceId: string) {
  const service = await prisma.service.findUnique({ where: { id: serviceId }, include: { benefits: true } });
  if (!service) return;
  await translateAndSaveAllLocales(
    {
      title: service.title,
      excerpt: service.excerpt,
      description: service.description,
      ctaLabel: service.ctaLabel,
      seoTitle: service.seoTitle,
      seoDescription: service.seoDescription,
    },
    (locale, t) =>
      prisma.serviceTranslation.upsert({
        where: { serviceId_locale: { serviceId, locale } },
        create: { serviceId, locale, title: t.title, excerpt: t.excerpt, description: t.description, ctaLabel: t.ctaLabel, seoTitle: t.seoTitle, seoDescription: t.seoDescription },
        update: { title: t.title, excerpt: t.excerpt, description: t.description, ctaLabel: t.ctaLabel, seoTitle: t.seoTitle, seoDescription: t.seoDescription },
      }),
  );

  for (const benefit of service.benefits) {
    await translateAndSaveAllLocales(
      { title: benefit.title, description: benefit.description },
      (locale, t) =>
        prisma.serviceBenefitTranslation.upsert({
          where: { serviceBenefitId_locale: { serviceBenefitId: benefit.id, locale } },
          create: { serviceBenefitId: benefit.id, locale, title: t.title, description: t.description },
          update: { title: t.title, description: t.description },
        }),
    );
  }
}

export async function translateAndSaveTestimonial(testimonialId: string) {
  const testimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
  if (!testimonial) return;
  await translateAndSaveAllLocales(
    { quote: testimonial.quote, authorRole: testimonial.authorRole },
    (locale, t) =>
      prisma.testimonialTranslation.upsert({
        where: { testimonialId_locale: { testimonialId, locale } },
        create: { testimonialId, locale, quote: t.quote, authorRole: t.authorRole },
        update: { quote: t.quote, authorRole: t.authorRole },
      }),
  );
}

export async function translateAndSaveFaq(faqId: string) {
  const faq = await prisma.faq.findUnique({ where: { id: faqId } });
  if (!faq) return;
  await translateAndSaveAllLocales(
    { question: faq.question, answer: faq.answer },
    (locale, t) =>
      prisma.faqTranslation.upsert({
        where: { faqId_locale: { faqId, locale } },
        create: { faqId, locale, question: t.question, answer: t.answer },
        update: { question: t.question, answer: t.answer },
      }),
  );
}

export async function translateAndSaveTeamMember(teamMemberId: string) {
  const member = await prisma.teamMember.findUnique({ where: { id: teamMemberId } });
  if (!member) return;
  await translateAndSaveAllLocales(
    { role: member.role, bio: member.bio },
    (locale, t) =>
      prisma.teamMemberTranslation.upsert({
        where: { teamMemberId_locale: { teamMemberId, locale } },
        create: { teamMemberId, locale, role: t.role, bio: t.bio },
        update: { role: t.role, bio: t.bio },
      }),
  );
}

export async function translateAndSaveSiteSettings() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  if (!settings) return;
  await translateAndSaveAllLocales(
    {
      heroTitle: settings.heroTitle,
      heroSubtitle: settings.heroSubtitle,
      heroCtaLabel: settings.heroCtaLabel,
      footerText: settings.footerText,
    },
    (locale, t) =>
      prisma.siteSettingsTranslation.upsert({
        where: { locale },
        create: { locale, heroTitle: t.heroTitle, heroSubtitle: t.heroSubtitle, heroCtaLabel: t.heroCtaLabel, footerText: t.footerText },
        update: { heroTitle: t.heroTitle, heroSubtitle: t.heroSubtitle, heroCtaLabel: t.heroCtaLabel, footerText: t.footerText },
      }),
  );
}
