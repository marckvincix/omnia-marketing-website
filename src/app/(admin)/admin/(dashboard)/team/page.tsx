import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TeamTable } from "./team-table";

export const metadata: Metadata = {
  title: "Team",
  robots: { index: false, follow: false },
};

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  const formValues = members.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio ?? "",
    photoUrl: m.photoUrl ?? "",
    linkedinUrl: m.linkedinUrl ?? "",
    published: m.published,
  }));

  return (
    <div>
      <AdminPageHeader title="Team" description="Le persone dello studio (facoltativo, mostrato in Chi Siamo)." />
      <TeamTable members={formValues} />
    </div>
  );
}
