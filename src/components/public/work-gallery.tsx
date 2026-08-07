import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/data/projects";
import { TiltCard } from "./tilt-card";

interface WorkGalleryProps {
  heading?: string;
  showViewAllLink?: boolean;
}

export async function WorkGallery({
  heading = "Progetti Selezionati",
  showViewAllLink = true,
}: WorkGalleryProps) {
  const projects = await getPublishedProjects();
  if (projects.length === 0) return null;

  return (
    <section id="progetti" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-20 border-b border-[#222222] pb-10">
        <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6]">
          {heading}
        </h2>
        {showViewAllLink && (
          <Link
            href="/progetti"
            className="hidden md:block text-[#666666] hover:text-white text-xs font-medium uppercase tracking-normal transition-colors"
          >
            Vedi tutto il portfolio →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <TiltCard key={project.slug}>
            <Link href={`/progetti/${project.slug}`} className="group block h-full">
              <article className="card-hover-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
                <div
                  className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
                >
                  <span className="font-display text-4xl md:text-5xl text-white/10 group-hover:text-white/20 transition-colors">
                    {project.client}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div>
                    <h3 className="font-display text-2xl text-white">{project.client}</h3>
                    <p className="text-[#666666] text-[10px] font-bold uppercase tracking-normal mt-1">
                      {project.category}
                    </p>
                  </div>
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
