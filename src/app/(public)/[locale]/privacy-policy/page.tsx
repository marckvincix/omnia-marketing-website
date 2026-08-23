import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageContent, type LegalSection } from "@/components/public/legal-page-content";
import { buildAlternates } from "@/lib/i18n/metadata";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Privacy Policy",
    description: "Informativa sulla privacy di Omnia Marketing ai sensi del Regolamento (UE) 2016/679 (GDPR) e del Codice Privacy italiano.",
    alternates: buildAlternates("/privacy-policy", locale),
  };
}

// I link interni tra le due pagine legali sono scritti nel testo tradotto come percorsi
// senza prefisso lingua (es. href="/cookie-policy"): li riscriviamo qui in base alla lingua
// corrente, invece di gestirli come link Next.js dentro un HTML già tradotto da DeepL.
function localizeInternalLinks(html: string, locale: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return html
    .replaceAll('href="/cookie-policy"', `href="${prefix}/cookie-policy"`)
    .replaceAll('href="/privacy-policy"', `href="${prefix}/privacy-policy"`);
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("legal.privacyPolicy");
  const sections = (t.raw("sections") as LegalSection[]).map((s) => ({
    ...s,
    body: localizeInternalLinks(s.body, locale),
  }));

  return (
    <LegalPageContent
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      intro={localizeInternalLinks(t.raw("intro"), locale)}
      sections={sections}
      preferencesAfterIndex={8}
    />
  );
}
