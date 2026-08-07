import { prisma } from "@/lib/prisma";

export async function getFaqsByServiceSlug(serviceSlug: string) {
  const faqs = await prisma.faq.findMany({
    where: { published: true, service: { slug: serviceSlug } },
    orderBy: { order: "asc" },
  });
  return faqs.map((f) => ({ question: f.question, answer: f.answer }));
}

export async function getGeneralFaqs() {
  const faqs = await prisma.faq.findMany({
    where: { published: true, serviceId: null },
    orderBy: { order: "asc" },
  });
  return faqs.map((f) => ({ question: f.question, answer: f.answer }));
}
