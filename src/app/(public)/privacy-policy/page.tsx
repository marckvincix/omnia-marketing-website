import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sulla privacy di Omnia Marketing.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="px-6 md:px-12 pt-40 pb-32 max-w-3xl mx-auto">
      <h1 className="font-display font-black text-white text-4xl md:text-6xl mb-4">
        Privacy Policy
      </h1>
      <p className="text-sm text-[#666666] mb-16">Ultimo aggiornamento: agosto 2026</p>

      <div className="flex flex-col gap-10 text-[#cccccc] leading-relaxed">
        <section>
          <h2 className="font-display text-2xl text-white mb-3">Titolare del trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati è Omniaweb S.r.l.s, P.IVA
            09553001216, con sede legale in Vico Bagnara, 4 — 80135 Napoli e
            sede operativa in Viale Alfa Romeo, 17 — 80038 Pomigliano
            d&apos;Arco (NA). Per qualsiasi richiesta relativa al trattamento
            dei dati personali è possibile scrivere a{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#ff6b50]">
              info@omniamarketing.it
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Dati raccolti</h2>
          <p>
            In relazione all&apos;utilizzo del sito e dei servizi offerti,
            possiamo raccogliere: nome, cognome, indirizzo email, numero di
            telefono e, per l&apos;emissione di documenti contabili, dati
            fiscali come indirizzo, CAP, città e codice fiscale. Vengono
            inoltre raccolti automaticamente alcuni dati di navigazione
            (indirizzo IP, tipo di browser, pagine visitate) necessari al
            funzionamento tecnico del sito.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Finalità del trattamento</h2>
          <p>
            I dati raccolti vengono trattati per: fornire i servizi
            richiesti, rispondere a richieste di contatto o preventivo,
            adempiere a obblighi contabili e di legge, e — solo previo
            consenso esplicito — per finalità di marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Basi giuridiche</h2>
          <p>
            Il trattamento si fonda, a seconda dei casi, su: consenso
            dell&apos;interessato, esecuzione di un contratto o di misure
            precontrattuali, adempimento di un obbligo legale, oppure
            legittimo interesse del Titolare a rispondere a richieste
            spontaneamente inviate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">Conservazione dei dati</h2>
          <p>
            I dati sono conservati per il tempo necessario a soddisfare le
            finalità per cui sono stati raccolti e, in ogni caso, non oltre i
            termini previsti dalla normativa fiscale e civilistica
            applicabile.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">I tuoi diritti</h2>
          <p>In qualsiasi momento hai il diritto di:</p>
          <ul className="mt-3 list-disc list-inside flex flex-col gap-1">
            <li>accedere ai tuoi dati personali;</li>
            <li>richiederne la rettifica o l&apos;aggiornamento;</li>
            <li>richiederne la cancellazione;</li>
            <li>opporti al trattamento o richiederne la limitazione;</li>
            <li>richiedere la portabilità dei dati;</li>
            <li>revocare il consenso precedentemente prestato.</li>
          </ul>
          <p className="mt-3">
            Per esercitare questi diritti è sufficiente scrivere a{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#ff6b50]">
              info@omniamarketing.it
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
