import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "./tilt-card";

export type BlogCardPost = {
  slug: string;
  title: string;
  coverImage: string | null;
  readingTimeMinutes: number;
};

export function BlogCardsGrid({ posts }: { posts: BlogCardPost[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <TiltCard key={post.slug}>
          <Link href={`/blog/${post.slug}`} className="group block h-full">
            <article className="card-hover-glow relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a0a0a]">
              <div className="relative aspect-[16/10] overflow-hidden bg-[#111111]">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="min-w-0">
                  <h3 className="font-display text-lg text-white truncate">{post.title}</h3>
                  <p className="text-[#666666] text-[10px] font-bold uppercase tracking-normal mt-1">
                    {post.readingTimeMinutes} min di lettura
                  </p>
                </div>
                <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-white/20 p-2.5 text-white transition-all group-hover:bg-[#2e9bd6] group-hover:border-transparent group-hover:text-black">
                  <ArrowUpRight className="size-5" aria-hidden="true" />
                </span>
              </div>
            </article>
          </Link>
        </TiltCard>
      ))}
    </div>
  );
}
