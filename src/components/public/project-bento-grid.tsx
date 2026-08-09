import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/data/projects";
import { TiltCard } from "./tilt-card";
import { LightBeamButton } from "./light-beam-button";

const SPAN_PATTERN = [
  "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[540px]",
  "min-h-[240px] md:min-h-[250px]",
  "min-h-[240px] md:min-h-[250px]",
];

export async function ProjectBentoGrid() {
  const projects = await getPublishedProjects();
  if (projects.length === 0) return null;

  return (
    <section id="progetti" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-20 border-b border-[#222222] pb-10">
        <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6]">
          Progetti Selezionati
        </h2>
        <LightBeamButton href="/progetti" className="hidden md:inline-flex">
          Vedi tutto il portfolio →
        </LightBeamButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
        {projects.map((project, i) => (
          <TiltCard key={project.slug} className={SPAN_PATTERN[i % SPAN_PATTERN.length]}>
            <Link href={`/progetti/${project.slug}`} className="group block h-full">
              <article className="card-hover-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
                <div
                  className={`relative flex-1 min-h-[160px] overflow-hidden bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                >
                  <span className="font-display text-4xl md:text-5xl text-white/10 select-none transition-colors duration-500 group-hover:text-white/20">
                    {project.client}
                  </span>

                  {project.servicesRendered.length > 0 && (
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {project.servicesRendered.slice(0, 3).map((service) => (
                        <span
                          key={service}
                          className="rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-normal text-white backdrop-blur-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <h3
                    className="text-lg md:text-xl font-bold text-white truncate"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {project.client}
                  </h3>
                  <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/20 p-3 text-white transition-all duration-300 group-hover:bg-[#2e9bd6] group-hover:border-transparent group-hover:text-black">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>
              </article>
            </Link>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
