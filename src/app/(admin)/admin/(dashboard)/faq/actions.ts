"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { faqSchema, type FaqInput } from "@/lib/validation/admin";
import { translateAndSaveFaq } from "@/lib/i18n/translate-and-save";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveFaq(input: FaqInput) {
  await requireAdmin();
  const data = faqSchema.parse(input);

  const faq = await prisma.faq.upsert({
    where: { id: data.id ?? "__new__" },
    create: {
      question: data.question,
      answer: data.answer,
      serviceId: data.serviceId || null,
      published: data.published,
    },
    update: {
      question: data.question,
      answer: data.answer,
      serviceId: data.serviceId || null,
      published: data.published,
    },
  });

  revalidatePath("/admin/faq");
  // Le FAQ compaiono su più pagine pubbliche (quelle di servizio se collegate a un
  // servizio, Chi Siamo se generali): non sappiamo qui quale, quindi le rivalidiamo
  // tutte per sicurezza, su ogni lingua.
  revalidatePath("/[locale]/web", "page");
  revalidatePath("/[locale]/branding", "page");
  revalidatePath("/[locale]/social", "page");
  revalidatePath("/[locale]/chi-siamo", "page");

  after(() => translateAndSaveFaq(faq.id).catch((err) => console.error("[i18n] Traduzione FAQ fallita", err)));
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/[locale]/web", "page");
  revalidatePath("/[locale]/branding", "page");
  revalidatePath("/[locale]/social", "page");
  revalidatePath("/[locale]/chi-siamo", "page");
}
