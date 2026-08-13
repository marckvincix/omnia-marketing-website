import { renderEmailLayout, escapeHtml } from "./base-template";

export function renderAdminReplyEmail({ body, siteUrl }: { body: string; siteUrl: string }) {
  const bodyHtml = body
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;white-space:pre-wrap;">${escapeHtml(paragraph)}</p>`)
    .join("");

  return renderEmailLayout({
    title: "Risposta da Omnia Marketing",
    eyebrow: "Omnia Marketing",
    heading: "Abbiamo una risposta per te",
    bodyHtml,
    footerNote: "Rispondi pure direttamente a questa email per continuare la conversazione.",
    siteUrl,
  });
}
