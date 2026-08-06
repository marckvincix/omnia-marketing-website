"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { teamMemberSchema, type TeamMemberInput } from "@/lib/validation/admin";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveTeamMember(input: TeamMemberInput) {
  await requireAdmin();
  const data = teamMemberSchema.parse(input);

  await prisma.teamMember.upsert({
    where: { id: data.id ?? "__new__" },
    create: {
      name: data.name,
      role: data.role,
      bio: data.bio || null,
      photoUrl: data.photoUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      published: data.published,
    },
    update: {
      name: data.name,
      role: data.role,
      bio: data.bio || null,
      photoUrl: data.photoUrl || null,
      linkedinUrl: data.linkedinUrl || null,
      published: data.published,
    },
  });

  revalidatePath("/admin/team");
}

export async function deleteTeamMember(id: string) {
  await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  revalidatePath("/admin/team");
}
