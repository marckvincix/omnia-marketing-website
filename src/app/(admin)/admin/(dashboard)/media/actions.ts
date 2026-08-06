"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorageClient, MEDIA_BUCKET } from "@/lib/supabase-storage";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function uploadMedia(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  const altText = (formData.get("altText") as string) || "";
  if (!file || file.size === 0) throw new Error("Nessun file selezionato");

  const ext = file.name.split(".").pop() || "bin";
  const key = `${crypto.randomUUID()}.${ext}`;

  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(key, file, {
    contentType: file.type,
  });
  if (error) throw new Error(error.message);

  const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(key);
  const type = file.type.startsWith("video") ? "VIDEO" : "IMAGE";

  await prisma.media.create({
    data: {
      url: pub.publicUrl,
      type,
      altText,
      sizeBytes: file.size,
    },
  });

  revalidatePath("/admin/media");
}

export async function updateMediaAlt(id: string, altText: string) {
  await requireAdmin();
  await prisma.media.update({ where: { id }, data: { altText } });
  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string, url: string) {
  await requireAdmin();

  const supabase = getStorageClient();
  const key = url.split(`/${MEDIA_BUCKET}/`).pop();
  if (key) {
    await supabase.storage.from(MEDIA_BUCKET).remove([key]);
  }

  await prisma.media.delete({ where: { id } });
  revalidatePath("/admin/media");
}
