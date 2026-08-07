import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/public/page-hero";
import { ServiceSubGrid } from "@/components/public/service-sub-grid";
import { RelatedProjects } from "@/components/public/related-projects";
import { FaqSection } from "@/components/public/faq-section";
import { CtaBand } from "@/components/public/cta-band";
import { getServiceBySlug } from "@/lib/data/services";
import { getFaqsByServiceSlug } from "@/lib/data/faqs";
import { ServiceJsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Social — SMM, Fotografia, Video, Spot",
  description:
    "Social media management, fotografia, videografia e spot pubblicitari dal taglio cinematografico per aziende che vogliono distinguersi sui social.",
};

export default async function SocialPage() {
  const [service, faqs] = await Promise.all([
    getServiceBySlug("social"),
    getFaqsByServiceSlug("social"),
  ]);
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd name={service.title} description={service.intro} url="/social" />
      <PageHero eyebrow={service.eyebrow} title={service.title} description={service.intro} />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="social" />
      <FaqSection items={faqs} />
      <CtaBand
        title="Pronti a raccontare il tuo brand sui social?"
        description="Dalla strategia editoriale alla produzione video: gestiamo i tuoi canali con un design coerente."
      />
    </>
  );
}
