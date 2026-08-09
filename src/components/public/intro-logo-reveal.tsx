"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { ChevronDown } from "lucide-react";

// Native artwork size (viewBox of /public/logo-omnia.svg).
const FULL_W = 3156;
const FULL_H = 1254;
const LOGO_CENTER_X = FULL_W / 2;
const LOGO_CENTER_Y = FULL_H / 2;

// Anchor point (fraction of the artwork) that sits in the empty gap
// between the "OMNIA" and "MARKETING" lines — measured by sampling the
// SVG's alpha channel. Zooming toward this point keeps it dead-centered
// on screen the whole time (a true fly-through, not a sideways drift)
// and guarantees the final frame is solid black, never stuck on a
// letter edge.
const ANCHOR_X_FRACTION = 0.5;
const ANCHOR_Y_FRACTION = 0.616;
const INITIAL_LOGO_WIDTH_FRACTION = 0.15;
const MAX_SCALE = 260;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function IntroLogoReveal() {
  const [markup, setMarkup] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/logo-omnia.svg")
      .then((res) => res.text())
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        setMarkup(doc.documentElement.innerHTML);
      });
  }, []);

  useEffect(() => {
    if (!markup) return;

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const logoEase = CustomEase.create("logoReveal", "M0,0 C0.77,0 0.175,1 1,1");

    const anchorX = ANCHOR_X_FRACTION * FULL_W;
    const anchorY = ANCHOR_Y_FRACTION * FULL_H;

    let startBox = { x: 0, y: 0, w: FULL_W, h: FULL_H };
    let endBox = { x: 0, y: 0, w: FULL_W, h: FULL_H };
    const currentT = { value: 0 };

    const computeBoxes = () => {
      const containerAspect = window.innerWidth / window.innerHeight;
      const startW = FULL_W / INITIAL_LOGO_WIDTH_FRACTION;
      const startH = startW / containerAspect;
      startBox = { x: LOGO_CENTER_X - startW / 2, y: LOGO_CENTER_Y - startH / 2, w: startW, h: startH };

      const endW = FULL_W / MAX_SCALE;
      const endH = endW / containerAspect;
      endBox = { x: anchorX - endW / 2, y: anchorY - endH / 2, w: endW, h: endH };
    };

    const applyProgress = (t: number) => {
      currentT.value = t;
      const x = lerp(startBox.x, endBox.x, t);
      const y = lerp(startBox.y, endBox.y, t);
      const w = lerp(startBox.w, endBox.w, t);
      const h = lerp(startBox.h, endBox.h, t);
      svgRef.current?.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    };

    computeBoxes();
    applyProgress(0);

    const onResize = () => {
      computeBoxes();
      applyProgress(currentT.value);
    };
    window.addEventListener("resize", onResize);

    const ctx = gsap.context(() => {
      const proxy = { t: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onLeave: () => {
            gsap.set(curtainRef.current, { display: "none" });
            window.dispatchEvent(new CustomEvent("omnia:intro-complete"));
          },
          onEnterBack: () => gsap.set(curtainRef.current, { display: "flex" }),
        },
      });

      tl.to(
        proxy,
        {
          t: 1,
          ease: logoEase,
          duration: 1,
          onUpdate: () => applyProgress(proxy.t),
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

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [markup]);

  return (
    <div ref={wrapperRef} className="relative h-[300vh]">
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden bg-[#050505]"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      >
        {markup && (
          <svg
            ref={svgRef}
            className="h-full w-full"
            viewBox={`0 0 ${FULL_W} ${FULL_H}`}
            dangerouslySetInnerHTML={{ __html: markup }}
          />
        )}
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
