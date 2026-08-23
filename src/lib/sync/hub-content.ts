import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { classifyCategory } from "./classify-category";
import { translateAndSaveBlogPost } from "@/lib/i18n/translate-and-save";

type HubContentRow = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  image_url: string | null;
  published_at: string | null;
  category: string | null;
};

const KNOWN_CATEGORY_SLUGS = new Set(["web", "branding", "social"]);

function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function syncHubBlogPosts() {
  const hubUrl = process.env.HUB_SUPABASE_URL;
  const hubKey = process.env.HUB_SUPABASE_ANON_KEY;
  if (!hubUrl || !hubKey) {
    throw new Error("HUB_SUPABASE_URL / HUB_SUPABASE_ANON_KEY non configurate");
  }

  const hub = createClient(hubUrl, hubKey);
  const { data, error } = await hub
    .from("content_updates")
    .select("id, title, excerpt, body, image_url, published_at, category")
    .eq("stato", "pubblicato")
    .eq("visibility", "tutti");

  if (error) throw new Error(`Errore lettura Omnia Hub: ${error.message}`);

  const rows = (data ?? []) as HubContentRow[];
  let created = 0;
  let updated = 0;
  const affectedSlugs: string[] = [];
  const affectedPostIds: string[] = [];

  const categories = await prisma.blogCategory.findMany({
    where: { slug: { in: ["web", "branding", "social"] } },
  });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  for (const row of rows) {
    const existing = await prisma.blogPost.findUnique({ where: { externalId: row.id } });

    const baseSlug = slugify(row.title) || row.id;
    const slug = existing?.slug ?? (await uniqueSlug(baseSlug));

    // Preferiamo la categoria assegnata da Hub, se presente e valida; altrimenti la deduciamo
    // dal testo con il classificatore. Se l'admin ha già assegnato una categoria a mano
    // nell'editor del sito, non la sovrascriviamo comunque a ogni risincronizzazione.
    const hubSlug = row.category && KNOWN_CATEGORY_SLUGS.has(row.category) ? row.category : null;
    const guessedSlug = hubSlug ?? classifyCategory(`${row.title} ${row.excerpt ?? ""} ${row.body}`);
    const guessedCategoryId = guessedSlug ? categoryIdBySlug.get(guessedSlug) : undefined;

    const basePostData = {
      title: row.title,
      excerpt: row.excerpt || row.title,
      content: row.body,
      coverImage: row.image_url,
      readingTimeMinutes: estimateReadingTime(row.body),
      published: true,
    };

    if (existing) {
      // Non tocchiamo publishedAt di un articolo già pubblicato se Hub non fornisce una
      // data (published_at nullo): altrimenti ogni risincronizzazione settimanale lo
      // "ripubblicherebbe" con la data odierna, facendolo risalire in cima al blog e al
      // footer come se fosse appena uscito.
      await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          ...basePostData,
          ...(row.published_at ? { publishedAt: new Date(row.published_at) } : {}),
          ...(existing.categoryId ? {} : { categoryId: guessedCategoryId }),
        },
      });
      updated++;
      affectedPostIds.push(existing.id);
    } else {
      const created_ = await prisma.blogPost.create({
        data: {
          ...basePostData,
          publishedAt: row.published_at ? new Date(row.published_at) : new Date(),
          slug,
          externalId: row.id,
          categoryId: guessedCategoryId,
        },
      });
      created++;
      affectedPostIds.push(created_.id);
    }
    affectedSlugs.push(slug);
  }

  if (rows.length > 0) {
    revalidatePath("/[locale]/blog", "page");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/[locale]/blog/[slug]", "page");

    // Traduzione automatica anche per gli articoli sincronizzati da Hub (non passano
    // dall'editor admin): parte dopo la risposta della cron, non la blocca.
    for (const postId of affectedPostIds) {
      after(() =>
        translateAndSaveBlogPost(postId).catch((err) =>
          console.error(`[i18n] Traduzione articolo sync Hub fallita (${postId})`, err),
        ),
      );
    }
  }

  return { total: rows.length, created, updated };
}

async function uniqueSlug(base: string) {
  let slug = base;
  let i = 2;
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${base}-${i}`;
    i++;
  }
  return slug;
}
