import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";
import { TiltCard } from "@/components/public/tilt-card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi Siamo",
  description:
    "Omnia Marketing è lo studio creativo e tecnologico che trasforma visioni in esperienze digitali uniche e brand memorabili.",
};

const SERVICE_AREAS = [
  {
    slug: "web",
    title: "Web & Digital experiences",
    description:
      "Realizziamo siti web studiati nel dettaglio e soluzioni digitali su misura, curando ogni elemento per creare esperienze digitali uniche e altamente performanti per il tuo brand.",
  },
  {
    slug: "branding",
    title: "Branding & Identità visiva",
    description:
      "Diamo forma alla tua identità visiva con un design studiato per emozionare e distinguerti. Dalla strategia al logo, creiamo brand capaci di comunicare autenticità e lasciare un segno duraturo.",
  },
  {
    slug: "social",
    title: "Social & Content production",
    description:
      "La tua presenza digitale merita di essere curata al dettaglio. Gestiamo contenuti, realizziamo foto e video unici e produciamo spot per valorizzare e amplificare la tua voce nel panorama digitale.",
  },
] as const;

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title="Crediamo nel design come strumento di lavoro, non come decorazione."
        description="Siamo lo studio creativo e tecnologico che trasforma visioni in esperienze digitali uniche e brand memorabili. Il nostro approccio è meticoloso: ogni progetto è studiato nel dettaglio, dal primo elemento visivo alla soluzione tecnologica finale. Realizziamo design moderni che emozionano, creando identità e piattaforme digitali all'avanguardia, pronte a lasciare un segno indelebile nel tuo settore."
      />

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <blockquote className="font-display text-3xl md:text-5xl text-white max-w-4xl leading-tight">
          &ldquo;Il design non è solo come appare, ma{" "}
          <span className="text-[#666666]">come funziona.</span>&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-[#666666] uppercase tracking-normal">— Steve Jobs</p>
      </section>

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-12">
          Cosa facciamo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_AREAS.map((service) => (
            <TiltCard key={service.slug}>
              <Link
                href={`/${service.slug}`}
                className="card-hover-glow group flex h-full flex-col justify-between rounded-[2rem] border border-[#1f1f1f] bg-[#111111] p-10"
              >
                <div>
                  <h3 className="font-display text-2xl text-white">{service.title}</h3>
                  <p className="mt-3 text-sm text-[#999999]">{service.description}</p>
                </div>
                <span className="mt-8 text-sm font-semibold text-[#888888] group-hover:text-[#2e9bd6] transition-colors">
                  Scopri di più →
                </span>
              </Link>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-8">
          Un unico partner
        </h2>
        <p className="max-w-3xl text-lg md:text-2xl text-[#cccccc] leading-relaxed font-display">
          Web, branding e social sotto lo stesso tetto: niente passaggi di
          mano tra fornitori diversi, un solo team che conosce il tuo brand
          dall&apos;inizio alla fine.
        </p>
      </section>

      <CtaBand
        title="Parliamo del tuo prossimo progetto."
        description="Che tu debba costruire un brand da zero o far crescere quello che hai già, siamo qui per ascoltare."
      />
    </>
  );
}
