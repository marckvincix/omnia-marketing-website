import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqTable } from "./faq-table";

export const metadata: Metadata = {
  title: "FAQ",
  robots: { index: false, follow: false },
};

export default async function AdminFaqPage() {
  const [faqs, services] = await Promise.all([
    prisma.faq.findMany({ orderBy: { order: "asc" } }),
    prisma.service.findMany({ select: { id: true, title: true }, orderBy: { order: "asc" } }),
  ]);

  const formValues = faqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    serviceId: f.serviceId ?? "",
    published: f.published,
  }));

  return (
    <div>
      <AdminPageHeader title="FAQ" description="Domande frequenti, generali o legate a un servizio specifico." />
      <FaqTable faqs={formValues} serviceOptions={services} />
    </div>
  );
}
