import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/projects";
import { getPublishedServices } from "@/lib/data/services";
import { ProjectGallery } from "@/components/public/project-gallery";
import { ProjectVideoCarousel } from "@/components/public/project-video-carousel";
import { ProjectTestimonial } from "@/components/public/project-testimonial";
import { StackedProjects } from "@/components/public/stacked-projects";
import { TrackInterest } from "@/components/public/track-interest";
import { RequestInfoPopup } from "@/components/public/request-info-popup";
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

  const photos = project.gallery.filter((m) => m.type === "IMAGE");
  const videos = project.gallery.filter((m) => m.type === "VIDEO");

  const processParagraphs = project.processText.split(/\n{2,}/).filter(Boolean);

  const [allProjects, services] = await Promise.all([
    getPublishedProjects(),
    getPublishedServices(),
  ]);
  const otherProjects = allProjects.filter((p) => p.slug !== project.slug);

  const matchingServices = services.filter((s) => project.serviceSlugs.includes(s.slug));
  const defaultServiceId = matchingServices.length === 1 ? matchingServices[0].id : undefined;

  return (
    <>
      <TrackInterest slugs={project.serviceSlugs} />
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

      <header className="px-6 md:px-12 pt-20 pb-16">
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

      <div className="relative mx-6 md:mx-12 aspect-[21/9] overflow-hidden rounded-[2rem]">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.client}
            fill
            sizes="(max-width: 1024px) 100vw, 1600px"
            priority
            className="object-cover"
          />
        ) : (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${project.gradient}`}
          >
            <span className="font-display text-5xl md:text-7xl text-white/15">
              {project.client}
            </span>
          </div>
        )}
      </div>

      <section className="px-6 md:px-12 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
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

      {project.processText && (
        <section className="px-6 md:px-12 py-20 border-t border-[#1a1a1a]">
          <h2 className="text-xs font-bold tracking-normal uppercase text-[#2e9bd6] mb-8">
            Come lo abbiamo realizzato
          </h2>
          <div className="md:columns-2 md:gap-x-16">
            {processParagraphs.map((paragraph, i) => (
              <p key={i} className="mb-6 text-lg md:text-xl text-[#cccccc] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      <ProjectGallery items={photos} />

      <ProjectVideoCarousel items={videos} />

      {project.testimonialQuote && (
        <ProjectTestimonial quote={project.testimonialQuote} author={project.client} />
      )}

      {/* Il popup di richiesta informazioni scatta qui, non alla fine della pagina: chi ha
          visto il progetto e la recensione ha già abbastanza per farsi un'idea. */}
      <div id="request-info-trigger" aria-hidden="true" />

      <StackedProjects projects={otherProjects} sectionClassName="px-6 md:px-12 py-20" />

      <RequestInfoPopup
        title="Ti piacciono i progetti che realizziamo?"
        description="Raccontaci la tua idea: possiamo realizzare un progetto su misura, curato nei dettagli come questo."
        submitLabel="Richiedi il tuo progetto"
        defaultMessage={`Ho visto il progetto "${project.client}" e vorrei richiedere una consulenza per un progetto simile.`}
        serviceOptions={services.map((s) => ({ id: s.id, title: s.title }))}
        defaultServiceId={defaultServiceId}
      />
    </>
  );
}
