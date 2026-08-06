import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceTable } from "./service-table";

export const metadata: Metadata = {
  title: "Servizi",
  robots: { index: false, follow: false },
};

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
    include: { benefits: { orderBy: { order: "asc" } } },
  });

  const formValues = services.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    excerpt: s.excerpt,
    description: s.description,
    ctaLabel: s.ctaLabel,
    ctaUrl: s.ctaUrl,
    published: s.published,
    seoTitle: s.seoTitle ?? "",
    seoDescription: s.seoDescription ?? "",
    benefits: s.benefits.map((b) => ({ id: b.id, title: b.title, description: b.description })),
  }));

  return (
    <div>
      <AdminPageHeader
        title="Servizi"
        description="Le tre aree di servizio (Web, Branding, Social) e i relativi sotto-servizi."
      />
      <ServiceTable services={formValues} />
    </div>
  );
}
