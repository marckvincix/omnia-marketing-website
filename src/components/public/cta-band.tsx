"use client";

import { useVisitorName } from "@/lib/visitor-name-context";
import { LightBeamButton } from "./light-beam-button";

interface CtaBandProps {
  title: string;
  description?: string;
  ctaLabel?: string;
}

export function CtaBand({
  title,
  description,
  ctaLabel = "Contattaci",
}: CtaBandProps) {
  const { name } = useVisitorName();
  const displayTitle = name ? `${name}, ${title.charAt(0).toLowerCase()}${title.slice(1)}` : title;

  return (
    <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-t border-[#1a1a1a]">
      <div className="flex flex-col items-start gap-6">
        <h2 className="font-display text-3xl md:text-5xl text-white max-w-2xl">
          {displayTitle}
        </h2>
        {description && (
          <p className="max-w-lg text-[#999999]">{description}</p>
        )}
        <LightBeamButton href="/contatti">{ctaLabel}</LightBeamButton>
      </div>
    </section>
  );
}
