"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectGalleryItem } from "@/lib/data/projects";
import { LinkedText } from "./linked-text";

const TOP_BASE = 96;
const TOP_STEP = 28;
const MAX_DIM_OPACITY = 0.65;
const MAX_SCALE_DOWN = 0.03;

// Le gallerie con titolo hanno molte più foto di quella classica (10+ per sezione): con lo
// scarto pieno di 28px l'ultima card si fermerebbe così in basso da uscire dallo schermo,
// e la sua didascalia verrebbe coperta dalla successiva prima di essere mai visibile.
// Lo scarto si restringe quindi in modo che l'intera pila occupi al massimo questa altezza.
const MAX_STACK_SPREAD_DESKTOP = 140;
const MAX_STACK_SPREAD_MOBILE = 96;

function GalleryColumn({
  items,
  className,
  maxSpread,
  captions = false,
}: {
  items: ProjectGalleryItem[];
  className?: string;
  maxSpread?: number;
  captions?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const step = maxSpread
    ? Math.min(TOP_STEP, Math.floor(maxSpread / Math.max(items.length - 1, 1)))
    : TOP_STEP;

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
          const nextStickyTop = TOP_BASE + (i + 1) * step;
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
  }, [items.length, step]);

  return (
    <div ref={containerRef} className={className}>
      {items.map((item, i) => (
        <div
          key={item.id}
          data-stack-card
          className="sticky mb-4 md:mb-6 md:w-[85%]"
          style={{ top: `${TOP_BASE + i * step}px`, zIndex: i + 1 }}
        >
          <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] border border-white/10 bg-[#0a0a0a]">
            <div className="relative aspect-[4/5]">
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            {/* La didascalia ripete l'ALT della foto: nascosta agli screen reader per non
                farla leggere due volte. */}
            {captions && (
              <p aria-hidden="true" className="px-4 py-3 md:px-5 md:py-4 text-sm leading-snug text-[#cccccc]">
                {item.alt}
              </p>
            )}
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

function GalleryColumns({ items, titled = false }: { items: ProjectGalleryItem[]; titled?: boolean }) {
  const left = items.filter((_, i) => i % 2 === 0);
  const right = items.filter((_, i) => i % 2 === 1);

  return (
    <>
      {/* Mobile: una sola colonna, tutte le foto, nessuno sfasamento. */}
      <div className="md:hidden">
        <GalleryColumn
          items={items}
          captions={titled}
          maxSpread={titled ? MAX_STACK_SPREAD_MOBILE : undefined}
        />
      </div>

      {/* Desktop: due colonne affiancate e ravvicinate, centrate in pagina, la destra sfasata più in basso. */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-4 md:max-w-4xl md:mx-auto">
        <GalleryColumn
          items={left}
          captions={titled}
          maxSpread={titled ? MAX_STACK_SPREAD_DESKTOP : undefined}
        />
        {right.length > 0 && (
          <GalleryColumn
            items={right}
            className="md:mt-40"
            captions={titled}
            maxSpread={titled ? MAX_STACK_SPREAD_DESKTOP : undefined}
          />
        )}
      </div>
    </>
  );
}

export function ProjectGallery({ items }: { items: ProjectGalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-20 border-t border-[#1a1a1a]">
      <GalleryColumns items={items} />
    </section>
  );
}

// Galleria con titolo e testo breve (es. "Area Clienti", "Area Admin"): stesse foto 4:5
// impilate della galleria classica, con in più la didascalia sotto ogni foto.
export function ProjectGallerySection({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: ProjectGalleryItem[];
}) {
  if (items.length === 0) return null;

  const paragraphs = description.split(/\n{2,}/).filter(Boolean);

  return (
    <section className="px-6 md:px-12 py-20 border-t border-[#1a1a1a]">
      <div className="md:max-w-4xl md:mx-auto mb-12 md:mb-16">
        <h2 className="font-display font-black text-white text-4xl md:text-6xl leading-[0.95] tracking-tight">
          {title}
        </h2>
        {paragraphs.length > 0 && (
          <div className="mt-6 max-w-2xl text-lg text-[#999999]">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="mb-4 last:mb-0">
                <LinkedText text={paragraph} />
              </p>
            ))}
          </div>
        )}
      </div>
      <GalleryColumns items={items} titled />
    </section>
  );
}
