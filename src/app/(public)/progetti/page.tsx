import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";
import { WorkGallery } from "@/components/public/work-gallery";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "I progetti realizzati da Omnia Marketing: siti web, e-commerce, branding e social per aziende che vogliono distinguersi.",
};

export default function ProgettiPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Progetti realizzati per i nostri clienti."
        description="Ogni progetto nasce da un ascolto attento e si costruisce insieme al cliente, dal primo brief al risultato finale."
      />
      <WorkGallery />
      <CtaBand
        title="Il prossimo progetto potrebbe essere il tuo."
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
      />
    </>
  );
}
