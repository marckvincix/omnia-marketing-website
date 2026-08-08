"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";

export function IntroLogoReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

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

      tl.to(
        logoRef.current,
        {
          scale: 220,
          transformOrigin: "50% 50%",
          ease: logoEase,
          duration: 1,
          force3D: true,
        },
        0,
      ).to(
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
        style={{ pointerEvents: "none", willChange: "opacity" }}
        aria-hidden="true"
      >
        <img
          ref={logoRef}
          src="/logo-omnia.svg"
          alt=""
          className="w-[15vw]"
          style={{ willChange: "transform" }}
        />
      </div>
    </div>
  );
}
