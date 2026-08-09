"use client";

import { Children, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOP_BASE = 96;
const TOP_STEP = 28;
const MAX_DIM_OPACITY = 0.65;
const MAX_SCALE_DOWN = 0.03;

export function StackingCards({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  const items = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = Array.from(
        containerRef.current?.querySelectorAll<HTMLDivElement>("[data-stack-card]") ?? [],
      );
      const overlays = Array.from(
        containerRef.current?.querySelectorAll<HTMLDivElement>("[data-stack-overlay]") ?? [],
      );
      if (cards.length === 0) return;

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 95%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      // Solo la scheda "in cima" alla pila deve restare a piena luce: per
      // ogni coppia (scheda, scheda successiva) misuriamo in tempo reale
      // quanto la successiva si è avvicinata alla propria posizione sticky
      // di riposo e scuriamo la precedente in proporzione. Non possiamo
      // affidarci a marcatori start/end statici di ScrollTrigger perché,
      // combinati con position:sticky, calcolano la progressione sulla
      // posizione "naturale" (non agganciata) dell'elemento — che non
      // corrisponde a quando la scheda copre visivamente quella sotto.
      const updateDimming = () => {
        const viewportHeight = window.innerHeight;
        for (let i = 0; i < cards.length - 1; i++) {
          const nextCard = cards[i + 1];
          const nextStickyTop = TOP_BASE + (i + 1) * TOP_STEP;
          const rect = nextCard.getBoundingClientRect();
          const raw = (viewportHeight - rect.top) / (viewportHeight - nextStickyTop);
          const progress = Math.min(Math.max(raw, 0), 1);

          gsap.set(cards[i], { scale: 1 - progress * MAX_SCALE_DOWN });
          if (overlays[i]) {
            gsap.set(overlays[i], { opacity: progress * MAX_DIM_OPACITY });
          }
        }
      };

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: updateDimming,
        onRefresh: updateDimming,
      });

      updateDimming();
    }, containerRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section ref={containerRef} className="px-6 md:px-12 py-20 max-w-6xl mx-auto">
      {eyebrow && (
        <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-12">
          {eyebrow}
        </h2>
      )}

      {items.map((item, i) => (
        <div
          key={i}
          data-stack-card
          className="sticky mb-8"
          style={{ top: `${TOP_BASE + i * TOP_STEP}px`, zIndex: i + 1 }}
        >
          <div className="relative">
            {item}
            <div
              data-stack-overlay
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-black opacity-0"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
