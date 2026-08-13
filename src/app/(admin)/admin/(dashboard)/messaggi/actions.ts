"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAdminReplyEmail } from "@/lib/email/send-admin-reply";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function toggleHandled(id: string, handled: boolean) {
  await requireAdmin();
  await prisma.contactSubmission.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/messaggi");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactSubmission.delete({ where: { id } });
  revalidatePath("/admin/messaggi");
  revalidatePath("/admin");
}

export async function sendMessageReply(id: string, subject: string, body: string) {
  await requireAdmin();
  const trimmedSubject = subject.trim();
  const trimmedBody = body.trim();
  if (!trimmedSubject || !trimmedBody) return { error: "Oggetto e messaggio sono obbligatori" };

  const message = await prisma.contactSubmission.findUniqueOrThrow({ where: { id } });
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 }, select: { contactEmail: true } });
  const replyTo = settings?.contactEmail || "info@omniamarketing.it";

  try {
    await sendAdminReplyEmail({ to: message.email, subject: trimmedSubject, body: trimmedBody, replyTo });
  } catch (error) {
    console.error("Errore invio risposta al messaggio", error);
    return { error: error instanceof Error ? error.message : "Errore sconosciuto durante l'invio" };
  }

  await prisma.contactSubmission.update({ where: { id }, data: { handled: true } });
  revalidatePath("/admin/messaggi");
  revalidatePath("/admin");
  return { success: true };
}
