import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageContent, type LegalSection } from "@/components/public/legal-page-content";
import { buildAlternates } from "@/lib/i18n/metadata";
import { DEFAULT_LOCALE } from "@/lib/i18n/locales";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Cookie Policy",
    description: "Informativa estesa sui cookie e sulle tecnologie di tracciamento utilizzate dal sito di Omnia Marketing, ai sensi del Regolamento (UE) 2016/679 e delle Linee guida del Garante Privacy.",
    alternates: buildAlternates("/cookie-policy", locale),
  };
}

// Stessa logica di privacy-policy/page.tsx: i link interni tra le due pagine legali sono
// scritti senza prefisso lingua nel testo tradotto, li riscriviamo qui.
function localizeInternalLinks(html: string, locale: string): string {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  return html
    .replaceAll('href="/cookie-policy"', `href="${prefix}/cookie-policy"`)
    .replaceAll('href="/privacy-policy"', `href="${prefix}/privacy-policy"`);
}

export default async function CookiePolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("legal.cookiePolicy");
  const sections = (t.raw("sections") as LegalSection[]).map((s) => ({
    ...s,
    body: localizeInternalLinks(s.body, locale),
  }));

  return (
    <LegalPageContent
      title={t("title")}
      lastUpdated={t("lastUpdated")}
      sections={sections}
      preferencesAfterIndex={9}
    />
  );
}
