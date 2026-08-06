import type { Metadata } from "next";
import { Hero } from "@/components/public/hero";
import { ValueProps } from "@/components/public/value-props";
import { WorkGallery } from "@/components/public/work-gallery";

export const metadata: Metadata = {
  title: "Omnia Marketing — Agenzia web, branding e social a Napoli",
  description:
    "Omnia Marketing: crediamo nel design. Realizziamo siti web, e-commerce, branding e contenuti social per aziende che vogliono distinguersi. Agenzia web a Napoli e Pomigliano d'Arco.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <WorkGallery />
    </>
  );
}
