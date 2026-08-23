import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { LightBeamButton } from "@/components/public/light-beam-button";

export const metadata: Metadata = {
  title: "Disiscriviti",
  robots: { index: false, follow: false },
};

export default async function DisiscrivitiPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const { email, token } = await searchParams;

  let success = false;

  if (email && token) {
    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (subscriber && subscriber.unsubscribeToken === token) {
      await prisma.newsletterSubscriber.update({
        where: { id: subscriber.id },
        data: { unsubscribedAt: new Date() },
      });
      success = true;
    }
  }

  return (
    <section className="px-6 md:px-12 pt-24 pb-32 max-w-4xl mx-auto text-center">
      <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[0.95]">
        {success ? "Disiscrizione completata." : "Link non valido."}
      </h1>
      <p className="mt-6 text-lg text-[#999999] max-w-xl mx-auto">
        {success
          ? "Non riceverai più le email di aggiornamento della newsletter. Puoi iscriverti di nuovo in qualsiasi momento dal sito."
          : "Il link di disiscrizione non è valido o è già stato utilizzato."}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <LightBeamButton href="/">Torna alla home</LightBeamButton>
      </div>
    </section>
  );
}
