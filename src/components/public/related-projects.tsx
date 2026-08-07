import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjectsByServiceSlug } from "@/lib/data/projects";

export async function RelatedProjects({ serviceSlug }: { serviceSlug: string }) {
  const projects = await getProjectsByServiceSlug(serviceSlug);
  if (projects.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
      <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50] mb-12">
        Progetti correlati
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <Link key={project.slug} href={`/progetti/${project.slug}`} className="group">
            <div
              className={`aspect-[16/9] rounded-sm bg-gradient-to-br ${project.gradient} flex items-center justify-center overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]`}
            >
              <span className="font-display text-3xl text-white/20 group-hover:text-white/40 transition-colors">
                {project.client}
              </span>
            </div>
            <div className="mt-6 flex justify-between items-start">
              <div>
                <h3 className="font-display text-2xl group-hover:text-[#ff6b50] transition-colors">
                  {project.client}
                </h3>
                <p className="text-[#666666] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                  {project.category}
                </p>
              </div>
              <div className="p-2.5 rounded-full border border-[#333333] group-hover:bg-[#ff6b50] group-hover:text-black group-hover:border-transparent transition-all">
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
