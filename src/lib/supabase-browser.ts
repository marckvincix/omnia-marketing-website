"use client";

import { createClient } from "@supabase/supabase-js";

export const MEDIA_BUCKET = "media";

/**
 * Client Supabase lato browser, usato solo per caricare file direttamente su Storage
 * tramite URL firmati (bypassa il limite di 4.5MB delle Serverless Function di Vercel,
 * che si applica a qualsiasi richiesta instradata attraverso una server action).
 */
export function getBrowserStorageClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
