import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/public/hero";
import { IntroLogoReveal } from "@/components/public/intro-logo-reveal";
import { HorizontalTicker } from "@/components/public/horizontal-ticker";
import { ServicesIndex } from "@/components/public/services-index";
import { StackedProjects } from "@/components/public/stacked-projects";
import { CtaBand } from "@/components/public/cta-band";
import { getPublishedProjects } from "@/lib/data/projects";

const TITLE = "Omnia Marketing — Agenzia web, branding e social a Napoli";
const DESCRIPTION =
  "Omnia Marketing: crediamo nel design. Realizziamo siti web, e-commerce, branding e contenuti social per aziende che vogliono distinguersi. Agenzia web a Napoli, al fianco di aziende in tutta Italia da molti anni.";

export const metadata: Metadata = {
  // "absolute" bypassa il template "%s | Omnia Marketing" del layout root: il titolo
  // della home contiene già il brand, altrimenti diventerebbe duplicato in fondo.
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

export default async function HomePage() {
  const [settings, projects] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getPublishedProjects(),
  ]);

  return (
    <>
      <IntroLogoReveal />
      <Hero
        title={settings?.heroTitle}
        variants={{
          web: ["vuoi un sito\nche converte?", "il tuo sito\nti aspetta", "creiamo il tuo\nsito, ora"],
          branding: [
            "costruiamo\nil tuo brand",
            "la tua identità\nti aspetta",
            "diamo forma al\ntuo brand, ora",
          ],
          social: [
            "raccontiamo\ni tuoi social",
            "i tuoi contenuti\nti aspettano",
            "creiamo i tuoi\ncontenuti, ora",
          ],
        }}
      />
      <HorizontalTicker />
      <ServicesIndex />
      <StackedProjects projects={projects} />
      <CtaBand
        title="Crediamo nel design. Parliamo del tuo progetto."
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
        variants={{
          web: [
            {
              title: "Vuoi un sito che converte davvero?",
              description: "Dallo sviluppo all'e-commerce: realizziamo siti pensati per portare risultati.",
            },
            {
              title: "Continui a tornare a curiosare tra i nostri siti web.",
              description: "Raccontaci la tua idea: ne parliamo insieme, senza impegno.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Il tuo prossimo sito potrebbe già essere in lavorazione.",
              description: "Bastano 15 minuti per iniziare: scrivici oggi stesso.",
              ctaLabel: "Scrivici ora",
            },
          ],
          branding: [
            {
              title: "Vuoi un brand che si riconosce a colpo d'occhio?",
              description: "Strategy, naming, logo e UI/UX in un unico percorso su misura per te.",
            },
            {
              title: "Continui a tornare a vedere i nostri progetti di branding.",
              description: "Raccontaci la tua idea: ne parliamo insieme, senza impegno.",
              ctaLabel: "Parliamone",
            },
            {
              title: "La tua nuova identità potrebbe nascere questa settimana.",
              description: "Bastano 15 minuti per iniziare: scrivici oggi stesso.",
              ctaLabel: "Scrivici ora",
            },
          ],
          social: [
            {
              title: "Pronti a far crescere i tuoi canali social?",
              description: "Content, foto, video e spot per raccontare il tuo brand con uno stile coerente.",
            },
            {
              title: "Continui a tornare a vedere i nostri progetti social.",
              description: "Raccontaci i tuoi canali: ne parliamo insieme, senza impegno.",
              ctaLabel: "Parliamone",
            },
            {
              title: "I tuoi social potrebbero decollare da subito.",
              description: "Bastano 15 minuti per iniziare: scrivici oggi stesso.",
              ctaLabel: "Scrivici ora",
            },
          ],
        }}
      />
    </>
  );
}
