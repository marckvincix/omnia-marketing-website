import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { analyzeSeo } from "@/lib/seo/analyze";
import { getAllPagesPerformance, isSearchConsoleConfigured } from "@/lib/seo/search-console";
import { ProjectTable } from "./project-table";

export const metadata: Metadata = {
  title: "Progetti",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const [projects, performance] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    isSearchConsoleConfigured() ? getAllPagesPerformance() : Promise.resolve(null),
  ]);
  const performanceMap = performance && !("error" in performance) ? performance : null;

  return (
    <div>
      <AdminPageHeader title="Progetti" description="Il portfolio pubblicato sul sito." />
      <ProjectTable
        projects={projects.map((p) => ({
          id: p.id,
          client: p.client,
          category: p.category,
          published: p.published,
          seoScore: analyzeSeo({
            focusKeyword: p.focusKeyword ?? "",
            seoTitle: p.seoTitle ?? "",
            fallbackTitle: p.title,
            seoDescription: p.seoDescription ?? "",
            slug: p.slug,
            content: [p.description, p.processText, p.resultsText, p.testimonialQuote].filter(Boolean).join("\n\n"),
          }).score,
          performance: performanceMap?.get(`/progetti/${p.slug}`) ?? null,
        }))}
      />
    </div>
  );
}
