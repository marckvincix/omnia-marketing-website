import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";
import { getPublishedServices } from "@/lib/data/services";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chi Siamo",
  description:
    "Omnia Marketing è un'entità creativa e tecnologica che trasforma visioni in esperienze digitali uniche e brand memorabili. Web, branding e social sotto lo stesso tetto.",
};

export default async function ChiSiamoPage() {
  const services = await getPublishedServices();

  return (
    <>
      <PageHero
        eyebrow="Chi siamo"
        title="Crediamo nel design come strumento di lavoro, non come decorazione."
        description="Siamo un'entità creativa e tecnologica che trasforma visioni in esperienze digitali uniche e brand memorabili. Curiamo ogni progetto nei dettagli, dal primo naming al pixel finale."
      />

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <blockquote className="font-display text-3xl md:text-5xl text-white max-w-4xl leading-tight">
          &ldquo;Il design non è solo come appare, ma{" "}
          <span className="text-[#666666]">come funziona.</span>&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-[#666666] uppercase tracking-widest">— Steve Jobs</p>
      </section>

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50] mb-12">
          Cosa facciamo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${service.slug}`}
              className="group flex flex-col justify-between rounded-[2rem] border border-[#1f1f1f] bg-[#111111] p-10 hover:border-[#333333] transition-colors"
            >
              <div>
                <h3 className="font-display text-2xl text-white">{service.title}</h3>
                <p className="mt-3 text-sm text-[#999999]">{service.intro}</p>
              </div>
              <span className="mt-8 text-sm font-semibold text-[#888888] group-hover:text-[#ff6b50] transition-colors">
                Scopri di più →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50] mb-8">
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
