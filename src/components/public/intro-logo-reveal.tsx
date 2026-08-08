"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { ChevronDown } from "lucide-react";

export function IntroLogoReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const logoEase = CustomEase.create("logoReveal", "M0,0 C0.77,0 0.175,1 1,1");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onLeave: () => gsap.set(curtainRef.current, { display: "none" }),
          onEnterBack: () => gsap.set(curtainRef.current, { display: "flex" }),
        },
      });

      tl.fromTo(
        logoRef.current,
        { width: "15vw" },
        {
          width: "3300vw",
          ease: logoEase,
          duration: 1,
        },
        0,
      )
        .to(
          indicatorRef.current,
          {
            opacity: 0,
            ease: "none",
            duration: 0.08,
          },
          0,
        )
        .to(
          curtainRef.current,
          {
            opacity: 0,
            ease: "none",
            duration: 0.15,
          },
          0.85,
        );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[250vh]">
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[100] flex h-screen w-screen items-center justify-center overflow-hidden bg-[#050505]"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <img
          ref={logoRef}
          src="/logo-omnia.svg"
          alt=""
          className="w-[15vw]"
          style={{ willChange: "width" }}
        />
        <div
          ref={indicatorRef}
          className="absolute bottom-28 left-1/2 -translate-x-1/2 animate-bounce text-white/60"
        >
          <ChevronDown className="size-6" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
