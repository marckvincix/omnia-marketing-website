"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectView } from "@/lib/data/projects";
import { LightBeamButton } from "./light-beam-button";

const TOP_BASE = 96;
const TOP_STEP = 32;

export function StackedProjects({ projects }: { projects: ProjectView[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const cards = containerRef.current?.querySelectorAll("[data-project-card]");
      cards?.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.94, y: 30 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (projects.length === 0) return null;

  return (
    <div ref={containerRef} className="px-6 md:px-12 max-w-5xl mx-auto pb-32">
      {projects.map((project, i) => (
        <div
          key={project.slug}
          data-project-card
          className="sticky mb-10"
          style={{ top: `${TOP_BASE + i * TOP_STEP}px`, zIndex: i + 1 }}
        >
          <article
            className={`relative flex min-h-[70vh] md:min-h-[75vh] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br ${project.gradient} p-10 md:p-16 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)]`}
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
                Vedi il progetto →
              </LightBeamButton>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}
