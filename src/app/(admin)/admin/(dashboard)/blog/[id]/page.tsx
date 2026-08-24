import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PostEditor } from "../post-editor";

export const metadata: Metadata = {
  title: "Modifica articolo",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [post, categories, tags] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id }, include: { tags: true } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.blogTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) notFound();

  return (
    <div>
      <AdminPageHeader title="Modifica articolo" />
      <PostEditor
        initial={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage ?? "",
          coverImageAlt: post.coverImageAlt ?? "",
          categoryId: post.categoryId ?? "",
          tagIds: post.tags.map((t) => t.tagId),
          published: post.published,
          seoTitle: post.seoTitle ?? "",
          seoDescription: post.seoDescription ?? "",
          geoTitle: post.geoTitle ?? "",
          geoDescription: post.geoDescription ?? "",
          focusKeyword: post.focusKeyword ?? "",
        }}
        categoryOptions={categories}
        tagOptions={tags}
      />
    </div>
  );
}
