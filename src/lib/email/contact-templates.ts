import { renderEmailLayout, escapeHtml } from "./base-template";
import { getEmailMessages, formatMessage } from "@/lib/i18n/email-messages";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function renderContactConfirmationEmail({
  name,
  siteUrl,
  locale = DEFAULT_LOCALE,
}: {
  name: string;
  siteUrl: string;
  locale?: string;
}) {
  const m = await getEmailMessages(locale);
  return renderEmailLayout({
    title: m.contactConfirmEyebrow,
    eyebrow: m.contactConfirmEyebrow,
    heading: formatMessage(m.contactConfirmHeading, { name: escapeHtml(name) }),
    bodyHtml: `
      <p style="margin:0 0 12px;">${escapeHtml(m.contactConfirmBody1)}</p>
      <p style="margin:0;">${escapeHtml(m.contactConfirmBody2)}</p>
    `,
    ctaLabel: m.contactConfirmCta,
    ctaHref: `${siteUrl}/progetti`,
    footerNote: m.contactConfirmFooterNote,
    siteUrl,
    locale,
  });
}

// Sempre in italiano: va all'admin (notifyEmail), non al visitatore che ha compilato il
// modulo — non dipende dalla lingua con cui quest'ultimo ha navigato il sito.
export async function renderContactNotificationEmail({
  name,
  email,
  phone,
  serviceName,
  message,
  siteUrl,
}: {
  name: string;
  email: string;
  phone: string;
  serviceName: string | null;
  message: string;
  siteUrl: string;
}) {
  const rows = [
    ["Nome", name],
    ["Email", email],
    ["Telefono", phone],
    ["Servizio", serviceName ?? "—"],
  ]
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:4px 12px 4px 0;color:#666666;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
          <td style="padding:4px 0;color:#ffffff;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return renderEmailLayout({
    title: "Nuova richiesta dal sito",
    eyebrow: "Nuovo messaggio",
    heading: `Nuova richiesta da ${name}`,
    bodyHtml: `
      <table role="presentation" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;margin:0 0 20px;">
        ${rows}
      </table>
      <p style="margin:0 0 4px;color:#666666;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;">Messaggio</p>
      <p style="margin:0;white-space:pre-wrap;">${escapeHtml(message)}</p>
    `,
    ctaLabel: "Vedi i messaggi →",
    ctaHref: `${siteUrl}/admin/messaggi`,
    footerNote: "Email automatica generata da una richiesta ricevuta tramite il modulo contatti del sito.",
    siteUrl,
  });
}
