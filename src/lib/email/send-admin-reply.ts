import { resend, RESEND_FROM_EMAIL } from "./resend";
import { renderAdminReplyEmail } from "./admin-reply-template";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendAdminReplyEmail({
  to,
  subject,
  body,
  replyTo,
}: {
  to: string;
  subject: string;
  body: string;
  replyTo: string;
}) {
  const html = renderAdminReplyEmail({ body, siteUrl: SITE_URL });
  const { error } = await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to,
    replyTo,
    subject,
    html,
  });
  if (error) throw new Error(`Errore invio risposta a ${to}: ${error.message}`);
}
