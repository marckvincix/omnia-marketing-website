"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { testimonialSchema, type TestimonialInput } from "@/lib/validation/admin";
import { translateAndSaveTestimonial } from "@/lib/i18n/translate-and-save";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveTestimonial(input: TestimonialInput) {
  await requireAdmin();
  const data = testimonialSchema.parse(input);

  const testimonial = await prisma.testimonial.upsert({
    where: { id: data.id ?? "__new__" },
    create: {
      authorName: data.authorName,
      authorRole: data.authorRole || null,
      company: data.company || null,
      quote: data.quote,
      projectId: data.projectId || null,
      published: data.published,
    },
    update: {
      authorName: data.authorName,
      authorRole: data.authorRole || null,
      company: data.company || null,
      quote: data.quote,
      projectId: data.projectId || null,
      published: data.published,
    },
  });

  revalidatePath("/admin/testimonianze");

  after(() =>
    translateAndSaveTestimonial(testimonial.id).catch((err) =>
      console.error("[i18n] Traduzione testimonianza fallita", err),
    ),
  );
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonianze");
}
