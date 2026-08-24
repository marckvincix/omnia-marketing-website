"use server";

import { auth } from "@/lib/auth";
import { getRelatedKeywords, type RelatedKeywordsResult } from "./trends";

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
