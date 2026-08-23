import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const [service, t] = await Promise.all([getServiceBySlug("branding", locale), getTranslations("pages.branding")]);
  const title = service?.seoTitle || t("seoTitle");
  const description = service?.seoDescription || t("seoDescription");

  return {
    title,
    description,
    alternates: buildAlternates("/branding", locale),
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
  const locale = await getLocale();
  const [service, faqs, services, t] = await Promise.all([
    getServiceBySlug("branding", locale),
    getFaqsByServiceSlug("branding", locale),
    getPublishedServices(locale),
    getTranslations("pages.branding"),
  ]);
  if (!service) notFound();

  return (
    <>
      <TrackInterest slugs={["branding"]} />
      <ServiceJsonLd name={service.title} description={service.intro} url="/branding" />
      <ScrollWordReveal text={t("scrollReveal")} />
      <ServiceSubGrid items={service.subservices} />
      <RelatedProjects serviceSlug="branding" />
      <FaqSection items={faqs} />

      {/* Il popup di richiesta informazioni scatta qui, non alla fine della pagina: chi ha
          letto le FAQ ha già abbastanza per farsi un'idea. */}
      <div id="request-info-trigger" aria-hidden="true" />

      <CtaBand title={t("ctaTitle")} description={t("ctaDescription")} />

      <RequestInfoPopup
        title={t("popupTitle")}
        description={t("popupDescription")}
        submitLabel={t("popupSubmitLabel")}
        defaultMessage={t("popupDefaultMessage")}
        serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
        defaultServiceId={service.id}
      />
    </>
  );
}
