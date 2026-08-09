import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getProjectCategoryOptions } from "@/lib/data/projects";
import { ProjectEditor } from "../project-editor";

export const metadata: Metadata = {
  title: "Modifica progetto",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, services, categoryOptions] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { media: { orderBy: { order: "asc" } }, services: true },
    }),
    prisma.service.findMany({ select: { id: true, title: true }, orderBy: { order: "asc" } }),
    getProjectCategoryOptions(),
  ]);

  if (!project) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifica progetto" />
      <ProjectEditor
        initial={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          client: project.client,
          category: project.category,
          description: project.description,
          coverImage: project.coverImage ?? "",
          year: project.year,
          externalUrl: project.externalUrl ?? "",
          resultsText: project.resultsText ?? "",
          testimonialAuthor: project.testimonialAuthor ?? "",
          testimonialRole: project.testimonialRole ?? "",
          testimonialQuote: project.testimonialQuote ?? "",
          published: project.published,
          seoTitle: project.seoTitle ?? "",
          seoDescription: project.seoDescription ?? "",
          geoTitle: project.geoTitle ?? "",
          geoDescription: project.geoDescription ?? "",
          serviceIds: project.services.map((s) => s.serviceId),
          media: project.media.map((m) => ({ id: m.id, url: m.url, alt: m.alt, type: m.type })),
        }}
        serviceOptions={services}
        categoryOptions={categoryOptions}
      />
    </div>
  );
}
