import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

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

export interface ProjectGallerySectionView {
  id: string;
  title: string;
  description: string;
  items: ProjectGalleryItem[];
}

export interface ProjectView {
  id: string;
  slug: string;
  client: string;
  category: string[];
  servicesRendered: string[];
  serviceSlugs: string[];
  description: string;
  processText: string;
  coverImage: string | null;
  results: string[];
  testimonialQuote: string;
  // Chi firma la testimonianza: di norma coincide con `client`, ma può differire quando
  // il progetto porta il nome del prodotto e non dell'azienda (es. Uropp Hub / Uropp Finance).
  testimonialAuthor: string;
  externalUrl: string;
  gradient: string;
  seoTitle: string;
  seoDescription: string;
  geoDescription: string;
  // Foto e video della galleria "classica" (senza sezione).
  gallery: ProjectGalleryItem[];
  // Gallerie con titolo (es. "Area Clienti", "Area Admin"): caricate solo nella pagina
  // del singolo progetto, vuote negli elenchi.
  gallerySections: ProjectGallerySectionView[];
}

type ProjectTranslationFields = {
  title: string;
  description: string;
  processText: string | null;
  resultsText: string | null;
  testimonialQuote: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  geoDescription: string | null;
};

type ProjectWithRelations = {
  id: string;
  slug: string;
  client: string;
  category: string[];
  description: string;
  processText: string | null;
  coverImage: string | null;
  resultsText: string | null;
  testimonialQuote: string | null;
  testimonialAuthor: string | null;
  externalUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  geoDescription: string | null;
  services: { service: { title: string; slug: string; translations?: { title: string }[] } }[];
  media: { id: string; url: string; alt: string; type: "IMAGE" | "VIDEO"; sectionId: string | null }[];
  gallerySections?: {
    id: string;
    title: string;
    description: string | null;
    translations?: { title: string; description: string | null }[];
  }[];
  translations?: ProjectTranslationFields[];
};

function toView(p: ProjectWithRelations): ProjectView {
  const t = p.translations?.[0];
  const description = t?.description || p.description;
  const processText = t?.processText || p.processText;
  const resultsText = t?.resultsText || p.resultsText;
  const testimonialQuote = t?.testimonialQuote || p.testimonialQuote;
  const seoTitle = t?.seoTitle || p.seoTitle;
  const seoDescription = t?.seoDescription || p.seoDescription;
  const geoDescription = t?.geoDescription || p.geoDescription;

  return {
    id: p.id,
    slug: p.slug,
    client: p.client,
    category: p.category,
    servicesRendered: p.services.map((s) => s.service.translations?.[0]?.title || s.service.title),
    serviceSlugs: p.services.map((s) => s.service.slug),
    description,
    processText: processText ?? "",
    coverImage: p.coverImage,
    results: resultsText ? resultsText.split(" · ").filter(Boolean) : [],
    testimonialQuote: testimonialQuote ?? "",
    // Nome proprio: si usa sempre l'originale, mai la versione passata dal traduttore.
    testimonialAuthor: p.testimonialAuthor || p.client,
    externalUrl: p.externalUrl ?? "#",
    gradient: gradientForSlug(p.slug),
    seoTitle: seoTitle ?? `${p.client} — Case Study`,
    seoDescription: seoDescription ?? description,
    geoDescription: geoDescription || seoDescription || description,
    gallery: p.media
      .filter((m) => !m.sectionId)
      .map((m) => ({ id: m.id, url: m.url, alt: m.alt, type: m.type })),
    gallerySections: (p.gallerySections ?? [])
      .map((section) => {
        const st = section.translations?.[0];
        return {
          id: section.id,
          title: st?.title || section.title,
          description: st?.description || section.description || "",
          items: p.media
            .filter((m) => m.sectionId === section.id && m.type === "IMAGE")
            .map((m) => ({ id: m.id, url: m.url, alt: m.alt, type: m.type })),
        };
      })
      .filter((section) => section.items.length > 0),
  };
}

export async function getPublishedProjects(locale: string = DEFAULT_LOCALE): Promise<ProjectView[]> {
  const isDefault = locale === DEFAULT_LOCALE;
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      services: {
        include: { service: { include: { translations: isDefault ? false : { where: { locale } } } } },
      },
      media: { orderBy: { order: "asc" } },
      translations: isDefault ? false : { where: { locale } },
    },
  });
  return projects.map(toView);
}

export async function getProjectBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<ProjectView | null> {
  const isDefault = locale === DEFAULT_LOCALE;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      services: {
        include: { service: { include: { translations: isDefault ? false : { where: { locale } } } } },
      },
      media: { orderBy: { order: "asc" } },
      gallerySections: {
        orderBy: { order: "asc" },
        include: { translations: isDefault ? false : { where: { locale } } },
      },
      translations: isDefault ? false : { where: { locale } },
    },
  });
  if (!project || !project.published) return null;
  return toView(project);
}

export async function getProjectsByServiceSlug(serviceSlug: string, locale: string = DEFAULT_LOCALE): Promise<ProjectView[]> {
  const all = await getPublishedProjects(locale);
  return all.filter((p) => p.serviceSlugs.includes(serviceSlug));
}

export async function getProjectCategoryOptions(): Promise<string[]> {
  const rows = await prisma.project.findMany({ select: { category: true } });
  const unique = new Set(rows.flatMap((r) => r.category).filter(Boolean));
  return [...unique].sort((a, b) => a.localeCompare(b));
}
