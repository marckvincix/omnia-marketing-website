import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { ServiceSubGrid } from "@/components/public/service-sub-grid";
import { RelatedProjects } from "@/components/public/related-projects";
import { FaqSection } from "@/components/public/faq-section";
import { CtaBand } from "@/components/public/cta-band";
import { TrackInterest } from "@/components/public/track-interest";
import { RequestInfoPopup } from "@/components/public/request-info-popup";
import { getServiceBySlug, getPublishedServices } from "@/lib/data/services";
import { getFaqsByServiceSlug } from "@/lib/data/faqs";
import { ServiceJsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = {
  title: "Social — SMM, Fotografia, Video, Spot",
  description:
    "Social media management, fotografia, videografia e spot pubblicitari dal taglio cinematografico per aziende che vogliono distinguersi sui social.",
};

export default async function SocialPage() {
  const [service, faqs, services] = await Promise.all([
    getServiceBySlug("social"),
    getFaqsByServiceSlug("social"),
    getPublishedServices(),
  ]);
  if (!service) notFound();

  return (
    <>
      <TrackInterest slugs={["social"]} />
      <ServiceJsonLd name={service.title} description={service.intro} url="/social" />
      <ScrollWordReveal text="Social curati al dettaglio: gestiamo contenuti, realizziamo foto e video unici e produciamo spot per valorizzare la tua presenza digitale." />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="social" />
      <FaqSection items={faqs} />

      {/* Il popup di richiesta informazioni scatta qui, non alla fine della pagina: chi ha
          letto le FAQ ha già abbastanza per farsi un'idea. */}
      <div id="request-info-trigger" aria-hidden="true" />

      <CtaBand
        title="Pronti a raccontare il tuo brand sui social?"
        description="Dalla strategia editoriale alla produzione video: gestiamo i tuoi canali con un design coerente."
      />

      <RequestInfoPopup
        title="Vuoi una presenza social che converte davvero?"
        description="Richiedi una consulenza gratuita per la tua strategia sui social."
        submitLabel="Richiedi una consulenza"
        defaultMessage="Vorrei richiedere una consulenza per la gestione dei miei canali social."
        serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
        defaultServiceId={service.id}
      />
    </>
  );
}
