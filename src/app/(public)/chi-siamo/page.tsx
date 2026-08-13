import type { Metadata } from "next";
import { getPublishedServices } from "@/lib/data/services";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { RevealOnScroll } from "@/components/public/reveal-on-scroll";
import { StackedServices } from "@/components/public/stacked-services";
import { FaqSection } from "@/components/public/faq-section";
import { CtaBand } from "@/components/public/cta-band";
import { getGeneralFaqs } from "@/lib/data/faqs";

const TITLE = "Chi Siamo — Agenzia Web e Branding a Napoli";
const DESCRIPTION =
  "Omnia Marketing è l'agenzia di web design, branding e social media management con sede a Napoli che trasforma visioni in esperienze digitali uniche e brand memorabili, al fianco di aziende in tutta Italia da molti anni.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/chi-siamo" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/chi-siamo",
    type: "website",
  },
};

const KEYWORDS = ["STRATEGIA", "DESIGN", "SVILUPPO", "CONTENUTI", "RISULTATI"];

export default async function ChiSiamoPage() {
  const [services, generalFaqs] = await Promise.all([getPublishedServices(), getGeneralFaqs()]);

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

      <RevealOnScroll className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
        <p className="max-w-3xl text-base md:text-lg text-[#999999] leading-relaxed">
          Omnia Marketing è un&apos;agenzia di web design, branding e social media
          management con sede a Napoli. Da molti anni realizziamo siti web,
          e-commerce, identità di brand e gestiamo i canali social per aziende
          in tutta Italia, seguendo ogni progetto con un unico team dalla
          strategia al risultato finale.
        </p>
      </RevealOnScroll>

      <StackedServices services={services} />

      <RevealOnScroll className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-t border-[#1a1a1a]">
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

      <FaqSection items={generalFaqs} />

      <CtaBand
        title="Parliamo del tuo prossimo progetto."
        description="Che tu debba costruire un brand da zero o far crescere quello che hai già, siamo qui per ascoltare."
        variants={{
          web: [
            {
              title: "Hai bisogno di un sito su misura?",
              description: "Parliamone: realizziamo siti, app ed e-commerce pensati per il tuo business.",
            },
            {
              title: "Sembra che i siti web ti interessino particolarmente.",
              description: "Raccontaci il tuo progetto: troviamo insieme la soluzione giusta.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Sei tornato più volte a trovarci. Forse è il momento di iniziare.",
              description: "Scrivici oggi, senza impegno: parliamo del tuo sito.",
              ctaLabel: "Scrivici ora",
            },
          ],
          branding: [
            {
              title: "Hai bisogno di un'identità su misura?",
              description: "Parliamone: diamo forma al tuo brand con strategy, naming e design.",
            },
            {
              title: "Sembra che il branding ti interessi particolarmente.",
              description: "Raccontaci il tuo progetto: troviamo insieme la soluzione giusta.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Sei tornato più volte a trovarci. Forse è il momento di iniziare.",
              description: "Scrivici oggi, senza impegno: parliamo del tuo brand.",
              ctaLabel: "Scrivici ora",
            },
          ],
          social: [
            {
              title: "Hai bisogno di una presenza social forte?",
              description: "Parliamone: gestiamo i tuoi canali con contenuti e video di qualità.",
            },
            {
              title: "Sembra che i social ti interessino particolarmente.",
              description: "Raccontaci il tuo progetto: troviamo insieme la soluzione giusta.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Sei tornato più volte a trovarci. Forse è il momento di iniziare.",
              description: "Scrivici oggi, senza impegno: parliamo dei tuoi social.",
              ctaLabel: "Scrivici ora",
            },
          ],
        }}
      />
    </>
  );
}
