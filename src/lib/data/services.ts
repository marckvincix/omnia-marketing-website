import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export interface ServiceSub {
  title: string;
  description: string;
}

export interface ServiceView {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  subservices: ServiceSub[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
}

type ServiceWithRelations = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  benefits: { title: string; description: string; translations?: { title: string; description: string }[] }[];
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  translations?: { title: string; excerpt: string; description: string; seoTitle: string | null; seoDescription: string | null }[];
};

function toView(s: ServiceWithRelations): ServiceView {
  const t = s.translations?.[0];
  return {
    id: s.id,
    slug: s.slug,
    title: t?.title || s.title,
    eyebrow: t?.excerpt || s.excerpt,
    intro: t?.description || s.description,
    subservices: s.benefits.map((b) => {
      const bt = b.translations?.[0];
      return { title: bt?.title || b.title, description: bt?.description || b.description };
    }),
    seoTitle: t?.seoTitle || s.seoTitle,
    seoDescription: t?.seoDescription || s.seoDescription,
    ogImage: s.ogImage,
  };
}

export async function getPublishedServices(locale: string = DEFAULT_LOCALE): Promise<ServiceView[]> {
  const isDefault = locale === DEFAULT_LOCALE;
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: {
      benefits: {
        orderBy: { order: "asc" },
        include: { translations: isDefault ? false : { where: { locale } } },
      },
      translations: isDefault ? false : { where: { locale } },
    },
  });
  return services.map(toView);
}

export async function getServiceBySlug(slug: string, locale: string = DEFAULT_LOCALE): Promise<ServiceView | null> {
  const isDefault = locale === DEFAULT_LOCALE;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      benefits: {
        orderBy: { order: "asc" },
        include: { translations: isDefault ? false : { where: { locale } } },
      },
      translations: isDefault ? false : { where: { locale } },
    },
  });
  if (!service || !service.published) return null;
  return toView(service);
}
