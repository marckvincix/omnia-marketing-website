"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useVisitorName } from "@/lib/visitor-name-context";

export function ScrollWordReveal({ text }: { text: string }) {
  const { name } = useVisitorName();
  const sectionRef = useRef<HTMLDivElement>(null);
  const displayText = name ? `${name}, ${text}` : text;
  const words = displayText.split(" ");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;
      const spans = section.querySelectorAll("[data-word]");

      const tween = gsap.to(spans, {
        color: "#ffffff",
        stagger: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.3}`,
          scrub: 0.4,
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
  }, [displayText]);

  return (
    <section ref={sectionRef} className="relative flex min-h-screen items-center justify-center bg-[#000000] px-6 md:px-12">
      <p
        className="max-w-5xl mx-auto text-center font-normal leading-[1.05] tracking-[0.05em] text-5xl md:text-5xl lg:text-6xl"
        style={{ fontFamily: "var(--font-alfa-slab)" }}
      >
        {words.map((word, i) => (
          <span key={i} data-word className="mr-[0.28em] inline-block text-[#3a3a3a]">
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
