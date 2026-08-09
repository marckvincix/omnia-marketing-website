"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewsletterForPost } from "@/lib/email/send-newsletter";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await prisma.newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/newsletter");
}

export async function sendUpdateEmail(postId: string) {
  await requireAdmin();
  const result = await sendNewsletterForPost(postId);
  revalidatePath("/admin/newsletter");
  return result;
}
