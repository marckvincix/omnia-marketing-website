"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validation/admin";

export async function saveSiteSettings(input: SiteSettingsInput) {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");

  const data = siteSettingsSchema.parse(input);

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle || null,
      heroCtaLabel: data.heroCtaLabel || null,
      heroCtaUrl: data.heroCtaUrl || null,
      companyName: data.companyName,
      piva: data.piva,
      legalAddress: data.legalAddress,
      operationalAddress: data.operationalAddress,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      footerText: data.footerText || null,
    },
    update: {
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle || null,
      heroCtaLabel: data.heroCtaLabel || null,
      heroCtaUrl: data.heroCtaUrl || null,
      companyName: data.companyName,
      piva: data.piva,
      legalAddress: data.legalAddress,
      operationalAddress: data.operationalAddress,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone || null,
      footerText: data.footerText || null,
    },
  });

  revalidatePath("/admin/impostazioni");
  revalidatePath("/");
  revalidatePath("/contatti");
}
