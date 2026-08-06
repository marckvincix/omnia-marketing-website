import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UploadForm } from "./upload-form";
import { MediaGrid } from "./media-grid";

export const metadata: Metadata = {
  title: "Media",
  robots: { index: false, follow: false },
};

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Immagini e video caricati, riutilizzabili in progetti, servizi e blog."
      />
      <UploadForm />
      <MediaGrid
        items={media.map((m) => ({ id: m.id, url: m.url, type: m.type, altText: m.altText }))}
      />
    </div>
  );
}
