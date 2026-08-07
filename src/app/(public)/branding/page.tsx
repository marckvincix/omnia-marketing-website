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
  title: "Branding — Strategy, Naming, Logo, UI/UX",
  description:
    "Diamo forma alla tua identità visiva: strategy, naming, logo design e UI/UX per un brand che emoziona e distingue. Agenzia di branding a Napoli.",
};

export default async function BrandingPage() {
  const [service, faqs] = await Promise.all([
    getServiceBySlug("branding"),
    getFaqsByServiceSlug("branding"),
  ]);
  if (!service) notFound();

  return (
    <>
      <ServiceJsonLd name={service.title} description={service.intro} url="/branding" />
      <PageHero eyebrow={service.eyebrow} title={service.title} description={service.intro} />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="branding" />
      <FaqSection items={faqs} />
      <CtaBand
        title="Vuoi un'identità che si riconosce a colpo d'occhio?"
        description="Parliamo del tuo brand: strategy, naming e design in un unico percorso."
      />
    </>
  );
}
