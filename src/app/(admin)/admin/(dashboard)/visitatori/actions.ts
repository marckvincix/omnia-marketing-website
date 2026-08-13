"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function deleteVisitorName(id: string) {
  await requireAdmin();
  await prisma.visitorName.delete({ where: { id } });
  revalidatePath("/admin/visitatori");
}
