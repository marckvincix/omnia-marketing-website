"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterForPost } from "@/lib/email/send-newsletter";
import { syncEmailMetricsFromResend } from "@/lib/email/sync-metrics";
import { getTransactionalUsage, type TransactionalUsage } from "@/lib/email/usage";
import { importSubscribersFromFile as importSubscribersFromFileImpl, type ImportResult } from "@/lib/email/import-subscribers";
import type { SegmentKey } from "@/lib/email/segments";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato: effettua di nuovo l'accesso.");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

export async function sendUpdateEmail(postId: string, segment: SegmentKey) {
  try {
    await requireAdmin();
    const result = await sendNewsletterForPost(postId, segment);
    revalidatePath("/admin/newsletter");
    return result;
  } catch (error) {
    console.error("Errore invio newsletter", error);
    return {
      sent: 0,
      total: 0,
      error: error instanceof Error ? error.message : "Errore sconosciuto durante l'invio",
    };
  }
}

export async function getTransactionalUsageStats(): Promise<TransactionalUsage> {
  await requireAdmin();
  return getTransactionalUsage();
}

export async function importSubscribersFromFile(formData: FormData): Promise<ImportResult> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { imported: 0, updated: 0, skipped: 0, invalid: 0, error: "Nessun file selezionato." };
  }
  const result = await importSubscribersFromFileImpl(file);
  revalidatePath("/admin/newsletter");
  return result;
}

export async function syncMetrics() {
  try {
    await requireAdmin();
    const result = await syncEmailMetricsFromResend();
    revalidatePath("/admin/newsletter");
    return result;
  } catch (error) {
    console.error("Errore sync metriche newsletter", error);
    return {
      checked: 0,
      updated: 0,
      error: error instanceof Error ? error.message : "Errore sconosciuto durante la sincronizzazione",
    };
  }
}
