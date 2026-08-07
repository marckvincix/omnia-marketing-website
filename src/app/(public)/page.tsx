import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/public/hero";
import { ServicesIndex } from "@/components/public/services-index";
import { WorkGallery } from "@/components/public/work-gallery";

export const metadata: Metadata = {
  title: "Omnia Marketing — Agenzia web, branding e social a Napoli",
  description:
    "Omnia Marketing: crediamo nel design. Realizziamo siti web, e-commerce, branding e contenuti social per aziende che vogliono distinguersi. Agenzia web a Napoli e Pomigliano d'Arco.",
};

function initialsFor(name: string) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return (words[0] ?? "").slice(0, 2).toUpperCase();
}

export default async function HomePage() {
  const [settings, recentProjects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
      select: { client: true },
    }),
  ]);

  return (
    <>
      <Hero
        title={settings?.heroTitle}
        subtitle={settings?.heroSubtitle ?? undefined}
        ctaLabel={settings?.heroCtaLabel ? `${settings.heroCtaLabel} →` : undefined}
        ctaUrl={settings?.heroCtaUrl ?? undefined}
        recentClients={recentProjects.map((p) => ({ initials: initialsFor(p.client), name: p.client }))}
      />
      <ServicesIndex />
      <WorkGallery />
    </>
  );
}
