import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { CtaBand } from "@/components/public/cta-band";
import { StackedProjects } from "@/components/public/stacked-projects";
import { getPublishedProjects } from "@/lib/data/projects";
import { buildAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.progetti");
  const title = t("seoTitle");
  const description = t("seoDescription");
  return {
    title,
    description,
    alternates: buildAlternates("/progetti", locale),
    openGraph: { title, description, url: "/progetti", type: "website" },
  };
}

export default async function ProgettiPage() {
  const locale = await getLocale();
  const [projects, t] = await Promise.all([getPublishedProjects(locale), getTranslations("pages.progetti")]);

  return (
    <>
      <ScrollWordReveal text={t("scrollReveal")} />
      <StackedProjects projects={projects} />
      <CtaBand title={t("ctaTitle")} description={t("ctaDescription")} variants={t.raw("ctaVariants")} />
    </>
  );
}
