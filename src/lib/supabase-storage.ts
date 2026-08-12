import { createClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";

export function getStorageClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
}

export interface UploadSlot {
  path: string;
  token: string;
  publicUrl: string;
}

/**
 * Genera uno slot di upload firmato invece di ricevere il file: le Serverless
 * Function di Vercel rifiutano qualsiasi richiesta oltre 4.5MB, un limite di
 * piattaforma che nessuna configurazione di Next.js può alzare. Il file va quindi
 * caricato direttamente dal browser a Supabase Storage con questo URL firmato,
 * bypassando del tutto la funzione serverless.
 */
export async function createUploadSlot(fileName: string, prefix = ""): Promise<UploadSlot> {
  const ext = fileName.split(".").pop() || "bin";
  const key = `${prefix}${crypto.randomUUID()}.${ext}`;

  const supabase = getStorageClient();
  const { data, error } = await supabase.storage.from(MEDIA_BUCKET).createSignedUploadUrl(key);
  if (error) throw new Error(error.message);

  const { data: pub } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(key);
  return { path: data.path, token: data.token, publicUrl: pub.publicUrl };
}
