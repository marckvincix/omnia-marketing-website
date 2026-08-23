import { prisma } from "@/lib/prisma";
import { TARGET_LOCALES, type Locale } from "./locales";

export interface ContentTypeCoverage {
  label: string;
  href: string;
  total: number;
  fullyTranslated: number;
}

export interface MissingTranslationItem {
  contentLabel: string;
  itemLabel: string;
  href: string;
  missingLocales: Locale[];
}

export interface TranslationCoverage {
  byType: ContentTypeCoverage[];
  missingItems: MissingTranslationItem[];
}

function missingLocalesFor(translations: { locale: string }[]): Locale[] {
  const present = new Set(translations.map((t) => t.locale));
  return TARGET_LOCALES.filter((l) => !present.has(l));
}

// Copertura delle traduzioni per ogni modello collegato a una tabella *Translation:
// quanti elementi hanno tutte le 7 lingue e quali (se ce ne sono) ne mancano ancora
// qualcuna — appena aggiunto un contenuto nuovo la traduzione parte in background dopo
// il salvataggio, quindi per qualche secondo/minuto è normale vederlo qui come mancante.
export async function getTranslationCoverage(): Promise<TranslationCoverage> {
  const [posts, projects, services, benefits, testimonials, faqs, team, siteSettings] = await Promise.all([
    prisma.blogPost.findMany({
      select: { id: true, title: true, translations: { select: { locale: true } } },
    }),
    prisma.project.findMany({
      select: { id: true, title: true, translations: { select: { locale: true } } },
    }),
    prisma.service.findMany({
      select: { id: true, title: true, translations: { select: { locale: true } } },
    }),
    prisma.serviceBenefit.findMany({
      select: { id: true, title: true, translations: { select: { locale: true } } },
    }),
    prisma.testimonial.findMany({
      select: { id: true, authorName: true, translations: { select: { locale: true } } },
    }),
    prisma.faq.findMany({
      select: { id: true, question: true, translations: { select: { locale: true } } },
    }),
    prisma.teamMember.findMany({
      select: { id: true, name: true, translations: { select: { locale: true } } },
    }),
    prisma.siteSettingsTranslation.findMany({ select: { locale: true } }),
  ]);

  const groups: { key: string; label: string; href: string; items: { id: string; name: string; translations: { locale: string }[] }[] }[] = [
    { key: "blog", label: "Articoli blog", href: "/admin/blog", items: posts.map((p) => ({ id: p.id, name: p.title, translations: p.translations })) },
    { key: "progetti", label: "Progetti", href: "/admin/progetti", items: projects.map((p) => ({ id: p.id, name: p.title, translations: p.translations })) },
    { key: "servizi", label: "Servizi", href: "/admin/servizi", items: services.map((s) => ({ id: s.id, name: s.title, translations: s.translations })) },
    { key: "benefit", label: "Vantaggi servizi", href: "/admin/servizi", items: benefits.map((b) => ({ id: b.id, name: b.title, translations: b.translations })) },
    { key: "testimonianze", label: "Testimonianze", href: "/admin/testimonianze", items: testimonials.map((t) => ({ id: t.id, name: t.authorName, translations: t.translations })) },
    { key: "faq", label: "FAQ", href: "/admin/faq", items: faqs.map((f) => ({ id: f.id, name: f.question, translations: f.translations })) },
    { key: "team", label: "Team", href: "/admin/team", items: team.map((m) => ({ id: m.id, name: m.name, translations: m.translations })) },
  ];

  const byType: ContentTypeCoverage[] = [];
  const missingItems: MissingTranslationItem[] = [];

  for (const group of groups) {
    let fullyTranslated = 0;
    for (const item of group.items) {
      const missing = missingLocalesFor(item.translations);
      if (missing.length === 0) {
        fullyTranslated++;
      } else {
        missingItems.push({
          contentLabel: group.label,
          itemLabel: item.name,
          href: group.href,
          missingLocales: missing,
        });
      }
    }
    byType.push({ label: group.label, href: group.href, total: group.items.length, fullyTranslated });
  }

  // Impostazioni sito: singleton, non ha una lista di elementi — solo presente/assente per lingua.
  const settingsMissing = missingLocalesFor(siteSettings);
  byType.push({
    label: "Impostazioni sito",
    href: "/admin/impostazioni",
    total: 1,
    fullyTranslated: settingsMissing.length === 0 ? 1 : 0,
  });
  if (settingsMissing.length > 0) {
    missingItems.push({
      contentLabel: "Impostazioni sito",
      itemLabel: "Testi homepage e footer",
      href: "/admin/impostazioni",
      missingLocales: settingsMissing,
    });
  }

  return { byType, missingItems };
}
