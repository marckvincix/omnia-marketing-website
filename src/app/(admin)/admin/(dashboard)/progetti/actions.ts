"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createUploadSlot, type UploadSlot } from "@/lib/supabase-storage";
import { projectSchema, type ProjectInput } from "@/lib/validation/admin";
import { translateAndSaveProject } from "@/lib/i18n/translate-and-save";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function createProjectMediaUploadSlot(fileName: string): Promise<UploadSlot> {
  await requireAdmin();
  return createUploadSlot(fileName, "projects/");
}

export async function saveProject(input: ProjectInput) {
  await requireAdmin();
  const data = projectSchema.parse(input);

  const project = await prisma.project.upsert({
    where: { id: data.id ?? "__new__" },
    create: {
      title: data.title,
      slug: data.slug,
      client: data.client,
      category: data.category,
      description: data.description,
      processText: data.processText || null,
      coverImage: data.coverImage || null,
      year: data.year ?? null,
      externalUrl: data.externalUrl || null,
      resultsText: data.resultsText || null,
      testimonialAuthor: data.testimonialAuthor || null,
      testimonialRole: data.testimonialRole || null,
      testimonialQuote: data.testimonialQuote || null,
      published: data.published,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      geoTitle: data.geoTitle || null,
      geoDescription: data.geoDescription || null,
      focusKeyword: data.focusKeyword || null,
    },
    update: {
      title: data.title,
      slug: data.slug,
      client: data.client,
      category: data.category,
      description: data.description,
      processText: data.processText || null,
      coverImage: data.coverImage || null,
      year: data.year ?? null,
      externalUrl: data.externalUrl || null,
      resultsText: data.resultsText || null,
      testimonialAuthor: data.testimonialAuthor || null,
      testimonialRole: data.testimonialRole || null,
      testimonialQuote: data.testimonialQuote || null,
      published: data.published,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      geoTitle: data.geoTitle || null,
      geoDescription: data.geoDescription || null,
      focusKeyword: data.focusKeyword || null,
    },
  });

  await prisma.projectService.deleteMany({ where: { projectId: project.id } });
  for (const serviceId of data.serviceIds) {
    await prisma.projectService.create({ data: { projectId: project.id, serviceId } });
  }

  const keepMediaIds = data.media.filter((m) => m.id).map((m) => m.id!);
  await prisma.projectMedia.deleteMany({
    where: { projectId: project.id, id: { notIn: keepMediaIds.length ? keepMediaIds : ["__none__"] } },
  });
  for (const [i, media] of data.media.entries()) {
    if (media.id) {
      await prisma.projectMedia.update({
        where: { id: media.id },
        data: { url: media.url, alt: media.alt, type: media.type, order: i },
      });
    } else {
      await prisma.projectMedia.create({
        data: { projectId: project.id, url: media.url, alt: media.alt, type: media.type, order: i },
      });
    }
  }

  revalidatePath("/admin/progetti");
  revalidatePath("/[locale]/progetti", "page");
  revalidatePath("/[locale]/progetti/[slug]", "page");
  revalidatePath("/[locale]", "page");

  after(() => translateAndSaveProject(project.id).catch((err) => console.error("[i18n] Traduzione progetto fallita", err)));

  redirect("/admin/progetti");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/progetti");
  revalidatePath("/[locale]/progetti", "page");
  revalidatePath("/[locale]/progetti/[slug]", "page");
  revalidatePath("/[locale]", "page");
}
