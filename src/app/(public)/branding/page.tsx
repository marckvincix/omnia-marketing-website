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

const DEFAULT_TITLE = "Branding — Strategy, Naming, Logo, UI/UX";
const DEFAULT_DESCRIPTION =
  "Diamo forma alla tua identità visiva: strategy, naming, logo design e UI/UX per un brand che emoziona e distingue. Agenzia di branding a Napoli, al fianco di clienti in tutta Italia.";

export async function generateMetadata(): Promise<Metadata> {
  const service = await getServiceBySlug("branding");
  const title = service?.seoTitle || DEFAULT_TITLE;
  const description = service?.seoDescription || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    alternates: { canonical: "/branding" },
    openGraph: {
      title,
      description,
      url: "/branding",
      type: "website",
      ...(service?.ogImage ? { images: [service.ogImage] } : {}),
    },
  };
}

export default async function BrandingPage() {
  const [service, faqs, services] = await Promise.all([
    getServiceBySlug("branding"),
    getFaqsByServiceSlug("branding"),
    getPublishedServices(),
  ]);
  if (!service) notFound();

  return (
    <>
      <TrackInterest slugs={["branding"]} />
      <ServiceJsonLd name={service.title} description={service.intro} url="/branding" />
      <ScrollWordReveal text="Diamo forma alla tua identità visiva con un design studiato per emozionare e distinguerti: dalla strategia al logo, creiamo brand capaci di lasciare un segno indelebile." />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="branding" />
      <FaqSection items={faqs} />

      {/* Il popup di richiesta informazioni scatta qui, non alla fine della pagina: chi ha
          letto le FAQ ha già abbastanza per farsi un'idea. */}
      <div id="request-info-trigger" aria-hidden="true" />

      <CtaBand
        title="Vuoi un'identità che si riconosce a colpo d'occhio?"
        description="Parliamo del tuo brand: strategy, naming e design in un unico percorso."
      />

      <RequestInfoPopup
        title="Ti piace il nostro modo di costruire un brand?"
        description="Parliamo della tua identità visiva: richiedi una consulenza gratuita."
        submitLabel="Richiedi una consulenza"
        defaultMessage="Vorrei richiedere una consulenza per la mia identità di brand."
        serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
        defaultServiceId={service.id}
      />
    </>
  );
}
