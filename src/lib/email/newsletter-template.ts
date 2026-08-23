import { renderEmailLayout, escapeHtml } from "./base-template";
import { getEmailMessages } from "@/lib/i18n/email-messages";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function renderNewsletterEmail({
  title,
  excerpt,
  articleUrl,
  unsubscribeUrl,
  siteUrl,
  locale = DEFAULT_LOCALE,
}: {
  title: string;
  excerpt: string;
  articleUrl: string;
  unsubscribeUrl: string;
  siteUrl: string;
  locale?: string;
}) {
  const m = await getEmailMessages(locale);
  return renderEmailLayout({
    title,
    eyebrow: m.newsletterEyebrow,
    heading: title,
    bodyHtml: `<p style="margin:0;">${escapeHtml(excerpt)}</p>`,
    ctaLabel: m.newsletterCta,
    ctaHref: articleUrl,
    unsubscribeUrl,
    siteUrl,
    locale,
  });
}
