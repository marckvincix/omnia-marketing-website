import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { CtaBand } from "@/components/public/cta-band";
import { StackedProjects } from "@/components/public/stacked-projects";
import { getPublishedProjects } from "@/lib/data/projects";
import { buildAlternates } from "@/lib/i18n/metadata";

const TITLE = "Portfolio — Progetti Web, Branding e Social a Napoli";
const DESCRIPTION =
  "I progetti realizzati da Omnia Marketing: siti web, e-commerce, branding e social per aziende a Napoli e in tutta Italia che vogliono distinguersi.";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: buildAlternates("/progetti", locale),
    openGraph: { title: TITLE, description: DESCRIPTION, url: "/progetti", type: "website" },
  };
}

export default async function ProgettiPage() {
  const locale = await getLocale();
  const projects = await getPublishedProjects(locale);

  return (
    <>
      <ScrollWordReveal text="Ogni progetto nasce da un ascolto attento e si costruisce insieme al cliente, dal primo brief al risultato finale." />
      <StackedProjects projects={projects} />
      <CtaBand
        title="Il prossimo progetto potrebbe essere il tuo."
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
        variants={{
          web: [
            {
              title: "Vuoi un sito come questi?",
              description: "Realizziamo siti, app ed e-commerce su misura per il tuo business.",
            },
            {
              title: "Torni spesso a guardare questi progetti web. Ti piace quello che vedi?",
              description: "Parliamone: possiamo costruire qualcosa di simile per te.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Continui a tornare su questi progetti. Forse è il momento di iniziare il tuo.",
              description: "Scrivici oggi: vediamo insieme come realizzare il tuo prossimo sito.",
              ctaLabel: "Scrivici ora",
            },
          ],
          branding: [
            {
              title: "Vuoi un'identità come queste?",
              description: "Strategy, naming e logo design per un brand che si distingue.",
            },
            {
              title: "Torni spesso a guardare questi progetti di branding. Ti piace quello che vedi?",
              description: "Parliamone: possiamo costruire un'identità simile per te.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Continui a tornare su questi progetti. Forse è il momento di iniziare il tuo.",
              description: "Scrivici oggi: vediamo insieme come costruire il tuo brand.",
              ctaLabel: "Scrivici ora",
            },
          ],
          social: [
            {
              title: "Vuoi contenuti social come questi?",
              description: "Gestiamo i tuoi canali con foto, video e una strategia coerente.",
            },
            {
              title: "Torni spesso a guardare questi progetti social. Ti piace quello che vedi?",
              description: "Parliamone: possiamo fare qualcosa di simile per i tuoi canali.",
              ctaLabel: "Parliamone",
            },
            {
              title: "Continui a tornare su questi progetti. Forse è il momento di iniziare il tuo.",
              description: "Scrivici oggi: vediamo insieme come far crescere i tuoi social.",
              ctaLabel: "Scrivici ora",
            },
          ],
        }}
      />
    </>
  );
}
