import type { Metadata } from "next";
import { LightBeamButton } from "@/components/public/light-beam-button";
import { TrackContact } from "@/components/public/track-contact";

export const metadata: Metadata = {
  title: "Grazie",
  description: "Grazie per averci contattato, ti risponderemo il prima possibile.",
  robots: { index: false, follow: true },
};

export default function GraziePage() {
  return (
    <section className="px-6 md:px-12 pt-24 pb-32 max-w-4xl mx-auto text-center">
      <TrackContact />
      <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[0.95]">
        Grazie.
      </h1>
      <p className="mt-6 text-lg text-[#999999] max-w-xl mx-auto">
        La tua richiesta è stata ricevuta: il nostro team la valuterà e ti
        risponderà il prima possibile.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <LightBeamButton href="/progetti">Guarda i nostri progetti</LightBeamButton>
        <LightBeamButton href="/">Torna alla home</LightBeamButton>
      </div>
    </section>
  );
}
