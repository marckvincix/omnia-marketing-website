import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TaxonomyTable } from "@/components/admin/taxonomy-table";
import { saveCategory, deleteCategory } from "./actions";

export const metadata: Metadata = {
  title: "Categorie Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogCategoriesPage() {
  const categories = await prisma.blogCategory.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <AdminPageHeader
        title="Categorie Blog"
        description="Categorie usate per organizzare gli articoli."
        action={
          <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground">
            ← Torna agli articoli
          </Link>
        }
      />
      <TaxonomyTable items={categories} label="Categoria" onSave={saveCategory} onDelete={deleteCategory} />
    </div>
  );
}
