import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { analyzeSeo } from "@/lib/seo/analyze";
import { getAllPagesPerformance, isSearchConsoleConfigured } from "@/lib/seo/search-console";
import { PostTable } from "./post-table";

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  const [posts, performance] = await Promise.all([
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    isSearchConsoleConfigured() ? getAllPagesPerformance() : Promise.resolve(null),
  ]);
  const performanceMap = performance && !("error" in performance) ? performance : null;

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
          categoryName: p.category?.name ?? null,
          published: p.published,
          seoScore: analyzeSeo({
            focusKeyword: p.focusKeyword ?? "",
            seoTitle: p.seoTitle ?? "",
            fallbackTitle: p.title,
            seoDescription: p.seoDescription ?? "",
            slug: p.slug,
            content: p.content,
          }).score,
          performance: performanceMap?.get(`/blog/${p.slug}`) ?? null,
        }))}
      />
    </div>
  );
}
