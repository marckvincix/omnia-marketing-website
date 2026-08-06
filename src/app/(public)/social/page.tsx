import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { ServiceSubGrid } from "@/components/public/service-sub-grid";
import { RelatedProjects } from "@/components/public/related-projects";
import { CtaBand } from "@/components/public/cta-band";
import { SERVICES } from "@/lib/content/services";

const service = SERVICES.social;

export const metadata: Metadata = {
  title: "Social — SMM, Fotografia, Video, Spot",
  description:
    "Social media management, fotografia, videografia e spot pubblicitari dal taglio cinematografico per aziende che vogliono distinguersi sui social.",
};

export default function SocialPage() {
  return (
    <>
      <PageHero eyebrow={service.eyebrow} title={service.title} description={service.intro} />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects slugs={service.relatedProjectSlugs} />
      <CtaBand
        title="Pronti a raccontare il tuo brand sui social?"
        description="Dalla strategia editoriale alla produzione video: gestiamo i tuoi canali con un design coerente."
      />
    </>
  );
}
