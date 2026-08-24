"use server";

import { auth } from "@/lib/auth";
import { getRelatedKeywords, type RelatedKeywordsResult } from "./trends";
import { getSearchConsolePageInsights, isSearchConsoleConfigured } from "./search-console";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Non autorizzato");
}

export async function fetchRelatedKeywords(
  seed: string,
): Promise<{ ok: true; data: RelatedKeywordsResult } | { ok: false; error: string }> {
  await requireAdmin();
  return getRelatedKeywords(seed);
}

export async function fetchPageSearchConsoleInsights(pagePath: string) {
  await requireAdmin();
  if (!isSearchConsoleConfigured()) {
    return { ok: false as const, error: "Google Search Console non è ancora collegata (vedi la pagina Analytics)." };
  }
  const result = await getSearchConsolePageInsights(pagePath);
  if ("error" in result) return { ok: false as const, error: result.error };
  return { ok: true as const, data: result };
}
