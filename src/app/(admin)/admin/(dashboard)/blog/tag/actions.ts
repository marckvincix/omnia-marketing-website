"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogTaxonomySchema, type BlogTaxonomyInput } from "@/lib/validation/admin";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveTag(input: BlogTaxonomyInput) {
  await requireAdmin();
  const data = blogTaxonomySchema.parse(input);
  await prisma.blogTag.upsert({
    where: { id: data.id ?? "__new__" },
    create: { name: data.name, slug: data.slug },
    update: { name: data.name, slug: data.slug },
  });
  revalidatePath("/admin/blog/tag");
}

export async function deleteTag(id: string) {
  await requireAdmin();
  await prisma.blogTag.delete({ where: { id } });
  revalidatePath("/admin/blog/tag");
}
