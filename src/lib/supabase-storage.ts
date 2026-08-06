import { createClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";

export function getStorageClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}
