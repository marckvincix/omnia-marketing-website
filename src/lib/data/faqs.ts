import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/i18n/localize";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function getFaqsByServiceSlug(serviceSlug: string, locale: string = DEFAULT_LOCALE) {
  const isDefault = locale === DEFAULT_LOCALE;
  const faqs = await prisma.faq.findMany({
    where: { published: true, service: { slug: serviceSlug } },
    orderBy: { order: "asc" },
    include: { translations: isDefault ? false : { where: { locale } } },
  });
  return faqs.map((f) => localize({ question: f.question, answer: f.answer }, f.translations?.[0], ["question", "answer"]));
}

export async function getGeneralFaqs(locale: string = DEFAULT_LOCALE) {
  const isDefault = locale === DEFAULT_LOCALE;
  const faqs = await prisma.faq.findMany({
    where: { published: true, serviceId: null },
    orderBy: { order: "asc" },
    include: { translations: isDefault ? false : { where: { locale } } },
  });
  return faqs.map((f) => localize({ question: f.question, answer: f.answer }, f.translations?.[0], ["question", "answer"]));
}
