import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";
import { TiltCard } from "@/components/public/tilt-card";
import { buildAlternates } from "@/lib/i18n/metadata";
import { localize } from "@/lib/i18n/localize";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

const TITLE = "Blog — Consigli su Web, Branding e Social";
const DESCRIPTION =
  "Approfondimenti su design, sviluppo web, branding e social media a cura di Omnia Marketing, agenzia digitale a Napoli attiva in tutta Italia.";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: buildAlternates("/blog", locale),
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/blog", type: "website" },
  };
}

export default async function BlogPage() {
  const locale = await getLocale();
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: {
      category: true,
      translations: locale === DEFAULT_LOCALE ? false : { where: { locale } },
    },
  });
  const posts = rows.map((post) => localize(post, post.translations?.[0], ["title", "excerpt"]));

  return (
    <>
      <PageHero
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
