import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";
import { saveTag, deleteTag } from "./actions";

export const metadata: Metadata = {
  title: "Tag Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogTagsPage() {
  const tags = await prisma.blogTag.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Tag Blog"
        description="Tag usati per etichettare gli articoli."
        action={
          <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground">
            ← Torna agli articoli
          </Link>
        }
      />
      <TaxonomyTable items={tags} label="Tag" onSave={saveTag} onDelete={deleteTag} />
    </div>
  );
}
