"use client";

import { Children, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOP_BASE = 96;
const TOP_STEP = 28;

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

      cards.forEach((card, i) => {
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

        const nextCard = cards[i + 1];
        if (!nextCard) return;

        gsap.to(card, {
          scale: 0.97,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });

        if (overlays[i]) {
          gsap.to(overlays[i], {
            opacity: 0.65,
            ease: "none",
            scrollTrigger: {
              trigger: nextCard,
              start: "top bottom",
              end: "top top",
              scrub: true,
            },
          });
        }
      });
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
