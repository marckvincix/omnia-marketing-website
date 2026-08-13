const SERVICE_INTROS: Record<string, string> = {
  Web: "grazie per l'interesse verso i nostri servizi di sviluppo web! Abbiamo ricevuto la tua richiesta e ci piacerebbe capire meglio il tuo progetto — obiettivi, funzionalità principali e tempistiche.",
  Branding: "grazie per l'interesse verso i nostri servizi di branding! Abbiamo ricevuto la tua richiesta e siamo curiosi di conoscere meglio il tuo brand e cosa vorresti comunicare.",
  Social: "grazie per l'interesse verso la gestione dei tuoi canali social! Abbiamo ricevuto la tua richiesta e vorremmo capire meglio i tuoi obiettivi e su quali piattaforme vorresti concentrarti.",
};

const GENERIC_INTRO =
  "grazie per averci contattato. Abbiamo ricevuto il tuo messaggio e siamo felici di parlare del tuo progetto.";

export function getReplySubject(): string {
  return "Re: la tua richiesta a Omnia Marketing";
}

export function getReplyTemplate(name: string, serviceName: string | null): string {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const intro = (serviceName && SERVICE_INTROS[serviceName]) || GENERIC_INTRO;

  return `Ciao ${firstName},

${intro}

Ti va bene fare una breve chiamata questa settimana per parlarne? Fammi sapere quando ti è più comodo.

A presto,
Il team di Omnia Marketing`;
}
