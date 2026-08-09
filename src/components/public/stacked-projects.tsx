import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/lib/data/projects";
import { LightBeamButton } from "./light-beam-button";
import { StackingCards } from "./stacking-cards";

export function StackedProjects({ projects }: { projects: ProjectView[] }) {
  if (projects.length === 0) return null;

  return (
    <StackingCards eyebrow="Portfolio">
      {projects.map((project, i) => (
        <article
          key={project.slug}
          className={`relative flex h-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br ${project.gradient} p-10 md:p-16 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]`}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center select-none font-display text-[18vw] font-black leading-none text-white/[0.06]"
          >
            {project.client}
          </span>

          <div className="relative flex items-start justify-between">
            <span
              className="text-sm text-[#2e9bd6]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {String(i + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-normal text-white/60">
              {project.category}
            </span>
          </div>

          <div className="relative">
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

            <LightBeamButton href={`/progetti/${project.slug}`}>
              Vedi il progetto <ArrowUpRight className="size-4" aria-hidden="true" />
            </LightBeamButton>
          </div>
        </article>
      ))}
    </StackingCards>
  );
}
