"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectGalleryItem } from "@/lib/data/projects";

const TOP_BASE = 96;
const TOP_STEP = 28;
const MAX_DIM_OPACITY = 0.65;
const MAX_SCALE_DOWN = 0.03;

function GalleryColumn({
  items,
  className,
}: {
  items: ProjectGalleryItem[];
  className?: string;
}) {
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
              // Le card sono sticky e impilate: una volta comparse devono restare
              // visibili. Con "reverse" l'animazione le nascondeva di nuovo scrollando
              // verso l'alto, e ripetendo su/giù la card sticky perdeva la sincronia
              // con la posizione di trigger, facendo sparire le immagini.
              toggleActions: "play none none none",
            },
          },
        );
      });

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
    <div ref={containerRef} className={className}>
      {items.map((item, i) => (
        <div
          key={item.id}
          data-stack-card
          className="sticky mb-4 md:mb-6 md:w-[85%]"
          style={{ top: `${TOP_BASE + i * TOP_STEP}px`, zIndex: i + 1 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10">
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <div
              data-stack-overlay
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-[2rem] bg-black opacity-0"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectGallery({ items }: { items: ProjectGalleryItem[] }) {
  if (items.length === 0) return null;

  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  return (
    <section className="px-6 md:px-12 py-20 border-t border-[#1a1a1a]">
      {/* Mobile: una sola colonna, tutte le foto, nessuno sfasamento. */}
      <div className="md:hidden">
        <GalleryColumn items={items} />
      </div>

      {/* Desktop: due colonne affiancate, la destra sfasata più in basso. */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-8">
        <GalleryColumn items={left} />
        {right.length > 0 && <GalleryColumn items={right} className="md:mt-40" />}
      </div>
    </section>
  );
}
