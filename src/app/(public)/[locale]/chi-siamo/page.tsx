import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { getPublishedServices } from "@/lib/data/services";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { RevealOnScroll } from "@/components/public/reveal-on-scroll";
import { StackedServices } from "@/components/public/stacked-services";
import { FaqSection } from "@/components/public/faq-section";
import { CtaBand } from "@/components/public/cta-band";
import { getGeneralFaqs } from "@/lib/data/faqs";
import { buildAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.chiSiamo");
  const title = t("seoTitle");
  const description = t("seoDescription");
  return {
    title,
    description,
    alternates: buildAlternates("/chi-siamo", locale),
    openGraph: { title, description, url: "/chi-siamo", type: "website" },
  };
}

export default async function ChiSiamoPage() {
  const locale = await getLocale();
  const [services, generalFaqs, t] = await Promise.all([
    getPublishedServices(locale),
    getGeneralFaqs(locale),
    getTranslations("pages.chiSiamo"),
  ]);
  const keywords = [t("keyword1"), t("keyword2"), t("keyword3"), t("keyword4"), t("keyword5")];

  return (
    <>
      <ScrollWordReveal text={t("scrollReveal")} />

      <RevealOnScroll className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <blockquote className="font-display text-3xl md:text-5xl text-white max-w-4xl leading-tight">
          &ldquo;{t("quote")}&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-[#666666] uppercase tracking-normal">{t("quoteAuthor")}</p>
      </RevealOnScroll>

      <RevealOnScroll className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <p className="max-w-3xl text-base md:text-lg text-[#999999] leading-relaxed">{t("intro")}</p>
      </RevealOnScroll>

      <StackedServices services={services} />

      <RevealOnScroll className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <p className="max-w-3xl text-lg md:text-2xl text-[#cccccc] leading-relaxed font-display">{t("closing")}</p>
      </RevealOnScroll>

      <div className="relative overflow-hidden py-10 border-y border-[#1a1a1a] bg-[#000000]">
        <div className="flex w-max animate-marquee-scroll">
          {[...keywords, ...keywords].map((word, i) => (
            <span
              key={i}
              className="mx-6 shrink-0 text-3xl md:text-5xl font-black uppercase tracking-tight text-white/10"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      <FaqSection items={generalFaqs} />

      <CtaBand title={t("ctaTitle")} description={t("ctaDescription")} variants={t.raw("ctaVariants")} />
    </>
  );
}
