import { prisma } from "@/lib/prisma";
import { localize } from "@/lib/i18n/localize";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

const TRANSLATABLE_FIELDS = ["title", "excerpt", "content", "seoTitle", "seoDescription"] as const;

export async function getLatestBlogPosts(limit: number, locale: string = DEFAULT_LOCALE) {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: locale === DEFAULT_LOCALE ? undefined : { translations: { where: { locale } } },
  });

  if (locale === DEFAULT_LOCALE) return posts;
  return posts.map((post) => {
    const p = post as typeof post & { translations?: { title: string; excerpt: string; content: string; seoTitle: string | null; seoDescription: string | null }[] };
    return localize(post, p.translations?.[0], [...TRANSLATABLE_FIELDS]);
  });
}
