import { sendTrackedEmail, RESEND_FROM_EMAIL } from "./resend";
import { renderContactConfirmationEmail, renderContactNotificationEmail } from "./contact-templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendContactConfirmationEmail(name: string, email: string, locale?: string) {
  const html = await renderContactConfirmationEmail({ name, siteUrl: SITE_URL, locale });
  const { error } = await sendTrackedEmail({
    from: RESEND_FROM_EMAIL,
    to: email,
    subject: "Abbiamo ricevuto la tua richiesta — Omnia Marketing",
    html,
  });
  if (error) throw new Error(`Errore invio conferma a ${email}: ${error.message}`);
}

export async function sendContactNotificationEmail(params: {
  name: string;
  email: string;
  phone: string;
  serviceName: string | null;
  message: string;
  notifyEmail: string;
}) {
  const html = await renderContactNotificationEmail({ ...params, siteUrl: SITE_URL });
  const { error } = await sendTrackedEmail({
    from: RESEND_FROM_EMAIL,
    to: params.notifyEmail,
    subject: `Nuova richiesta da ${params.name} — Omnia Marketing`,
    html,
  });
  if (error) throw new Error(`Errore invio notifica a ${params.notifyEmail}: ${error.message}`);
}
