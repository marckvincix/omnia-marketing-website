import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/public/hero";
import { IntroLogoReveal } from "@/components/public/intro-logo-reveal";
import { HorizontalTicker } from "@/components/public/horizontal-ticker";
import { ServicesIndex } from "@/components/public/services-index";
import { StackedProjects } from "@/components/public/stacked-projects";
import { CtaBand } from "@/components/public/cta-band";
import { getPublishedProjects } from "@/lib/data/projects";
import { buildAlternates } from "@/lib/i18n/metadata";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.home");
  const title = t("seoTitle");
  const description = t("seoDescription");
  return {
    // "absolute" bypassa il template "%s | Omnia Marketing" del layout root: il titolo
    // della home contiene già il brand, altrimenti diventerebbe duplicato in fondo.
    title: { absolute: title },
    description,
    alternates: buildAlternates("/", locale),
    openGraph: { title, description, url: "/", type: "website" },
  };
}

export default async function HomePage() {
  const locale = await getLocale();
  const [settings, settingsTranslation, projects, t] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    locale === DEFAULT_LOCALE ? null : prisma.siteSettingsTranslation.findUnique({ where: { locale } }),
    getPublishedProjects(locale),
    getTranslations("pages.home"),
  ]);
  const heroTitle = settingsTranslation?.heroTitle || settings?.heroTitle;

  return (
    <>
      <IntroLogoReveal />
      <Hero title={heroTitle} variants={t.raw("heroVariants")} />
      <HorizontalTicker />
      <ServicesIndex />
      <StackedProjects projects={projects} />
      <CtaBand title={t("ctaTitle")} description={t("ctaDescription")} variants={t.raw("ctaVariants")} />
    </>
  );
}
