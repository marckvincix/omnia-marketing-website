import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Impostazioni",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const initial = {
    heroTitle: settings?.heroTitle ?? "",
    heroSubtitle: settings?.heroSubtitle ?? "",
    heroCtaLabel: settings?.heroCtaLabel ?? "",
    heroCtaUrl: settings?.heroCtaUrl ?? "",
    companyName: settings?.companyName ?? "",
    piva: settings?.piva ?? "",
    legalAddress: settings?.legalAddress ?? "",
    operationalAddress: settings?.operationalAddress ?? "",
    contactEmail: settings?.contactEmail ?? "",
    contactPhone: settings?.contactPhone ?? "",
    footerText: settings?.footerText ?? "",
  };

  return (
    <div>
      <AdminPageHeader title="Impostazioni" description="Contenuti dell'homepage e dati aziendali." />
      <SettingsForm initial={initial} />
    </div>
  );
}
