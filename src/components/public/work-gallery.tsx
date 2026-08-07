import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedProjects } from "@/lib/data/projects";

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
        <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#ff6b50]">
          {heading}
        </h2>
        {showViewAllLink && (
          <Link
            href="/progetti"
            className="hidden md:block text-[#666666] hover:text-white text-xs font-medium uppercase tracking-widest transition-colors"
          >
            Vedi tutto il portfolio →
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
        {projects.map((project, i) => (
          <article key={project.slug} className={`group ${i % 2 === 1 ? "md:mt-24" : ""}`}>
            <Link href={`/progetti/${project.slug}`}>
              <div
                className={`aspect-[4/3] overflow-hidden rounded-sm bg-gradient-to-br ${project.gradient} flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.02]`}
              >
                <span className="font-display text-4xl md:text-5xl text-white/20 group-hover:text-white/40 transition-colors">
                  {project.client}
                </span>
              </div>
              <div className="mt-8 flex justify-between items-start">
                <div>
                  <h3 className="font-display text-3xl tracking-tight mb-2 group-hover:text-[#ff6b50] transition-colors">
                    {project.client}
                  </h3>
                  <p className="text-[#666666] text-[10px] font-bold uppercase tracking-[0.2em]">
                    {project.category}
                  </p>
                </div>
                <div className="p-3 rounded-full border border-[#333333] group-hover:bg-[#ff6b50] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                  <ArrowUpRight className="size-6" aria-hidden="true" />
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
