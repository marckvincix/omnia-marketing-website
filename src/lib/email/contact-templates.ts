import { renderEmailLayout, escapeHtml } from "./base-template";

export function renderContactConfirmationEmail({
  name,
  siteUrl,
}: {
  name: string;
  siteUrl: string;
}) {
  return renderEmailLayout({
    title: "Richiesta ricevuta",
    eyebrow: "Richiesta ricevuta",
    heading: `Grazie, ${name}!`,
    bodyHtml: `
      <p style="margin:0 0 12px;">Abbiamo ricevuto la tua richiesta: il nostro team la sta già elaborando e ti risponderemo il prima possibile.</p>
      <p style="margin:0;">Nel frattempo puoi dare un'occhiata ai nostri progetti più recenti.</p>
    `,
    ctaLabel: "Guarda il portfolio →",
    ctaHref: `${siteUrl}/progetti`,
    footerNote: "Questa è un'email automatica di conferma per la richiesta inviata dal modulo contatti.",
    siteUrl,
  });
}

export function renderContactNotificationEmail({
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
