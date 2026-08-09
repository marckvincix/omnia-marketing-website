"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorageClient, MEDIA_BUCKET } from "@/lib/supabase-storage";
import { projectSchema, type ProjectInput } from "@/lib/validation/admin";

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function uploadProjectImage(formData: FormData): Promise<{ url: string }> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Nessun file selezionato");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Il file supera i 20MB consentiti");

  const ext = file.name.split(".").pop() || "bin";
  const key = `projects/${crypto.randomUUID()}.${ext}`;

  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(key, file, {
    contentType: file.type,
  });
  if (error) throw new Error(error.message);

  const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(key);
  return { url: pub.publicUrl };
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
    },
    update: {
      title: data.title,
      slug: data.slug,
      client: data.client,
      category: data.category,
      description: data.description,
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
  revalidatePath("/progetti");
  revalidatePath(`/progetti/${project.slug}`);
  revalidatePath("/");

  redirect("/admin/progetti");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const project = await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/progetti");
  revalidatePath("/progetti");
  revalidatePath(`/progetti/${project.slug}`);
  revalidatePath("/");
}
