import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialTable } from "./testimonial-table";

export const metadata: Metadata = {
  title: "Testimonianze",
  robots: { index: false, follow: false },
};

export default async function AdminTestimonialsPage() {
  const [testimonials, projects] = await Promise.all([
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ select: { id: true, client: true }, orderBy: { order: "asc" } }),
  ]);

  const formValues = testimonials.map((t) => ({
    id: t.id,
    authorName: t.authorName,
    authorRole: t.authorRole ?? "",
    company: t.company ?? "",
    quote: t.quote,
    projectId: t.projectId ?? "",
    published: t.published,
  }));

  return (
    <div>
      <AdminPageHeader title="Testimonianze" description="Le testimonianze dei clienti mostrate sul sito." />
      <TestimonialTable testimonials={formValues} projectOptions={projects} />
    </div>
  );
}
