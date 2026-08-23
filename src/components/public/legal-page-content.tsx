import { CookiePreferences } from "./cookie-preferences";

const PROSE_CLASSES =
  "[&_p]:mb-0 [&_strong]:text-white [&_strong]:font-semibold " +
  "[&_a]:text-white [&_a]:underline [&_a]:hover:text-[#2e9bd6] [&_a]:transition-colors " +
  "[&_ul]:list-disc [&_ul]:list-inside [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 " +
  "[&_table]:w-full [&_table]:text-sm [&_thead_tr]:border-b [&_thead_tr]:border-[#1a1a1a] [&_thead_tr]:text-left [&_thead_tr]:text-xs [&_thead_tr]:uppercase [&_thead_tr]:text-[#888888] " +
  "[&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_td]:px-4 [&_td]:py-3 [&_td]:align-top [&_tbody_tr]:border-b [&_tbody_tr]:border-[#1a1a1a] " +
  "[&_table]:mt-4 [&_table]:overflow-x-auto [&_table]:rounded-xl [&_table]:border [&_table]:border-[#1a1a1a]";

export interface LegalSection {
  heading: string;
  body: string;
}

/**
 * Pagine legali (privacy/cookie policy): il testo arriva già come HTML tradotto da DeepL
 * (link, <strong>, tabelle inclusi) invece che come JSX, perché con decine di link
 * incorporati a metà frase scomporre ogni frase in props separate sarebbe stato
 * impraticabile — stesso approccio già usato per il corpo degli articoli del blog.
 */
export function LegalPageContent({
  title,
  lastUpdated,
  intro,
  sections,
  preferencesAfterIndex,
}: {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  /** Indice (0-based) della sezione dopo la quale inserire i controlli reali di
   * CookiePreferences (non testo, un componente interattivo). */
  preferencesAfterIndex: number;
}) {
  return (
    <article className="px-6 md:px-12 pt-20 pb-32 max-w-3xl mx-auto">
      <h1 className="font-display font-black text-white text-4xl md:text-6xl mb-4">{title}</h1>
      <p className="text-sm text-[#666666] mb-16">{lastUpdated}</p>

      <div className="flex flex-col gap-10 text-[#cccccc] leading-relaxed">
        {intro && (
          <section>
            <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: intro }} />
          </section>
        )}

        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl text-white mb-3">{section.heading}</h2>
            <div className={PROSE_CLASSES} dangerouslySetInnerHTML={{ __html: section.body }} />
            {i === preferencesAfterIndex && (
              <div className="mt-4">
                <CookiePreferences />
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
