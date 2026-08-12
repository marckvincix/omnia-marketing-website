import type { Metadata } from "next";
import Link from "next/link";
import { CookiePreferences } from "@/components/public/cookie-preferences";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Informativa estesa sui cookie e sulle tecnologie di tracciamento utilizzate dal sito di Omnia Marketing, ai sensi del Regolamento (UE) 2016/679 e delle Linee guida del Garante Privacy.",
};

export default function CookiePolicyPage() {
  return (
    <article className="px-6 md:px-12 pt-20 pb-32 max-w-3xl mx-auto">
      <h1 className="font-display font-black text-white text-4xl md:text-6xl mb-4">
        Cookie Policy
      </h1>
      <p className="text-sm text-[#666666] mb-16">Ultimo aggiornamento: 12 agosto 2026</p>

      <div className="flex flex-col gap-10 text-[#cccccc] leading-relaxed">
        <section>
          <h2 className="font-display text-2xl text-white mb-3">1. Cosa sono i cookie e le tecnologie simili</h2>
          <p>
            I cookie sono piccoli file di testo che i siti visitati inviano al browser
            dell&apos;utente, dove vengono memorizzati per essere poi ritrasmessi agli stessi
            siti alla visita successiva. Esistono inoltre altre tecnologie con funzione
            analoga — come il <strong className="text-white">localStorage</strong> del
            browser — che non sono tecnicamente cookie ma che, se usate per riconoscere un
            utente nel tempo, sono equiparate ai cookie ai fini della normativa applicabile
            (art. 122 del Codice Privacy italiano, che recepisce la Direttiva ePrivacy
            2002/58/CE, e le Linee guida cookie e altri strumenti di tracciamento del
            Garante per la protezione dei dati personali del 10 giugno 2021). In questa
            pagina, quando parliamo di &quot;cookie&quot;, intendiamo entrambe le categorie.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">2. Titolare del trattamento</h2>
          <p>
            Omniaweb S.r.l.s, P.IVA 09553001216, con sede legale in Vico Bagnara, 4 — 80135
            Napoli e sede operativa in Viale Alfa Romeo, 17 — 80038 Pomigliano d&apos;Arco
            (NA) —{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#2e9bd6]">
              info@omniamarketing.it
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            3. Cosa NON facciamo
          </h2>
          <p>
            Prima di entrare nel dettaglio, una premessa chiara: questo sito{" "}
            <strong className="text-white">non utilizza cookie di profilazione</strong>,{" "}
            <strong className="text-white">non utilizza cookie pubblicitari o di terze parti</strong>{" "}
            e <strong className="text-white">non utilizza strumenti di analytics</strong>{" "}
            (come Google Analytics o simili). Non c&apos;è nessun cookie wall: puoi navigare
            e usare tutte le funzionalità principali del sito anche rifiutando ogni
            tracciamento facoltativo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            4. Cookie tecnici necessari (nessun consenso richiesto)
          </h2>
          <p>
            Questi cookie sono indispensabili al funzionamento del sito o all&apos;erogazione
            di un servizio esplicitamente richiesto e non richiedono consenso preventivo
            (art. 122, comma 1, Codice Privacy).
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-left text-xs uppercase text-[#888888]">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Finalità</th>
                  <th className="px-4 py-3 font-medium">Durata</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top text-white">omnia_cookie_consent</td>
                  <td className="px-4 py-3 align-top">
                    Salva su localStorage la scelta espressa nel banner cookie (accettato /
                    rifiutato), per non richiederla di nuovo ad ogni visita.
                  </td>
                  <td className="px-4 py-3 align-top">Fino a cancellazione manuale</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-white">Sessione area riservata</td>
                  <td className="px-4 py-3 align-top">
                    Cookie di autenticazione impostato solo per lo staff che accede
                    all&apos;area amministrativa (<code className="text-xs">/admin</code>).
                    Non riguarda i visitatori del sito pubblico.
                  </td>
                  <td className="px-4 py-3 align-top">Durata della sessione</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            5. Personalizzazione anonima (richiede consenso)
          </h2>
          <p>
            Se accetti nel banner iniziale, il sito salva sul tuo dispositivo — mai su un
            server — le seguenti informazioni tramite localStorage:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-[#1a1a1a]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a] text-left text-xs uppercase text-[#888888]">
                  <th className="px-4 py-3 font-medium">Nome</th>
                  <th className="px-4 py-3 font-medium">Contenuto</th>
                  <th className="px-4 py-3 font-medium">Finalità</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#1a1a1a]">
                  <td className="px-4 py-3 align-top text-white">omnia_visitor_profile</td>
                  <td className="px-4 py-3 align-top">
                    Un identificativo anonimo generato casualmente, il numero di giorni in
                    cui torni sul sito e le categorie di progetti/servizi che visiti o su
                    cui clicchi.
                  </td>
                  <td className="px-4 py-3 align-top">
                    Adattare i testi, l&apos;ordine dei contenuti mostrati e i pulsanti di
                    invito all&apos;azione a ciò che sembra interessarti di più.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 align-top text-white">omnia_visitor_name</td>
                  <td className="px-4 py-3 align-top">
                    Il nome che scegli di indicarci nel popup di benvenuto (facoltativo).
                  </td>
                  <td className="px-4 py-3 align-top">
                    Mostrare i testi del sito rivolgendoci a te per nome.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4">
            Queste informazioni non vengono mai trasmesse ai nostri server, non sono
            associate alla tua identità reale, non sono incrociate con altri dati e non
            sono condivise con terzi. Se rifiuti il consenso, o se non lo esprimi, nessuna
            di queste informazioni viene creata o salvata, e il sito mostra a tutti i
            visitatori gli stessi contenuti di default.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            6. Risorse esterne (font)
          </h2>
          <p>
            Per la visualizzazione dei caratteri tipografici del sito vengono caricate
            risorse dai servizi <strong className="text-white">Google Fonts</strong> e{" "}
            <strong className="text-white">Fontshare</strong>. Il caricamento di queste
            risorse comporta, per ragioni tecniche legate al funzionamento del protocollo
            HTTP, la trasmissione dell&apos;indirizzo IP del dispositivo ai rispettivi
            fornitori, senza che venga impostato alcun cookie di tracciamento a fini di
            profilazione.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            7. Base giuridica
          </h2>
          <p>
            I cookie tecnici necessari sono trattati sulla base della necessità di erogare
            il servizio richiesto (art. 122, comma 1, Codice Privacy — nessun consenso
            necessario). La personalizzazione anonima è trattata sulla base del{" "}
            <strong className="text-white">consenso libero, specifico e revocabile</strong>{" "}
            dell&apos;utente (art. 6, par. 1, lett. a, GDPR), espresso tramite il banner
            iniziale e modificabile in qualsiasi momento come descritto al punto 9.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            8. Come gestire i cookie dal browser
          </h2>
          <p>
            Oltre agli strumenti offerti da questo sito, puoi gestire o eliminare i cookie
            direttamente dalle impostazioni del tuo browser. La disabilitazione dei cookie
            tecnici potrebbe compromettere il corretto funzionamento del sito. Guide
            ufficiali:{" "}
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-[#2e9bd6]"
            >
              Chrome
            </a>
            ,{" "}
            <a
              href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie"
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-[#2e9bd6]"
            >
              Firefox
            </a>
            ,{" "}
            <a
              href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-[#2e9bd6]"
            >
              Safari
            </a>
            ,{" "}
            <a
              href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-[#2e9bd6]"
            >
              Edge
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            9. Gestisci e revoca il consenso
          </h2>
          <p className="mb-4">
            Puoi cambiare la tua scelta in qualsiasi momento, con la stessa facilità con cui
            l&apos;hai espressa la prima volta, usando i controlli qui sotto.
          </p>
          <CookiePreferences />
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            10. Modifiche a questa informativa
          </h2>
          <p>
            Questa Cookie Policy può essere aggiornata nel tempo, ad esempio in caso di
            modifiche normative o di nuove funzionalità del sito. La data di ultimo
            aggiornamento è indicata in cima alla pagina. In caso di modifiche sostanziali
            che introducano nuove finalità di trattamento, ti verrà richiesto un nuovo
            consenso.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-white mb-3">
            11. I tuoi diritti e reclamo al Garante
          </h2>
          <p>
            Per l&apos;elenco completo dei diritti riconosciuti dal GDPR e le modalità per
            esercitarli, consulta la nostra{" "}
            <Link href="/privacy-policy" className="text-white underline hover:text-[#2e9bd6]">
              Privacy Policy
            </Link>
            . Se ritieni che il trattamento violi la normativa, hai diritto di proporre
            reclamo al Garante per la protezione dei dati personali — Piazza Venezia, 11,
            00187 Roma, PEC{" "}
            <a
              href="mailto:protocollo@pec.gpdp.it"
              className="text-white underline hover:text-[#2e9bd6]"
            >
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
          <h2 className="font-display text-2xl text-white mb-3">12. Contatti</h2>
          <p>
            Per qualsiasi domanda su questa Cookie Policy scrivi a{" "}
            <a href="mailto:info@omniamarketing.it" className="text-white underline hover:text-[#2e9bd6]">
              info@omniamarketing.it
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
