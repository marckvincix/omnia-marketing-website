import { prisma } from "@/lib/prisma";

export async function getLatestBlogPosts(limit: number) {
  return prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}
