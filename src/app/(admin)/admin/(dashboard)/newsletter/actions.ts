"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterForPost } from "@/lib/email/send-newsletter";
import { syncEmailMetricsFromResend } from "@/lib/email/sync-metrics";
import type { SegmentKey } from "@/lib/email/segments";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

export async function sendUpdateEmail(postId: string, segment: SegmentKey) {
  await requireAdmin();
  const result = await sendNewsletterForPost(postId, segment);
  revalidatePath("/admin/newsletter");
  return result;
}

export async function syncMetrics() {
  await requireAdmin();
  const result = await syncEmailMetricsFromResend();
  revalidatePath("/admin/newsletter");
  return result;
}
