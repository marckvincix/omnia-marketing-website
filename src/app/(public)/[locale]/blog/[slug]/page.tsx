import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/shared/json-ld";
import { buildAlternates } from "@/lib/i18n/metadata";
import { localize } from "@/lib/i18n/localize";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

async function getLocalizedPost(slug: string, locale: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      category: true,
      tags: { include: { tag: true } },
      translations: locale === DEFAULT_LOCALE ? false : { where: { locale } },
    },
  });
  if (!post) return null;
  return localize(post, post.translations?.[0], ["title", "excerpt", "content", "seoTitle", "seoDescription"]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getLocalizedPost(slug, locale);
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: buildAlternates(`/blog/${slug}`, locale),
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getLocalizedPost(slug, locale);

  if (!post || !post.published) notFound();

  // "breaks: true" mantiene la resa dei vecchi articoli scritti come testo semplice
  // (dove ogni a-capo contava), mentre in più interpreta la sintassi Markdown
  // (## titoli, **grassetto**, - elenchi, [link](url)) per chi la usa da ora in poi.
  const contentHtml = marked.parse(post.content, { breaks: true, gfm: true, async: false });

  return (
    <article>
      <BreadcrumbJsonLd items={[{ name: "Blog", url: "/blog" }, { name: post.title, url: `/blog/${post.slug}` }]} />
      <ArticleJsonLd
        title={post.title}
        description={post.seoDescription || post.excerpt}
        url={`/blog/${post.slug}`}
        datePublished={(post.publishedAt ?? post.createdAt).toISOString()}
        dateModified={post.updatedAt.toISOString()}
        image={post.coverImage ?? undefined}
      />

      <header className="px-6 md:px-12 pt-20 pb-12 max-w-3xl mx-auto">
        <Link href="/blog" className="text-xs font-bold tracking-normal uppercase text-[#666666] hover:text-white transition-colors">
          ← Blog
        </Link>
        {post.category && (
          <p className="mt-6 text-[10px] font-bold uppercase tracking-normal text-[#2e9bd6]">
            {post.category.name}
          </p>
        )}
        <h1 className="mt-2 font-display font-black text-white text-4xl md:text-6xl leading-[0.95]">
          {post.title}
        </h1>
        <p className="mt-6 text-sm text-[#666666]">{post.readingTimeMinutes} min di lettura</p>
      </header>

      {post.coverImage && (
        <div className="relative mx-6 md:mx-auto md:max-w-4xl aspect-video rounded-2xl overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill sizes="(max-width: 896px) 100vw, 896px" className="object-cover" priority />
        </div>
      )}

      <div
        className="px-6 md:px-12 py-16 max-w-3xl mx-auto text-[#cccccc] leading-relaxed
          [&_p]:mb-5 [&_h2]:font-display [&_h2]:text-white [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4
          [&_h3]:font-display [&_h3]:text-white [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3
          [&_strong]:text-white [&_strong]:font-semibold
          [&_a]:text-[#2e9bd6] [&_a]:underline [&_a]:hover:text-white [&_a]:transition-colors
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_li]:mb-1.5
          [&_blockquote]:border-l-2 [&_blockquote]:border-[#2e9bd6] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#999999]"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {post.tags.length > 0 && (
        <div className="px-6 md:px-12 pb-16 max-w-3xl mx-auto flex flex-wrap gap-2">
          {post.tags.map(({ tag }) => (
            <span key={tag.id} className="rounded-full border border-[#2a2a2a] px-3 py-1 text-xs text-[#999999]">
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
