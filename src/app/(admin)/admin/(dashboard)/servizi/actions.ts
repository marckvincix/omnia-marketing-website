"use server";

import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceSchema, type ServiceInput } from "@/lib/validation/admin";
import { translateAndSaveService } from "@/lib/i18n/translate-and-save";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveService(input: ServiceInput) {
  await requireAdmin();
  const data = serviceSchema.parse(input);

  const service = await prisma.service.upsert({
    where: { id: data.id ?? "__new__" },
    create: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      description: data.description,
      ctaLabel: data.ctaLabel,
      ctaUrl: data.ctaUrl,
      published: data.published,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
    update: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      description: data.description,
      ctaLabel: data.ctaLabel,
      ctaUrl: data.ctaUrl,
      published: data.published,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });

  const keepIds = data.benefits.filter((b) => b.id).map((b) => b.id!);
  await prisma.serviceBenefit.deleteMany({
    where: { serviceId: service.id, id: { notIn: keepIds.length ? keepIds : ["__none__"] } },
  });

  for (const [i, benefit] of data.benefits.entries()) {
    if (benefit.id) {
      await prisma.serviceBenefit.update({
        where: { id: benefit.id },
        data: { title: benefit.title, description: benefit.description, order: i },
      });
    } else {
      await prisma.serviceBenefit.create({
        data: {
          serviceId: service.id,
          title: benefit.title,
          description: benefit.description,
          order: i,
        },
      });
    }
  }

  revalidatePath("/admin/servizi");
  // "web"/"branding"/"social" sono cartelle statiche reali, non uno slug dinamico:
  // solo [locale] va scritto tra parentesi per revalidare la pagina su tutte le lingue.
  revalidatePath(`/[locale]/${service.slug}`, "page");
  revalidatePath("/[locale]/chi-siamo", "page");
  revalidatePath("/[locale]", "page");

  after(() => translateAndSaveService(service.id).catch((err) => console.error("[i18n] Traduzione servizio fallita", err)));
}

export async function deleteService(id: string) {
  await requireAdmin();
  const service = await prisma.service.delete({ where: { id } });
  revalidatePath("/admin/servizi");
  revalidatePath(`/[locale]/${service.slug}`, "page");
  revalidatePath("/[locale]", "page");
}
