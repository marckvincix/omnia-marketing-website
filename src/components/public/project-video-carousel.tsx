"use client";

import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProjectGalleryItem } from "@/lib/data/projects";

const MAX_DIM_OPACITY = 0.75;
const MAX_SCALE_DOWN = 0.35;

export function ProjectVideoCarousel({ items }: { items: ProjectGalleryItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    // Su mobile lo spazio visibile è stretto: si parte dal video centrale invece che dal primo,
    // così l'effetto coverflow (peek a sinistra e destra) è visibile fin da subito.
    if (items.length > 1 && window.innerWidth < 768) {
      const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-carousel-item]"));
      const middleIndex = Math.floor(cards.length / 2);
      cards[middleIndex]?.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
    }

    function update() {
      raf = 0;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.left + containerRect.width / 2;
      const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-carousel-item]"));

      let closest: HTMLElement | null = null;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);
        const normalized = Math.min(distance / (containerRect.width / 2), 1);

        card.style.opacity = String(1 - normalized * MAX_DIM_OPACITY);
        card.style.transform = `scale(${1 - normalized * MAX_SCALE_DOWN})`;

        if (distance < closestDistance) {
          closestDistance = distance;
          closest = card;
          closestIndex = i;
        }
      });

      activeIndexRef.current = closestIndex;

      // Mette in pausa i video non al centro, per evitare più audio sovrapposti.
      cards.forEach((card) => {
        const video = card.querySelector("video");
        if (video && card !== closest && !video.paused) {
          video.pause();
        }
      });
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }

    update();
    container.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      container.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items.length]);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-carousel-item]"));
    const clamped = Math.max(0, Math.min(index, cards.length - 1));
    cards[clamped]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-20 border-t border-[#1a1a1a]">
      <div
        ref={containerRef}
        className="flex items-center gap-6 md:gap-10 overflow-x-auto snap-x snap-mandatory px-[50%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div
            key={item.id}
            data-carousel-item
            className="h-[80vh] md:h-[65vh] max-w-[80vw] md:max-w-[55vw] shrink-0 snap-center transition-[opacity,transform] duration-150 ease-out"
          >
            <video
              src={item.url}
              controls
              playsInline
              preload="metadata"
              aria-label={item.alt}
              className="h-full w-auto max-w-full object-contain rounded-2xl md:rounded-[2rem] border border-white/10 bg-black"
            />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndexRef.current - 1)}
            aria-label="Video precedente"
            className="flex size-10 md:size-12 items-center justify-center rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="size-5 md:size-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndexRef.current + 1)}
            aria-label="Video successivo"
            className="flex size-10 md:size-12 items-center justify-center rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="size-5 md:size-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
