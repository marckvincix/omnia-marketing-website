import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { LightBeamButton } from "@/components/public/light-beam-button";
import { CLIENTS_AREA_URL } from "@/lib/nav";
import { getPublishedServices } from "@/lib/data/services";
import { buildAlternates } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("pages.contatti");
  const title = t("seoTitle");
  const description = t("seoDescription");
  return {
    title,
    description,
    alternates: buildAlternates("/contatti", locale),
    openGraph: { title, description, url: "/contatti", type: "website" },
  };
}

export default async function ContattiPage() {
  const locale = await getLocale();
  const [settings, services, t] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getPublishedServices(locale),
    getTranslations("pages.contatti"),
  ]);
  const email = settings?.contactEmail || "info@omniamarketing.it";

  return (
    <>
      <PageHero title={t("heroTitle")} description={t("heroDescription")} />

      <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <ContactForm
            serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
          />
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-xl text-white hover:text-[#2e9bd6] transition-colors"
            >
              <Mail className="size-5" aria-hidden="true" />
              {email}
            </a>
          </div>

          <div>
            <LightBeamButton href={CLIENTS_AREA_URL} target="_blank" rel="noopener noreferrer">
              {t("accediAreaClienti")}
            </LightBeamButton>
          </div>
        </div>
      </section>
    </>
  );
}
