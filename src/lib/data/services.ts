import { prisma } from "@/lib/prisma";

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
}

function toView(s: {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  benefits: { title: string; description: string }[];
}): ServiceView {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    eyebrow: s.excerpt,
    intro: s.description,
    subservices: s.benefits.map((b) => ({ title: b.title, description: b.description })),
  };
}

export async function getPublishedServices(): Promise<ServiceView[]> {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { benefits: { orderBy: { order: "asc" } } },
  });
  return services.map(toView);
}

export async function getServiceBySlug(slug: string): Promise<ServiceView | null> {
  const service = await prisma.service.findUnique({
    where: { slug },
    include: { benefits: { orderBy: { order: "asc" } } },
  });
  if (!service || !service.published) return null;
  return toView(service);
}
