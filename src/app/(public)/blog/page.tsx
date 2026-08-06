import type { Metadata } from "next";
import { PageHero } from "@/components/public/page-hero";
import { CtaBand } from "@/components/public/cta-band";

export const metadata: Metadata = {
  title: "Blog",
  description: "Approfondimenti su design, web, branding e social a cura di Omnia Marketing.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Presto i primi articoli."
        description="Stiamo preparando contenuti su design, web, branding e social. Torna a trovarci a breve."
      />
      <CtaBand
        title="Nel frattempo, parliamo del tuo progetto."
        description="Raccontaci la tua idea: la trasformiamo in un'esperienza digitale su misura."
      />
    </>
  );
}
