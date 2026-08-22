"use client";

import { TubesBackground } from "./tubes-background";
import { useVisitorName } from "@/lib/visitor-name-context";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";

type Interest = "web" | "branding" | "social";

interface HeroProps {
  title?: string;
  /**
   * Titoli alternativi ("riga1\nriga2") per ciascun interesse rilevato, dal più discreto
   * (indice 0) al più diretto (cresce con i giorni di ritorno). Sostituisce interamente
   * `title` non appena viene rilevato un interesse, e resta valido anche dopo che il
   * visitatore ci ha contattato, finché non emerge un interesse diverso.
   */
  variants?: Partial<Record<Interest, string[]>>;
}

export function Hero({ title = "crediamo\nnel design", variants }: HeroProps) {
  const { name } = useVisitorName();
  const { hydrated, topInterest, tier } = useVisitorTracking();

  // Una volta rilevato un interesse resta valido finché non ne emerge uno diverso: non
  // torna al testo di base "crediamo nel design", riservato a chi non ha ancora
  // mostrato alcun interesse. Non dipende da isReturning/contacted: anche il giorno
  // stesso, e anche dopo aver già scritto, l'interesse registrato resta quello.
  const tierList = hydrated && topInterest ? variants?.[topInterest as Interest] : undefined;
  const activeTitle =
    tierList && tierList.length > 0 ? tierList[Math.min(tier, tierList.length - 1)] : title;

  const lines = activeTitle.split("\n");
  if (name) {
    lines[0] = `${name}, ${lines[0]}`;
  }

  return (
    <TubesBackground className="h-screen">
      <div className="flex h-full w-full items-center justify-center px-6 text-center">
        <h1
          className="font-normal text-white text-[13vw] md:text-[9vw] leading-[0.9] tracking-[0.05em] select-none drop-shadow-[0_4px_40px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "var(--font-alfa-slab)" }}
        >
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>
      </div>
    </TubesBackground>
  );
}
