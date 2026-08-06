import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectTable } from "./project-table";

export const metadata: Metadata = {
  title: "Progetti",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const [projects, services] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { media: { orderBy: { order: "asc" } }, services: true },
    }),
    prisma.service.findMany({ select: { id: true, title: true }, orderBy: { order: "asc" } }),
  ]);

  const formValues = projects.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    client: p.client,
    category: p.category,
    description: p.description,
    year: p.year,
    externalUrl: p.externalUrl ?? "",
    resultsText: p.resultsText ?? "",
    testimonialAuthor: p.testimonialAuthor ?? "",
    testimonialRole: p.testimonialRole ?? "",
    testimonialQuote: p.testimonialQuote ?? "",
    published: p.published,
    seoTitle: p.seoTitle ?? "",
    seoDescription: p.seoDescription ?? "",
    serviceIds: p.services.map((s) => s.serviceId),
    media: p.media.map((m) => ({ id: m.id, url: m.url, alt: m.alt, type: m.type })),
  }));

  return (
    <div>
      <AdminPageHeader title="Progetti" description="Il portfolio pubblicato sul sito." />
      <ProjectTable projects={formValues} serviceOptions={services} />
    </div>
  );
}
