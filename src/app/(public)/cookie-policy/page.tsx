import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Informativa sui cookie utilizzati dal sito di Omnia Marketing.",
};

export default function CookiePolicyPage() {
  return (
    <article className="px-6 md:px-12 pt-40 pb-32 max-w-3xl mx-auto">
      <h1 className="font-display font-black text-white text-4xl md:text-6xl mb-4">
        Cookie Policy
      </h1>
      <p className="text-sm text-[#666666] mb-16">Ultimo aggiornamento: agosto 2026</p>

      <div className="flex flex-col gap-10 text-[#cccccc] leading-relaxed">
        <section>
          <h2 className="font-display text-2xl text-white mb-3">Cosa sono i cookie</h2>
          <p>
            I cookie sono piccoli file di testo che i siti visitati inviano al
            dispositivo dell&apos;utente, dove vengono memorizzati per essere
            poi ritrasmessi agli stessi siti alla visita successiva.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Cookie tecnici necessari</h2>
          <p>
            Il sito utilizza esclusivamente cookie tecnici, necessari al
            corretto funzionamento delle pagine e non richiedono consenso
            preventivo. Non vengono utilizzati cookie di profilazione o di
            terze parti a fini pubblicitari.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Font e risorse esterne</h2>
          <p>
            Per la visualizzazione dei caratteri tipografici del sito
            vengono caricate risorse da Google Fonts e Fontshare. Questi
            servizi possono ricevere l&apos;indirizzo IP del dispositivo al
            solo scopo tecnico di erogare i font richiesti.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Come gestire i cookie</h2>
          <p>
            È possibile gestire o disabilitare i cookie direttamente dalle
            impostazioni del proprio browser. La disabilitazione dei cookie
            tecnici potrebbe compromettere il corretto funzionamento del
            sito.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Titolare del trattamento</h2>
          <p>
            Omniaweb S.r.l.s, P.IVA 09553001216 —{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#ff6b50]">
              info@omniamarketing.it
            </a>
          </p>
        </section>
      </div>
    </article>
  );
}
