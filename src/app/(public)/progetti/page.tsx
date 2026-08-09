import type { Metadata } from "next";
import { ScrollWordReveal } from "@/components/public/scroll-word-reveal";
import { CtaBand } from "@/components/public/cta-band";
import { StackedProjects } from "@/components/public/stacked-projects";
import { getPublishedProjects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "I progetti realizzati da Omnia Marketing: siti web, e-commerce, branding e social per aziende che vogliono distinguersi.",
};

export default async function ProgettiPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <ScrollWordReveal text="Ogni progetto nasce da un ascolto attento e si costruisce insieme al cliente, dal primo brief al risultato finale." />
      <StackedProjects projects={projects} />
      <CtaBand
        title="Il prossimo progetto potrebbe essere il tuo."
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
      />
    </>
  );
}
