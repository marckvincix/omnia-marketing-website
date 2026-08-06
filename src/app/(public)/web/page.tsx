import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { ServiceSubGrid } from "@/components/public/service-sub-grid";
import { RelatedProjects } from "@/components/public/related-projects";
import { CtaBand } from "@/components/public/cta-band";
import { SERVICES } from "@/lib/content/services";

const service = SERVICES.web;

export const metadata: Metadata = {
  title: "Web — Siti, App ed eCommerce",
  description:
    "Realizziamo siti web, app mobile, e-commerce e piattaforme digitali con design minimalista e tecnologia all'avanguardia. Web agency a Napoli e Pomigliano d'Arco.",
};

export default function WebPage() {
  return (
    <>
      <PageHero eyebrow={service.eyebrow} title={service.title} description={service.intro} />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects slugs={service.relatedProjectSlugs} />
      <CtaBand
        title="Hai un progetto web in mente?"
        description="Raccontaci la tua idea: la trasformiamo in un sito, un'app o un e-commerce su misura."
      />
    </>
  );
}
