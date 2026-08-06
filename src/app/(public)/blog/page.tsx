import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";

export const metadata: Metadata = {
  title: "Blog",
  description: "Approfondimenti su design, web, branding e social a cura di Omnia Marketing.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={posts.length > 0 ? "Approfondimenti e novità." : "Presto i primi articoli."}
        description={
          posts.length > 0
            ? "Design, web, branding e social: idee e case study dallo studio."
            : "Stiamo preparando contenuti su design, web, branding e social. Torna a trovarci a breve."
        }
      />

      {posts.length > 0 && (
        <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="aspect-video w-full object-cover rounded-2xl mb-4"
                  />
                )}
                {post.category && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b50]">
                    {post.category.name}
                  </span>
                )}
                <h2 className="mt-2 font-display text-2xl text-white group-hover:text-[#ff6b50] transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-[#999999]">{post.excerpt}</p>
                <p className="mt-3 text-xs text-[#666666]">{post.readingTimeMinutes} min di lettura</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaBand
        title="Nel frattempo, parliamo del tuo progetto."
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
      />
    </>
  );
}
