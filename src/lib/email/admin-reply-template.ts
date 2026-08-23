import { renderEmailLayout, escapeHtml } from "./base-template";
import { getEmailMessages } from "@/lib/i18n/email-messages";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function renderAdminReplyEmail({
  body,
  siteUrl,
  locale = DEFAULT_LOCALE,
}: {
  body: string;
  siteUrl: string;
  locale?: string;
}) {
  const m = await getEmailMessages(locale);
  const bodyHtml = body
    .split(/\n{2,}/)
    .map((paragraph) => `<p style="margin:0 0 16px;white-space:pre-wrap;">${escapeHtml(paragraph)}</p>`)
    .join("");

  return renderEmailLayout({
    title: m.adminReplyEyebrow,
    eyebrow: m.adminReplyEyebrow,
    heading: m.adminReplyHeading,
    bodyHtml,
    footerNote: m.adminReplyFooterNote,
    siteUrl,
    locale,
  });
}
