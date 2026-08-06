import type { Metadata } from "next";
import { MapPin, Mail } from "lucide-react";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { CLIENTS_AREA_URL } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Contatta Omnia Marketing per il tuo prossimo progetto web, di branding o social. Siamo a Pomigliano d'Arco (Napoli).",
};

export default function ContattiPage() {
  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title="Parliamo del tuo progetto."
        description="Raccontaci la tua idea: ti rispondiamo il prima possibile."
      />

      <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <ContactForm />
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50] mb-4">
              Scrivici
            </h2>
            <a
              href="mailto:info@omniamarketing.it"
              className="flex items-center gap-3 text-xl text-white hover:text-[#ff6b50] transition-colors"
            >
              <Mail className="size-5" aria-hidden="true" />
              info@omniamarketing.it
            </a>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50] mb-4">
              Sede operativa
            </h2>
            <p className="flex items-start gap-3 text-[#cccccc]">
              <MapPin className="size-5 shrink-0 mt-0.5" aria-hidden="true" />
              Viale Alfa Romeo, 17 — 80038 Pomigliano d&apos;Arco (NA)
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50] mb-4">
              Sei già nostro cliente?
            </h2>
            <a
              href={CLIENTS_AREA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border border-[#333333] px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black transition-all"
            >
              Accedi all&apos;Area Clienti →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
