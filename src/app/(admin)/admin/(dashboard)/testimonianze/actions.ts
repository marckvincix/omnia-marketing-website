"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { testimonialSchema, type TestimonialInput } from "@/lib/validation/admin";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveTestimonial(input: TestimonialInput) {
  await requireAdmin();
  const data = testimonialSchema.parse(input);

  await prisma.testimonial.upsert({
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
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonianze");
}
