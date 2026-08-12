import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { LightBeamButton } from "@/components/public/light-beam-button";
import { CLIENTS_AREA_URL } from "@/lib/nav";
import { getPublishedServices } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contatta Omnia Marketing per il tuo prossimo progetto web, di branding o social. Siamo a Pomigliano d'Arco (Napoli).",
};

export default async function ContattiPage() {
  const [settings, services] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getPublishedServices(),
  ]);
  const email = settings?.contactEmail || "info@omniamarketing.it";

  return (
    <>
      <PageHero
        title="Parliamo del tuo progetto."
        description="Raccontaci la tua idea: ti rispondiamo il prima possibile."
      />

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
              Accedi all&apos;Area Clienti →
            </LightBeamButton>
          </div>
        </div>
      </section>
    </>
  );
}
