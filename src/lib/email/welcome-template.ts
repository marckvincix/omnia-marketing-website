import { renderEmailLayout, escapeHtml } from "./base-template";
import { getEmailMessages } from "@/lib/i18n/email-messages";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function renderWelcomeEmail({
  unsubscribeUrl,
  siteUrl,
  locale = DEFAULT_LOCALE,
}: {
  unsubscribeUrl: string;
  siteUrl: string;
  locale?: string;
}) {
  const m = await getEmailMessages(locale);
  return renderEmailLayout({
    title: m.welcomeEyebrow,
    eyebrow: m.welcomeEyebrow,
    heading: m.welcomeHeading,
    bodyHtml: `<p style="margin:0;">${escapeHtml(m.welcomeBody)}</p>`,
    ctaLabel: m.welcomeCta,
    ctaHref: `${siteUrl}/blog`,
    unsubscribeUrl,
    siteUrl,
    locale,
  });
}
