import { renderEmailLayout, escapeHtml } from "./base-template";

export function renderNewsletterEmail({
  title,
  excerpt,
  articleUrl,
  unsubscribeUrl,
  siteUrl,
}: {
  title: string;
  excerpt: string;
  articleUrl: string;
  unsubscribeUrl: string;
  siteUrl: string;
}) {
  return renderEmailLayout({
    title,
    eyebrow: "Nuovo aggiornamento",
    heading: title,
    bodyHtml: `<p style="margin:0;">${escapeHtml(excerpt)}</p>`,
    ctaLabel: "Leggi l'articolo completo →",
    ctaHref: articleUrl,
    unsubscribeUrl,
    siteUrl,
  });
}
