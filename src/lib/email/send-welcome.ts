import { resend, RESEND_FROM_EMAIL } from "./resend";
import { renderWelcomeEmail } from "./welcome-template";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendWelcomeEmail(email: string, unsubscribeToken: string, locale?: string) {
  const unsubscribeUrl = `${SITE_URL}/disiscriviti?email=${encodeURIComponent(email)}&token=${unsubscribeToken}`;
  const html = await renderWelcomeEmail({ unsubscribeUrl, siteUrl: SITE_URL, locale });

  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: email,
    subject: "Iscrizione confermata — Omnia Marketing",
    html,
  });

  if (error) {
    throw new Error(`Errore invio email di benvenuto a ${email}: ${error.message}`);
  }
}
