"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { faqSchema, type FaqInput } from "@/lib/validation/admin";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveFaq(input: FaqInput) {
  await requireAdmin();
  const data = faqSchema.parse(input);

  await prisma.faq.upsert({
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
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
}
