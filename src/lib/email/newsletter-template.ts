import { SOCIAL_LINKS } from "@/lib/social-links";

const BRAND_BLUE = "#2e9bd6";
const BG = "#000000";
const CARD_BG = "#0a0a0a";
const BORDER = "#1f1f1f";
const TEXT_MUTED = "#999999";
const TEXT_FAINT = "#666666";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

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
  const safeTitle = escapeHtml(title);
  const safeExcerpt = escapeHtml(excerpt);

  const socialBadges = SOCIAL_LINKS.map(
    (social) => `
      <a href="${social.href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;border-radius:999px;border:1px solid ${BORDER};color:${TEXT_MUTED};font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;text-decoration:none;margin:0 6px;">
        ${social.label.slice(0, 2).toUpperCase()}
      </a>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="it">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${BG};font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG};padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:600px;" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom:32px;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;">OMNIA</span>
                <br />
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:${BRAND_BLUE};letter-spacing:0.05em;">MARKETING</span>
              </td>
            </tr>
            <tr>
              <td style="background-color:${CARD_BG};border:1px solid ${BORDER};border-radius:24px;padding:40px 32px;">
                <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:${BRAND_BLUE};">
                  Nuovo aggiornamento
                </p>
                <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;font-weight:900;color:#ffffff;">
                  ${safeTitle}
                </h1>
                <p style="margin:0 0 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${TEXT_MUTED};">
                  ${safeExcerpt}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:999px;background-color:#000000;border:1px solid ${BRAND_BLUE};box-shadow:0 0 20px -4px rgba(46,155,214,0.55);">
                      <a href="${articleUrl}" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">
                        Leggi l'articolo completo →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 8px 0;text-align:center;">
                ${socialBadges}
              </td>
            </tr>
            <tr>
              <td style="padding:24px 8px 0;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.8;color:${TEXT_FAINT};">
                Omnia Marketing &middot;
                <a href="${siteUrl}" style="color:${TEXT_FAINT};">${siteUrl.replace(/^https?:\/\//, "")}</a>
                &middot;
                <a href="mailto:info@omniamarketing.it" style="color:${TEXT_FAINT};">info@omniamarketing.it</a>
                <br />
                Hai ricevuto questa email perché sei iscritto alla newsletter di Omnia Marketing.
                <br />
                <a href="${unsubscribeUrl}" style="color:${TEXT_FAINT};text-decoration:underline;">Disiscriviti</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
