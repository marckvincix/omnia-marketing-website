import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { ServiceSubGrid } from "@/components/public/service-sub-grid";
import { RelatedProjects } from "@/components/public/related-projects";
import { CtaBand } from "@/components/public/cta-band";
import { SERVICES } from "@/lib/content/services";

const service = SERVICES.branding;

export const metadata: Metadata = {
  title: "Branding — Strategy, Naming, Logo, UI/UX",
  description:
    "Diamo forma alla tua identità visiva: strategy, naming, logo design e UI/UX per un brand che emoziona e distingue. Agenzia di branding a Napoli.",
};

export default function BrandingPage() {
  return (
    <>
      <PageHero eyebrow={service.eyebrow} title={service.title} description={service.intro} />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects slugs={service.relatedProjectSlugs} />
      <CtaBand
        title="Vuoi un'identità che si riconosce a colpo d'occhio?"
        description="Parliamo del tuo brand: strategy, naming e design in un unico percorso."
      />
    </>
  );
}
