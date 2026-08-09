import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getProjectCategoryOptions } from "@/lib/data/projects";
import { ProjectEditor } from "../project-editor";

export const metadata: Metadata = {
  title: "Nuovo progetto",
  robots: { index: false, follow: false },
};

export default async function NewProjectPage() {
  const [services, categoryOptions] = await Promise.all([
    prisma.service.findMany({ select: { id: true, title: true }, orderBy: { order: "asc" } }),
    getProjectCategoryOptions(),
  ]);

  return (
    <div>
      <AdminPageHeader title="Nuovo progetto" />
      <ProjectEditor serviceOptions={services} categoryOptions={categoryOptions} />
    </div>
  );
}
