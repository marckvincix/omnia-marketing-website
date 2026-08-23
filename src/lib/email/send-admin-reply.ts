import { sendTrackedEmail, RESEND_FROM_EMAIL } from "./resend";
import { renderAdminReplyEmail } from "./admin-reply-template";
import { translateTexts, DeepLQuotaExceededError } from "@/lib/i18n/deepl";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/locales";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function sendAdminReplyEmail({
  to,
  subject,
  body,
  replyTo,
  locale = DEFAULT_LOCALE,
}: {
  to: string;
  subject: string;
  body: string;
  replyTo: string;
  locale?: string;
}) {
  // A differenza degli altri template, qui il testo è scritto a mano dall'admin ogni
  // volta (non pre-tradotto al salvataggio di un contenuto): va tradotto al momento
  // dell'invio, unica eccezione nel sistema che chiama DeepL in tempo reale — invio
  // manuale e sporadico, impatto trascurabile sulla quota mensile.
  let translatedBody = body;
  if (locale !== DEFAULT_LOCALE) {
    try {
      const [translated] = await translateTexts([body], locale as Exclude<Locale, "it">);
      translatedBody = translated;
    } catch (err) {
      if (err instanceof DeepLQuotaExceededError) {
        console.error("[i18n] Quota DeepL esaurita: risposta admin inviata in italiano.");
      } else {
        console.error("[i18n] Traduzione risposta admin fallita, invio in italiano", err);
      }
    }
  }

  const html = await renderAdminReplyEmail({ body: translatedBody, siteUrl: SITE_URL, locale });
  const { error } = await sendTrackedEmail({
    from: RESEND_FROM_EMAIL,
    to,
    replyTo,
    subject,
    html,
  });
  if (error) throw new Error(`Errore invio risposta a ${to}: ${error.message}`);
}
