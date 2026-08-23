"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import type { ServiceView } from "@/lib/data/services";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { useInterestTracking } from "@/lib/use-interest-tracking";
import { StackingCards } from "./stacking-cards";

function ServiceCard({ service, index, total }: { service: ServiceView; index: number; total: number }) {
  const { onClick, onMouseEnter, onMouseLeave } = useInterestTracking([service.slug]);

  return (
    <Link
      href={`/${service.slug}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="card-hover-glow group relative flex min-h-[70vh] md:min-h-[75vh] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#1f1f1f] bg-gradient-to-br from-[#131313] to-[#0a0a0a] p-10 md:p-16"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-10 font-display text-[16rem] font-black leading-none text-white/[0.04] select-none"
      >
        {service.title.charAt(0)}
      </span>

      <div className="relative">
        <span
          className="text-sm text-[#2e9bd6]"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <h2 className="mt-4 font-display font-black text-white text-4xl md:text-6xl leading-[0.95]">
          {service.title}
        </h2>
        <p className="mt-6 max-w-xl text-base md:text-lg text-[#999999] leading-relaxed">
          {service.eyebrow}
        </p>
      </div>

      <span className="relative mt-8 inline-flex size-14 shrink-0 items-center justify-center self-start rounded-full border border-white/20 text-white transition-all duration-300 group-hover:bg-[#2e9bd6] group-hover:border-transparent group-hover:text-black">
        <ArrowUpRight className="size-6" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function StackedServices({ services }: { services: ServiceView[] }) {
  const { hydrated, topInterest } = useVisitorTracking();
  if (services.length === 0) return null;

  const ordered =
    hydrated && topInterest
      ? [...services].sort(
          (a, b) => Number(b.slug === topInterest) - Number(a.slug === topInterest),
        )
      : services;

  return (
    <StackingCards>
      {ordered.map((service, i) => (
        <ServiceCard key={service.slug} service={service} index={i} total={ordered.length} />
      ))}
    </StackingCards>
  );
}
