"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStorageClient, MEDIA_BUCKET, createUploadSlot, type UploadSlot } from "@/lib/supabase-storage";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function createMediaUploadSlot(fileName: string): Promise<UploadSlot> {
  await requireAdmin();
  return createUploadSlot(fileName);
}

export async function finalizeMediaUpload(input: {
  url: string;
  contentType: string;
  sizeBytes: number;
  altText: string;
}) {
  await requireAdmin();
  const type = input.contentType.startsWith("video") ? "VIDEO" : "IMAGE";

  await prisma.media.create({
    data: {
      url: input.url,
      type,
      altText: input.altText,
      sizeBytes: input.sizeBytes,
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
