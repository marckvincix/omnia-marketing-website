import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";
import { TiltCard } from "@/components/public/tilt-card";

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
              <TiltCard key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="card-hover-glow group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]"
                >
                  {post.coverImage && (
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    {post.category && (
                      <span className="text-[10px] font-bold uppercase tracking-normal text-[#2e9bd6]">
                        {post.category.name}
                      </span>
                    )}
                    <h2 className="mt-2 font-display text-2xl text-white group-hover:text-[#2e9bd6] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-[#999999]">{post.excerpt}</p>
                    <p className="mt-3 text-xs text-[#666666]">{post.readingTimeMinutes} min di lettura</p>
                  </div>
                </Link>
              </TiltCard>
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
