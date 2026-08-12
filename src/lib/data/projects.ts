import { prisma } from "@/lib/prisma";

const GRADIENTS = [
  "from-[#3a2a20] to-[#0a0a0a]",
  "from-[#20303a] to-[#0a0a0a]",
  "from-[#2a2a20] to-[#0a0a0a]",
  "from-[#2a2035] to-[#0a0a0a]",
  "from-[#203a2a] to-[#0a0a0a]",
];

function gradientForSlug(slug: string) {
  const sum = [...slug].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

export interface ProjectGalleryItem {
  id: string;
  url: string;
  alt: string;
  type: "IMAGE" | "VIDEO";
}

export interface ProjectView {
  id: string;
  slug: string;
  client: string;
  category: string;
  servicesRendered: string[];
  serviceSlugs: string[];
  description: string;
  processText: string;
  coverImage: string | null;
  results: string[];
  testimonialQuote: string;
  externalUrl: string;
  gradient: string;
  seoTitle: string;
  seoDescription: string;
  gallery: ProjectGalleryItem[];
}

type ProjectWithRelations = {
  id: string;
  slug: string;
  client: string;
  category: string;
  description: string;
  processText: string | null;
  coverImage: string | null;
  resultsText: string | null;
  testimonialQuote: string | null;
  externalUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  services: { service: { title: string; slug: string } }[];
  media: { id: string; url: string; alt: string; type: "IMAGE" | "VIDEO" }[];
};

function toView(p: ProjectWithRelations): ProjectView {
  return {
    id: p.id,
    slug: p.slug,
    client: p.client,
    category: p.category,
    servicesRendered: p.services.map((s) => s.service.title),
    serviceSlugs: p.services.map((s) => s.service.slug),
    description: p.description,
    processText: p.processText ?? "",
    coverImage: p.coverImage,
    results: p.resultsText ? p.resultsText.split(" · ").filter(Boolean) : [],
    testimonialQuote: p.testimonialQuote ?? "",
    externalUrl: p.externalUrl ?? "#",
    gradient: gradientForSlug(p.slug),
    seoTitle: p.seoTitle ?? `${p.client} — Case Study`,
    seoDescription: p.seoDescription ?? p.description,
    gallery: p.media.map((m) => ({ id: m.id, url: m.url, alt: m.alt, type: m.type })),
  };
}

export async function getPublishedProjects(): Promise<ProjectView[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      services: { include: { service: true } },
      media: { orderBy: { order: "asc" } },
    },
  });
  return projects.map(toView);
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      services: { include: { service: true } },
      media: { orderBy: { order: "asc" } },
    },
  });
  if (!project || !project.published) return null;
  return toView(project);
}

export async function getProjectsByServiceSlug(serviceSlug: string): Promise<ProjectView[]> {
  const all = await getPublishedProjects();
  return all.filter((p) => p.serviceSlugs.includes(serviceSlug));
}

export async function getProjectCategoryOptions(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((r) => r.category).filter(Boolean);
}
