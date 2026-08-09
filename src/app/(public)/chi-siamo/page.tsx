import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedServices } from "@/lib/data/services";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { RevealOnScroll } from "@/components/public/reveal-on-scroll";
import { StackingCards } from "@/components/public/stacking-cards";
import { CtaBand } from "@/components/public/cta-band";

export const metadata: Metadata = {
  title: "Chi Siamo",
  description:
    "Omnia Marketing è lo studio creativo e tecnologico che trasforma visioni in esperienze digitali uniche e brand memorabili.",
};

const KEYWORDS = ["STRATEGIA", "DESIGN", "SVILUPPO", "CONTENUTI", "RISULTATI"];

export default async function ChiSiamoPage() {
  const services = await getPublishedServices();

  return (
    <>
      <ScrollWordReveal text="Crediamo nel design come strumento di lavoro, non come decorazione." />

      <RevealOnScroll className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <blockquote className="font-display text-3xl md:text-5xl text-white max-w-4xl leading-tight">
          &ldquo;Il design non è solo come appare, ma{" "}
          <span className="text-[#666666]">come funziona.</span>&rdquo;
        </blockquote>
        <p className="mt-4 text-sm text-[#666666] uppercase tracking-normal">— Steve Jobs</p>
      </RevealOnScroll>

      <StackingCards eyebrow="Cosa facciamo">
        {services.map((service, i) => (
          <Link
            key={service.slug}
            href={`/${service.slug}`}
            className="card-hover-glow group relative flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#1f1f1f] bg-gradient-to-br from-[#131313] to-[#0a0a0a] p-10 md:p-16"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-6 -top-10 font-display text-[16rem] font-black leading-none text-white/[0.04] select-none"
            >
              {service.title.charAt(0)}
            </span>

            <div className="relative">
              <span
                className="text-sm text-[#2e9bd6]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </span>
              <h2 className="mt-4 font-display font-black text-white text-4xl md:text-6xl leading-[0.95]">
                {service.title}
              </h2>
              <p className="mt-6 max-w-xl text-base md:text-lg text-[#999999] leading-relaxed">
                {service.eyebrow}
              </p>
            </div>

            <span className="relative mt-8 inline-flex size-14 shrink-0 items-center justify-center self-start rounded-full border border-white/20 text-white transition-all duration-300 group-hover:bg-[#2e9bd6] group-hover:border-transparent group-hover:text-black">
              <ArrowUpRight className="size-6" aria-hidden="true" />
            </span>
          </Link>
        ))}
      </StackingCards>

      <RevealOnScroll className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-t border-[#1a1a1a]">
        <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-8">
          Un unico partner
        </h2>
        <p className="max-w-3xl text-lg md:text-2xl text-[#cccccc] leading-relaxed font-display">
          Web, branding e social sotto lo stesso tetto: niente passaggi di
          mano tra fornitori diversi, un solo team che conosce il tuo brand
          dall&apos;inizio alla fine.
        </p>
      </RevealOnScroll>

      <div className="relative overflow-hidden py-10 border-y border-[#1a1a1a] bg-[#000000]">
        <div className="flex w-max animate-marquee-scroll">
          {[...KEYWORDS, ...KEYWORDS].map((word, i) => (
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

      <CtaBand
        title="Parliamo del tuo prossimo progetto."
        description="Che tu debba costruire un brand da zero o far crescere quello che hai già, siamo qui per ascoltare."
      />
    </>
  );
}
