import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferences } from "@/components/public/cookie-preferences";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sulla privacy di Omnia Marketing ai sensi del Regolamento (UE) 2016/679 (GDPR) e del Codice Privacy italiano.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="px-6 md:px-12 pt-20 pb-32 max-w-3xl mx-auto">
      <h1 className="font-display font-black text-white text-4xl md:text-6xl mb-4">
        Privacy Policy
      </h1>
      <p className="text-sm text-[#666666] mb-16">Ultimo aggiornamento: 12 agosto 2026</p>

      <div className="flex flex-col gap-10 text-[#cccccc] leading-relaxed">
        <section>
          <p>
            Questa informativa descrive come Omniaweb S.r.l.s tratta i dati personali degli
            utenti del sito omniamarketing.it, ai sensi degli articoli 13 e 14 del
            Regolamento (UE) 2016/679 (&quot;GDPR&quot;) e del D.Lgs. 196/2003 come
            modificato dal D.Lgs. 101/2018 (&quot;Codice Privacy&quot;).
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">1. Titolare del trattamento</h2>
          <p>
            Il Titolare del trattamento dei dati è Omniaweb S.r.l.s, P.IVA 09553001216, con
            sede legale in Vico Bagnara, 4 — 80135 Napoli. Per qualsiasi richiesta relativa
            al trattamento dei dati personali è possibile scrivere a{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#2e9bd6]">
              info@omniamarketing.it
            </a>
            . Data la dimensione dell&apos;organizzazione, non è prevista la nomina
            obbligatoria di un Responsabile della Protezione dei Dati (DPO) ai sensi
            dell&apos;art. 37 GDPR; le funzioni relative sono svolte direttamente dal
            Titolare.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">2. Quali dati raccogliamo</h2>
          <p className="mb-3">A seconda di come interagisci con il sito, possiamo raccogliere:</p>
          <ul className="list-disc list-inside flex flex-col gap-2">
            <li>
              <strong className="text-white">Dati di contatto</strong> — nome, email,
              telefono (facoltativo) e il contenuto del messaggio, quando compili il modulo
              contatti o il popup di richiesta informazioni.
            </li>
            <li>
              <strong className="text-white">Dati di iscrizione alla newsletter</strong> —
              indirizzo email, quando ti iscrivi volontariamente per ricevere aggiornamenti
              dal nostro blog.
            </li>
            <li>
              <strong className="text-white">Dati fiscali</strong> — indirizzo, CAP, città e
              codice fiscale, solo se necessari all&apos;emissione di documenti contabili
              per un rapporto contrattuale in corso.
            </li>
            <li>
              <strong className="text-white">Dati anonimi di personalizzazione</strong> — un
              identificativo generato casualmente, il nome che indichi facoltativamente e le
              categorie di contenuti che visiti, salvati solo sul tuo dispositivo e mai
              trasmessi ai nostri server. Dettagli completi nella{" "}
              <Link href="/cookie-policy" className="text-white underline hover:text-[#2e9bd6]">
                Cookie Policy
              </Link>
              .
            </li>
            <li>
              <strong className="text-white">Dati tecnici di navigazione</strong> — indirizzo
              IP, tipo di browser e dispositivo, pagine visitate, raccolti automaticamente
              dall&apos;infrastruttura di hosting per finalità di sicurezza e corretto
              funzionamento del servizio, e conservati nei log di sistema per un periodo
              limitato.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            3. Finalità e basi giuridiche del trattamento
          </h2>
          <div className="mt-2 overflow-x-auto rounded-xl border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-left text-xs uppercase text-[#888888]">
                  <th className="px-4 py-3 font-medium">Finalità</th>
                  <th className="px-4 py-3 font-medium">Base giuridica</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top">
                    Rispondere a richieste di contatto o preventivo
                  </td>
                  <td className="px-4 py-3 align-top">
                    Misure precontrattuali su tua richiesta (art. 6.1.b GDPR)
                  </td>
                </tr>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top">Erogare un servizio già commissionato</td>
                  <td className="px-4 py-3 align-top">Esecuzione del contratto (art. 6.1.b GDPR)</td>
                </tr>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top">Adempimenti contabili e fiscali</td>
                  <td className="px-4 py-3 align-top">Obbligo legale (art. 6.1.c GDPR)</td>
                </tr>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top">Invio della newsletter</td>
                  <td className="px-4 py-3 align-top">Consenso (art. 6.1.a GDPR), revocabile in ogni momento</td>
                </tr>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top">Personalizzazione anonima dei contenuti</td>
                  <td className="px-4 py-3 align-top">Consenso (art. 6.1.a GDPR), revocabile in ogni momento</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top">
                    Sicurezza tecnica, prevenzione di abusi, log di sistema
                  </td>
                  <td className="px-4 py-3 align-top">Legittimo interesse del Titolare (art. 6.1.f GDPR)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            4. Destinatari e responsabili esterni del trattamento
          </h2>
          <p className="mb-3">
            I tuoi dati possono essere trattati, per nostro conto e in qualità di
            responsabili del trattamento ai sensi dell&apos;art. 28 GDPR, dai seguenti
            fornitori:
          </p>
          <ul className="list-disc list-inside flex flex-col gap-2">
            <li>
              <strong className="text-white">Supabase Inc.</strong> — hosting del database e
              dello storage dei file (immagini/video del portfolio). Fornisce un Data
              Processing Addendum conforme al GDPR.
            </li>
            <li>
              <strong className="text-white">Resend</strong> — invio delle email
              transazionali e della newsletter. È certificato secondo il{" "}
              <strong className="text-white">Data Privacy Framework UE-USA</strong>, il
              meccanismo di trasferimento riconosciuto adeguato dalla Commissione Europea
              con decisione del 10 luglio 2023.
            </li>
            <li>
              <strong className="text-white">Fornitore di hosting dell&apos;applicazione</strong>{" "}
              — esecuzione tecnica del sito e dei relativi log di sicurezza.
            </li>
          </ul>
          <p className="mt-3">
            Non vendiamo né cediamo i tuoi dati personali a terzi per finalità di marketing
            di soggetti diversi da noi.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            5. Trasferimento dei dati extra-UE
          </h2>
          <p>
            Alcuni dei fornitori indicati al punto 4 hanno sede o infrastrutture negli Stati
            Uniti. In questi casi, il trasferimento dei dati avviene sulla base di garanzie
            adeguate ai sensi del Capo V del GDPR: la partecipazione del fornitore al Data
            Privacy Framework UE-USA, oppure, in mancanza, l&apos;adozione delle Clausole
            Contrattuali Standard approvate dalla Commissione Europea con decisione di
            esecuzione (UE) 2021/914.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">6. Periodo di conservazione</h2>
          <ul className="list-disc list-inside flex flex-col gap-2">
            <li>Richieste di contatto: fino a 24 mesi dall&apos;ultimo contatto, salvo diverso obbligo di legge.</li>
            <li>Iscrizione alla newsletter: fino alla tua disiscrizione, sempre disponibile con un click in ogni email.</li>
            <li>Dati contabili e fiscali: 10 anni, come previsto dalla normativa civilistica e fiscale.</li>
            <li>Dati anonimi di personalizzazione: restano solo sul tuo dispositivo, mai sui nostri server; li cancelli in autonomia in qualsiasi momento (vedi punto 9).</li>
            <li>Log tecnici di sistema: di norma non oltre 6 mesi, salvo comprovate esigenze di sicurezza o accertamento di reati.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">7. Sicurezza dei dati</h2>
          <p>
            Adottiamo misure tecniche e organizzative adeguate a proteggere i dati da
            accesso non autorizzato, perdita o divulgazione: connessioni cifrate HTTPS,
            infrastrutture di hosting professionali, accesso all&apos;area amministrativa
            protetto da autenticazione e limitato al personale autorizzato.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">8. Minori</h2>
          <p>
            Il sito non è rivolto a minori di 16 anni e non raccogliamo consapevolmente
            dati relativi a minori. Se ritieni che un minore ci abbia fornito dati
            personali, contattaci per la loro rimozione.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">9. Gestisci le tue preferenze</h2>
          <p className="mb-4">
            Per la personalizzazione anonima dei contenuti (basata sul consenso), puoi
            attivarla o disattivarla in qualsiasi momento direttamente da qui:
          </p>
          <CookiePreferences />
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">10. I tuoi diritti</h2>
          <p>In qualsiasi momento, e senza necessità di motivazione, hai il diritto di:</p>
          <ul className="mt-3 list-disc list-inside flex flex-col gap-1">
            <li>accedere ai tuoi dati personali (art. 15 GDPR);</li>
            <li>richiederne la rettifica o l&apos;aggiornamento (art. 16 GDPR);</li>
            <li>richiederne la cancellazione (art. 17 GDPR);</li>
            <li>richiederne la limitazione del trattamento (art. 18 GDPR);</li>
            <li>opporti al trattamento (art. 21 GDPR);</li>
            <li>richiedere la portabilità dei dati (art. 20 GDPR);</li>
            <li>revocare il consenso precedentemente prestato, senza pregiudicare la liceità del trattamento svolto prima della revoca (art. 7.3 GDPR).</li>
          </ul>
          <p className="mt-3">
            Per esercitare questi diritti è sufficiente scrivere a{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#2e9bd6]">
              info@omniamarketing.it
            </a>
            . Risponderemo entro 30 giorni, come previsto dall&apos;art. 12 GDPR.
          </p>
          <p className="mt-3">
            Se ritieni che il trattamento dei tuoi dati violi la normativa applicabile, hai
            diritto di proporre reclamo all&apos;autorità di controllo competente: il
            Garante per la protezione dei dati personali — Piazza Venezia, 11, 00187 Roma,
            PEC{" "}
            <a href="mailto:protocollo@pec.gpdp.it" className="text-white underline hover:text-[#2e9bd6]">
              protocollo@pec.gpdp.it
            </a>
            , sito{" "}
            <a
              href="https://www.garanteprivacy.it"
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-[#2e9bd6]"
            >
              www.garanteprivacy.it
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            11. Modifiche a questa informativa
          </h2>
          <p>
            Questa informativa può essere aggiornata nel tempo, ad esempio in caso di
            modifiche normative o di nuovi servizi offerti dal sito. La data di ultimo
            aggiornamento è indicata in cima alla pagina.
          </p>
        </section>
      </div>
    </article>
  );
}
