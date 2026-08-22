"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useVisitorName } from "@/lib/visitor-name-context";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { LightBeamButton } from "./light-beam-button";

interface CtaVariant {
  title: string;
  description?: string;
  ctaLabel?: string;
}

type Interest = "web" | "branding" | "social";

interface CtaBandProps {
  title: string;
  description?: string;
  ctaLabel?: string;
  /**
   * Un elenco di messaggi per ciascun interesse rilevato, dal più discreto (indice 0) al
   * più diretto (indice più alto, mostrato dopo più giorni di ritorno). Sostituisce il
   * testo di base non appena viene rilevato un interesse, e resta valido anche dopo che
   * il visitatore ci ha contattato, finché non emerge un interesse diverso.
   */
  variants?: Partial<Record<Interest, CtaVariant[]>>;
}

export function CtaBand({
  title,
  description,
  ctaLabel = "Contattaci",
  variants,
}: CtaBandProps) {
  const { name } = useVisitorName();
  const { hydrated, topInterest, tier } = useVisitorTracking();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Una volta rilevato un interesse resta valido finché non ne emerge uno diverso: non
  // dipende da isReturning/contacted, il testo di base è riservato solo a chi non ha
  // ancora mostrato alcun interesse.
  const tierList = hydrated && topInterest ? variants?.[topInterest as Interest] : undefined;
  const variant =
    tierList && tierList.length > 0 ? tierList[Math.min(tier, tierList.length - 1)] : undefined;

  const activeTitle = variant?.title ?? title;
  const activeDescription = variant?.description ?? description;
  const activeCtaLabel = variant?.ctaLabel ?? ctaLabel;

  const displayTitle = name
    ? `${name}, ${activeTitle.charAt(0).toLowerCase()}${activeTitle.slice(1)}`
    : activeTitle;
  const titleWords = displayTitle.split(" ");
  const descriptionWords = activeDescription?.split(" ") ?? [];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;
      const titleSpans = section.querySelectorAll("[data-title-word]");
      const descSpans = section.querySelectorAll("[data-desc-word]");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.3}`,
          scrub: 0.4,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      // Titolo e sottotitolo si rivelano insieme, stesso scroll, colori diversi.
      tl.to(titleSpans, { color: "#ffffff", stagger: 1, ease: "none" }, 0);
      tl.to(descSpans, { color: "#999999", stagger: 1, ease: "none" }, 0);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [displayTitle, activeDescription]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center gap-10 md:gap-12 border-t border-[#1a1a1a] bg-[#000000] px-6 md:px-12"
    >
      <h2
        className="max-w-5xl mx-auto text-center font-normal leading-[1.05] tracking-[0.05em] text-5xl md:text-6xl lg:text-7xl"
        style={{ fontFamily: "var(--font-alfa-slab)" }}
      >
        {titleWords.map((word, i) => (
          <span key={i} data-title-word className="mr-[0.28em] inline-block text-[#3a3a3a]">
            {word}
          </span>
        ))}
      </h2>
      {activeDescription && (
        <p className="max-w-xl text-center leading-relaxed text-xl md:text-2xl">
          {descriptionWords.map((word, i) => (
            <span key={i} data-desc-word className="mr-[0.24em] inline-block text-[#2a2a2a]">
              {word}
            </span>
          ))}
        </p>
      )}
      <LightBeamButton href="/contatti" className="mt-4">
        {activeCtaLabel}
      </LightBeamButton>
    </section>
  );
}
