import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { PostTable } from "./post-table";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="Blog"
        description="Articoli pubblicati sul sito."
        action={
          <>
            <Link href="/admin/blog/categorie" className="text-sm text-muted-foreground hover:text-foreground">
              Categorie
            </Link>
            <Link href="/admin/blog/tag" className="text-sm text-muted-foreground hover:text-foreground">
              Tag
            </Link>
            <Button render={<Link href="/admin/blog/nuovo" />}>
              <Plus className="size-4" /> Nuovo articolo
            </Button>
          </>
        }
      />
      <PostTable
        posts={posts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          categoryName: p.category?.name ?? null,
          published: p.published,
        }))}
      />
    </div>
  );
}
