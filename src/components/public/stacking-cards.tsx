"use client";

import { Children, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const PEEK_STEP = 28;

export function StackingCards({
  children,
  eyebrow,
}: {
  children: React.ReactNode;
  eyebrow?: string;
}) {
  const items = Children.toArray(children);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      const overlays = overlayRefs.current.filter((o): o is HTMLDivElement => !!o);
      if (cards.length === 0) return;

      gsap.set(cards[0], { yPercent: 0, y: 0, scale: 1 });
      overlays.forEach((o) => gsap.set(o, { opacity: 0 }));

      if (cards.length === 1) return;

      cards.slice(1).forEach((card) => {
        gsap.set(card, { yPercent: 100, scale: 0.96 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (cards.length - 1)}`,
          scrub: 0.6,
          pin: pinRef.current,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const pos = i - 1;
        tl.to(card, { yPercent: 0, y: i * PEEK_STEP, scale: 1, duration: 1, ease: "power2.out" }, pos)
          .to(cards[i - 1], { scale: 0.97, duration: 1, ease: "power2.out" }, pos)
          .to(overlays[i - 1], { opacity: 0.65, duration: 1, ease: "power2.out" }, pos);
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [items.length]);

  return (
    <section
      ref={wrapperRef}
      className="relative"
      style={{ height: items.length > 1 ? `${items.length * 100}vh` : "100vh" }}
    >
      <div
        ref={pinRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-[#000000] px-6 md:px-12"
      >
        {eyebrow && (
          <div className="absolute top-10 left-6 md:left-12 z-20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#2e9bd6]" />
            <span className="text-[10px] font-bold tracking-normal text-[#666666] uppercase">
              {eyebrow}
            </span>
          </div>
        )}

        <div className="flex h-full w-full items-center justify-center">
          <div className="relative w-full max-w-6xl h-[78vh] md:h-[72vh]">
            {items.map((item, i) => (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0"
                style={{ zIndex: i + 1 }}
              >
                {item}
                <div
                  ref={(el) => {
                    overlayRefs.current[i] = el;
                  }}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-black"
                  style={{ opacity: 0 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
