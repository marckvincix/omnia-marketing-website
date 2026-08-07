import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/public/hero";
import { HorizontalTicker } from "@/components/public/horizontal-ticker";
import { ServicesIndex } from "@/components/public/services-index";
import { ProjectBentoGrid } from "@/components/public/project-bento-grid";

export const metadata: Metadata = {
  title: "Omnia Marketing — Agenzia web, branding e social a Napoli",
  description:
    "Omnia Marketing: crediamo nel design. Realizziamo siti web, e-commerce, branding e contenuti social per aziende che vogliono distinguersi. Agenzia web a Napoli e Pomigliano d'Arco.",
};

export default async function HomePage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <>
      <Hero title={settings?.heroTitle} />
      <HorizontalTicker />
      <ServicesIndex />
      <ProjectBentoGrid />
    </>
  );
}
