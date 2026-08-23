import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
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
import { buildAlternates } from "@/lib/i18n/metadata";

const DEFAULT_TITLE = "Web — Siti, App ed eCommerce";
const DEFAULT_DESCRIPTION =
  "Realizziamo siti web, app mobile, e-commerce e piattaforme digitali con design minimalista e tecnologia all'avanguardia. Web agency a Napoli, operiamo in tutta Italia.";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const service = await getServiceBySlug("web", locale);
  const title = service?.seoTitle || DEFAULT_TITLE;
  const description = service?.seoDescription || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    alternates: buildAlternates("/web", locale),
    openGraph: {
      title,
      description,
      url: "/web",
      type: "website",
      ...(service?.ogImage ? { images: [service.ogImage] } : {}),
    },
  };
}

export default async function WebPage() {
  const locale = await getLocale();
  const [service, faqs, services] = await Promise.all([
    getServiceBySlug("web", locale),
    getFaqsByServiceSlug("web", locale),
    getPublishedServices(locale),
  ]);
  if (!service) notFound();

  return (
    <>
      <TrackInterest slugs={["web"]} />
      <ServiceJsonLd name={service.title} description={service.intro} url="/web" />
      <ScrollWordReveal text="Siti web studiati nel dettaglio: realizziamo design moderni, curiamo ogni elemento visivo e creiamo esperienze digitali uniche per il tuo brand." />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="web" />
      <FaqSection items={faqs} />

      {/* Il popup di richiesta informazioni scatta qui, non alla fine della pagina: chi ha
          letto le FAQ ha già abbastanza per farsi un'idea. */}
      <div id="request-info-trigger" aria-hidden="true" />

      <CtaBand
        title="Hai un progetto web in mente?"
        description="Raccontaci la tua idea: la trasformiamo in un sito, un'app o un e-commerce su misura."
      />

      <RequestInfoPopup
        title="Pronto a portare online la tua attività?"
        description="Richiedi una consulenza gratuita: parliamo del tuo sito, e-commerce o app."
        submitLabel="Richiedi una consulenza"
        defaultMessage="Vorrei richiedere una consulenza per realizzare un sito web su misura."
        serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
        defaultServiceId={service.id}
      />
    </>
  );
}
