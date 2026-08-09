import { prisma } from "@/lib/prisma";

export async function getLatestBlogPosts(limit: number) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getOtherBlogPosts(excludeSlug: string, limit: number) {
  return prisma.blogPost.findMany({
    where: { published: true, slug: { not: excludeSlug } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
