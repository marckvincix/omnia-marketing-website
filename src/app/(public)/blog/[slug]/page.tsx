import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CtaBand } from "@/components/public/cta-band";
import { BreadcrumbJsonLd, ArticleJsonLd } from "@/components/shared/json-ld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return {};

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true, tags: { include: { tag: true } } },
  });

  if (!post || !post.published) notFound();

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

      <div className="px-6 md:px-12 py-16 max-w-3xl mx-auto text-[#cccccc] leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {post.tags.length > 0 && (
        <div className="px-6 md:px-12 pb-16 max-w-3xl mx-auto flex flex-wrap gap-2">
          {post.tags.map(({ tag }) => (
            <span key={tag.id} className="rounded-full border border-[#2a2a2a] px-3 py-1 text-xs text-[#999999]">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <CtaBand
        title="Ti interessa un progetto simile?"
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
      />
    </article>
  );
}
