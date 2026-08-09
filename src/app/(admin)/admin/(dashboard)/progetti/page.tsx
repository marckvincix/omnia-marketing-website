import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectTable } from "./project-table";

export const metadata: Metadata = {
  title: "Progetti",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div>
      <AdminPageHeader title="Progetti" description="Il portfolio pubblicato sul sito." />
      <ProjectTable
        projects={projects.map((p) => ({
          id: p.id,
          client: p.client,
          category: p.category,
          slug: p.slug,
          published: p.published,
        }))}
      />
    </div>
  );
}
