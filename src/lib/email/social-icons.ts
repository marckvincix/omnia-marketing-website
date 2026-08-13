import { readFileSync } from "node:fs";
import path from "node:path";

// Icone reali (non testuali) da incorporare nel footer delle email come data URI,
// per lo stesso motivo del logo (vedi logo.ts): i client email non caricano
// affidabilmente immagini remote né SVG, e vanno lette da file per lo stesso
// motivo per cui vanno dichiarate in outputFileTracingIncludes su Vercel.
function loadIcon(fileName: string): string {
  const buffer = readFileSync(path.join(process.cwd(), "public", fileName));
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export const SOCIAL_ICON_DATA_URIS: Record<string, string> = {
  Instagram: loadIcon("email-icon-instagram.png"),
  Facebook: loadIcon("email-icon-facebook.png"),
  LinkedIn: loadIcon("email-icon-linkedin.png"),
};
