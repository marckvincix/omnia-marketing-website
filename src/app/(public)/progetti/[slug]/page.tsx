import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProjectBySlug } from "@/lib/data/projects";
import { CtaBand } from "@/components/public/cta-band";
import { BreadcrumbJsonLd, CreativeWorkJsonLd } from "@/components/shared/json-ld";

export async function generateStaticParams() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.seoTitle,
    description: project.seoDescription,
    alternates: { canonical: `/progetti/${project.slug}` },
    openGraph: { title: project.seoTitle, description: project.seoDescription, type: "article" },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Portfolio", url: "/progetti" },
          { name: project.client, url: `/progetti/${project.slug}` },
        ]}
      />
      <CreativeWorkJsonLd
        name={project.client}
        description={project.description}
        url={`/progetti/${project.slug}`}
        client={project.client}
      />

      <header className="px-6 md:px-12 pt-20 pb-16 max-w-7xl mx-auto">
        <Link
          href="/progetti"
          className="text-xs font-bold tracking-normal uppercase text-[#666666] hover:text-white transition-colors"
        >
          ← Portfolio
        </Link>
        <h1 className="mt-8 font-display font-black text-white text-5xl md:text-7xl leading-[0.95] tracking-tight">
          {project.client}
        </h1>
        <p className="mt-4 text-sm font-bold tracking-normal uppercase text-[#2e9bd6]">
          {project.category}
        </p>
        <p className="mt-8 max-w-2xl text-lg text-[#999999]">{project.description}</p>

        {project.externalUrl !== "#" && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-white border-b-2 border-white hover:border-[#2e9bd6] hover:text-[#2e9bd6] transition-colors pb-1 w-fit"
          >
            Visita il sito
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        )}
      </header>

      <div
        className={`mx-6 md:mx-12 aspect-[21/9] rounded-[2rem] bg-gradient-to-br ${project.gradient} flex items-center justify-center`}
      >
        <span className="font-display text-5xl md:text-7xl text-white/15">
          {project.client}
        </span>
      </div>

      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-6">
            Servizi svolti
          </h2>
          <ul className="flex flex-wrap gap-3">
            {project.servicesRendered.map((s) => (
              <li
                key={s}
                className="rounded-full border border-[#2a2a2a] px-4 py-2 text-sm text-[#cccccc]"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>

        {project.results.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-6">
              Risultati
            </h2>
            <ul className="flex flex-col gap-3">
              {project.results.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[#cccccc]">
                  <Check className="size-5 text-[#2e9bd6] shrink-0 mt-0.5" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {project.testimonialQuote && (
        <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto border-t border-[#1a1a1a]">
          <blockquote className="font-display text-2xl md:text-4xl text-white max-w-3xl leading-tight">
            &ldquo;{project.testimonialQuote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-[#666666] uppercase tracking-normal">
            — {project.client}
          </p>
        </section>
      )}

      <CtaBand
        title="Vuoi un progetto come questo?"
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
      />
    </>
  );
}
