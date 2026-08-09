import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getProjectsByServiceSlug } from "@/lib/data/projects";
import { TiltCard } from "./tilt-card";

export async function RelatedProjects({ serviceSlug }: { serviceSlug: string }) {
  const projects = await getProjectsByServiceSlug(serviceSlug);
  if (projects.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
      <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-12">
        Progetti correlati
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <TiltCard key={project.slug}>
            <Link href={`/progetti/${project.slug}`} className="group block h-full">
              <article className="card-hover-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
                <div className="relative aspect-[16/9] overflow-hidden">
                  {project.coverImage ? (
                    <Image
                      src={project.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${project.gradient}`}>
                      <span className="font-display text-3xl text-white/15 group-hover:text-white/25 transition-colors">
                        {project.client}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div>
                    <h3 className="font-display text-xl text-white">{project.client}</h3>
                    <p className="text-[#666666] text-[10px] font-bold uppercase tracking-normal mt-1">
                      {project.category}
                    </p>
                  </div>
                  <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/20 p-2.5 text-white transition-all group-hover:bg-[#2e9bd6] group-hover:border-transparent group-hover:text-black">
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
