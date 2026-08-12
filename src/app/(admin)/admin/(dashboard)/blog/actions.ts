"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema, type BlogPostInput } from "@/lib/validation/admin";
import { computeReadingTime } from "@/lib/reading-time";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function saveBlogPost(input: BlogPostInput) {
  await requireAdmin();
  const data = blogPostSchema.parse(input);
  const readingTimeMinutes = computeReadingTime(data.content);

  const post = await prisma.blogPost.upsert({
    where: { id: data.id ?? "__new__" },
    create: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      categoryId: data.categoryId || null,
      readingTimeMinutes,
      published: data.published,
      publishedAt: data.published ? new Date() : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
    update: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      categoryId: data.categoryId || null,
      readingTimeMinutes,
      published: data.published,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  });

  if (data.published) {
    const existing = await prisma.blogPost.findUnique({ where: { id: post.id }, select: { publishedAt: true } });
    if (!existing?.publishedAt) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { publishedAt: new Date() } });
    }
  }

  await prisma.blogPostTag.deleteMany({ where: { postId: post.id } });
  for (const tagId of data.tagIds) {
    await prisma.blogPostTag.create({ data: { postId: post.id, tagId } });
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  // Il footer (in (public)/layout.tsx, comune a tutte le pagine pubbliche) mostra gli
  // ultimi 3 articoli: senza revalidare il layout resta con la lista vecchia finché non
  // scade la cache, anche se /blog è già aggiornato.
  revalidatePath("/", "layout");

  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  const post = await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/", "layout");
}
