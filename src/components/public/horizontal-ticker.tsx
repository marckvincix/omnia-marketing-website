"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type TextFont = "archivo" | "mono" | "italic";
type TickerItem =
  | { type: "text"; content: string; font: TextFont }
  | { type: "icon"; content: string };

const FONT_CLASS: Record<TextFont, string> = {
  archivo: "uppercase",
  mono: "uppercase tracking-tight",
  italic: "italic normal-case",
};

const FONT_FAMILY: Record<TextFont, string> = {
  archivo: "var(--font-archivo-black)",
  mono: "var(--font-space-mono)",
  italic: "var(--font-satoshi, var(--font-body))",
};

const ITEMS: TickerItem[] = [
  { type: "text", content: "Crediamo nel design", font: "archivo" },
  { type: "icon", content: "✦" },
  { type: "text", content: "costruiamo siti che convertono", font: "mono" },
  { type: "icon", content: "💻" },
  { type: "text", content: "diamo forma a identità che si ricordano", font: "italic" },
  { type: "icon", content: "🎨" },
  { type: "text", content: "raccontiamo il tuo brand sui social", font: "archivo" },
  { type: "icon", content: "📱" },
  { type: "text", content: "uniamo strategia e creatività", font: "italic" },
  { type: "icon", content: "✦" },
  { type: "text", content: "dal primo naming al pixel finale", font: "mono" },
  { type: "icon", content: "✏️" },
  { type: "text", content: "contenuti che fermano lo scroll", font: "archivo" },
  { type: "icon", content: "🎬" },
  { type: "text", content: "Web, Branding e Social sotto lo stesso tetto", font: "mono" },
  { type: "icon", content: "🤝" },
  { type: "text", content: "un partner, non tre fornitori", font: "archivo" },
  { type: "icon", content: "→" },
];

export function HorizontalTicker() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const distance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden bg-black text-white">
      <div
        ref={trackRef}
        className="absolute top-1/2 left-0 flex -translate-y-1/2 items-center whitespace-nowrap will-change-transform"
      >
        <span className="shrink-0 w-[8vw]" aria-hidden="true" />
        {ITEMS.map((item, i) =>
          item.type === "text" ? (
            <span
              key={i}
              className={`mx-4 md:mx-6 shrink-0 leading-none text-[7vw] md:text-[4.5vw] ${FONT_CLASS[item.font]}`}
              style={{ fontFamily: FONT_FAMILY[item.font] }}
            >
              {item.content}
            </span>
          ) : (
            <span
              key={i}
              className="mx-4 md:mx-6 shrink-0 leading-none text-[#ff6b50] text-[6vw] md:text-[3.5vw]"
              aria-hidden="true"
            >
              {item.content}
            </span>
          ),
        )}
        <span className="shrink-0 w-[20vw]" aria-hidden="true" />
      </div>

      <p className="sr-only">
        {ITEMS.filter((i): i is Extract<TickerItem, { type: "text" }> => i.type === "text")
          .map((i) => i.content)
          .join(". ")}
      </p>
    </section>
  );
}
