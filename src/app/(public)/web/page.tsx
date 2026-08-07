import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { ServiceSubGrid } from "@/components/public/service-sub-grid";
import { RelatedProjects } from "@/components/public/related-projects";
import { FaqSection } from "@/components/public/faq-section";
import { CtaBand } from "@/components/public/cta-band";
import { getServiceBySlug } from "@/lib/data/services";
import { getFaqsByServiceSlug } from "@/lib/data/faqs";
import { ServiceJsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Web — Siti, App ed eCommerce",
  description:
    "Realizziamo siti web, app mobile, e-commerce e piattaforme digitali con design minimalista e tecnologia all'avanguardia. Web agency a Napoli e Pomigliano d'Arco.",
};

export default async function WebPage() {
  const [service, faqs] = await Promise.all([
    getServiceBySlug("web"),
    getFaqsByServiceSlug("web"),
  ]);
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd name={service.title} description={service.intro} url="/web" />
      <ScrollWordReveal text="Siti web studiati nel dettaglio: realizziamo design moderni, curiamo ogni elemento visivo e creiamo esperienze digitali uniche per il tuo brand." />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="web" />
      <FaqSection items={faqs} />
      <CtaBand
        title="Hai un progetto web in mente?"
        description="Raccontaci la tua idea: la trasformiamo in un sito, un'app o un e-commerce su misura."
      />
    </>
  );
}
