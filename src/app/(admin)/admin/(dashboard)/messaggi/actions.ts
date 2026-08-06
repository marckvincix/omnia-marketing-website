"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
