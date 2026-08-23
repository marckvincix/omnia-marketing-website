import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeeplUsageCard } from "@/components/admin/deepl-usage-card";
import { getTranslationCoverage } from "@/lib/i18n/coverage";
import { LOCALE_META } from "@/lib/i18n/locales";

export const metadata: Metadata = {
  title: "Traduzioni",
  robots: { index: false, follow: false },
};

export default async function AdminTraduzioniPage() {
  const { byType, missingItems } = await getTranslationCoverage();

  return (
    <div>
      <AdminPageHeader
        title="Traduzioni"
        description="Stato della traduzione automatica del sito in inglese, tedesco, spagnolo, russo, cinese, giapponese e arabo."
      />

      <DeeplUsageCard />

      <div className="mb-8 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Ogni contenuto salvato in admin viene tradotto automaticamente in background con
        DeepL, nella lingua italiana come sorgente. Questa pagina è solo un pannello di
        controllo per verificare che sia andato tutto a buon fine: non c&apos;è un pulsante
        qui per forzare o rilanciare una traduzione — se qualcosa manca da tempo o dopo aver
        aggiunto un contenuto nuovo, chiedimelo in chat e me ne occupo io.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {byType.map((type) => {
          const complete = type.fullyTranslated === type.total;
          return (
            <Link
              key={type.label}
              href={type.href}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
            >
              <p className={`text-2xl font-semibold ${complete ? "" : "text-amber-600 dark:text-amber-400"}`}>
                {type.fullyTranslated}/{type.total}
              </p>
              <p className="text-sm text-muted-foreground">{type.label}</p>
            </Link>
          );
        })}
      </div>

      <div>
        <AdminPageHeader
          title="Da tradurre"
          description={
            missingItems.length === 0
              ? "Tutto tradotto in tutte le lingue."
              : `${missingItems.length} ${missingItems.length === 1 ? "contenuto" : "contenuti"} con almeno una lingua mancante.`
          }
        />

        {missingItems.length > 0 && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Sezione</th>
                  <th className="px-4 py-3 font-medium">Contenuto</th>
                  <th className="px-4 py-3 font-medium">Lingue mancanti</th>
                </tr>
              </thead>
              <tbody>
                {missingItems.map((item, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{item.contentLabel}</td>
                    <td className="px-4 py-3">
                      <Link href={item.href} className="hover:underline">
                        {item.itemLabel}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {item.missingLocales.map((locale) => (
                          <span
                            key={locale}
                            className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-700 dark:text-amber-400"
                          >
                            {LOCALE_META[locale].label}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
