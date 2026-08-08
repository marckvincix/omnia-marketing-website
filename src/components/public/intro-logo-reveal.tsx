"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { ChevronDown } from "lucide-react";

// Anchor point (fraction of the logo artwork) that sits in the empty gap
// between the "OMNIA" and "MARKETING" lines — measured by sampling the
// SVG's alpha channel. Zooming toward this point guarantees the screen
// ends up fully black, never stuck on a letter edge.
const ANCHOR_X = 0.5;
const ANCHOR_Y = 0.616;
const GAP_FRACTION = 0.09;
const LOGO_ASPECT = 1254 / 3156;

export function IntroLogoReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const logoEase = CustomEase.create("logoReveal", "M0,0 C0.77,0 0.175,1 1,1");

    const applyFrame = (widthVw: number) => {
      const vw = window.innerWidth / 100;
      const widthPx = widthVw * vw;
      const heightPx = widthPx * LOGO_ASPECT;
      const left = window.innerWidth / 2 - ANCHOR_X * widthPx;
      const top = window.innerHeight / 2 - ANCHOR_Y * heightPx;
      const el = logoRef.current;
      if (!el) return;
      el.style.width = `${widthPx}px`;
      el.style.height = `${heightPx}px`;
      el.style.left = `${left}px`;
      el.style.top = `${top}px`;
    };

    const getMaxWidthVw = () => {
      const requiredHeightPx = (window.innerHeight / GAP_FRACTION) * 1.4;
      const requiredWidthPx = requiredHeightPx / LOGO_ASPECT;
      return Math.max(2200, (requiredWidthPx / window.innerWidth) * 100);
    };

    const proxy = { w: 15 };
    applyFrame(proxy.w);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onRefresh: () => applyFrame(proxy.w),
          onLeave: () => gsap.set(curtainRef.current, { display: "none" }),
          onEnterBack: () => gsap.set(curtainRef.current, { display: "flex" }),
        },
      });

      tl.to(
        proxy,
        {
          w: getMaxWidthVw(),
          ease: logoEase,
          duration: 1,
          onUpdate: () => applyFrame(proxy.w),
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
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden bg-[#050505]"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        <img
          ref={logoRef}
          src="/logo-omnia.svg"
          alt=""
          className="absolute"
          style={{ willChange: "width, height, left, top" }}
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
