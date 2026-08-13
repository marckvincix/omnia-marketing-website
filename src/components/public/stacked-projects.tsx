"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/lib/data/projects";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { useInterestTracking } from "@/lib/use-interest-tracking";
import { LightBeamButton } from "./light-beam-button";
import { StackingCards } from "./stacking-cards";

function ProjectCard({ project, index, total }: { project: ProjectView; index: number; total: number }) {
  const { onClick, onMouseEnter, onMouseLeave } = useInterestTracking(project.serviceSlugs);

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative flex min-h-[70vh] md:min-h-[75vh] flex-col overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]"
    >
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt=""
          fill
          sizes="(max-width: 1024px) 100vw, 1152px"
          className="object-cover"
          priority={index === 0}
        />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-display text-[18vw] font-black leading-none text-white/[0.06]"
          >
            {project.client}
          </span>
        </>
      )}

      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="grid">
          {project.coverImage && (
            <div className="[grid-area:1/1] bg-gradient-to-t from-black via-black/90 via-55% to-transparent" />
          )}

          <div className="[grid-area:1/1] px-10 pb-10 pt-32 md:px-16 md:pb-16 md:pt-48">
            <div className="flex items-center justify-between mb-6">
              <span
                className="text-sm text-[#2e9bd6]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-normal text-white/60">
                {project.category.join(" · ")}
              </span>
            </div>

            <h2 className="font-display font-black text-white text-4xl md:text-6xl leading-[0.95] mb-6">
              {project.client}
            </h2>

            <p className="max-w-xl text-[#dddddd] text-base md:text-lg leading-relaxed mb-6">
              {project.description}
            </p>

            {project.servicesRendered.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.servicesRendered.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-normal text-white backdrop-blur-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            )}

            <LightBeamButton href={`/progetti/${project.slug}`} onClick={onClick}>
              Vedi il progetto <ArrowUpRight className="size-4" aria-hidden="true" />
            </LightBeamButton>
          </div>
        </div>
      </div>
    </article>
  );
}

export function StackedProjects({
  projects,
  sectionClassName,
}: {
  projects: ProjectView[];
  sectionClassName?: string;
}) {
  const { hydrated, isReturning, topInterest } = useVisitorTracking();
  if (projects.length === 0) return null;

  const ordered =
    hydrated && isReturning && topInterest
      ? [...projects].sort(
          (a, b) =>
            Number(b.serviceSlugs.includes(topInterest)) -
            Number(a.serviceSlugs.includes(topInterest)),
        )
      : projects;

  return (
    <StackingCards className={sectionClassName}>
      {ordered.map((project, i) => (
        <ProjectCard key={project.slug} project={project} index={i} total={ordered.length} />
      ))}
    </StackingCards>
  );
}
