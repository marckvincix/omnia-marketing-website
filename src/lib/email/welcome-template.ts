import { renderEmailLayout } from "./base-template";

export function renderWelcomeEmail({
  unsubscribeUrl,
  siteUrl,
}: {
  unsubscribeUrl: string;
  siteUrl: string;
}) {
  return renderEmailLayout({
    title: "Iscrizione confermata",
    eyebrow: "Iscrizione confermata",
    heading: "Grazie per esserti iscritto/a!",
    bodyHtml: `<p style="margin:0;">Da oggi riceverai in anteprima gli aggiornamenti, le novità e gli articoli di Omnia Marketing direttamente nella tua casella email.</p>`,
    ctaLabel: "Vai al blog →",
    ctaHref: `${siteUrl}/blog`,
    unsubscribeUrl,
    siteUrl,
  });
}
