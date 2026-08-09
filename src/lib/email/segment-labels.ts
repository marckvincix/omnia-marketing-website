export type SegmentKey = "all" | "openers" | "clickers" | "never_opened" | "bounced";

export const SEGMENTS: { key: SegmentKey; label: string; description: string }[] = [
  { key: "all", label: "Tutti gli iscritti", description: "L'intera mailing list attiva." },
  { key: "openers", label: "Ha aperto almeno un'email", description: "Iscritti più coinvolti." },
  { key: "clickers", label: "Ha cliccato un link", description: "Iscritti che interagiscono di più." },
  { key: "never_opened", label: "Non ha mai aperto", description: "Ha ricevuto email ma non le ha mai aperte." },
  { key: "bounced", label: "Email rimbalzate", description: "Consegna fallita: da verificare o rimuovere." },
];
