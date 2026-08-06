export type ServiceSlug = "web" | "branding" | "social";

export interface ServiceSub {
  title: string;
  description: string;
}

export interface ServicePage {
  slug: ServiceSlug;
  title: string;
  eyebrow: string;
  intro: string;
  subservices: ServiceSub[];
  relatedProjectSlugs: string[];
}

export const SERVICES: Record<ServiceSlug, ServicePage> = {
  web: {
    slug: "web",
    title: "Web",
    eyebrow: "Siti, app, e-commerce",
    intro:
      "Design minimalista e soluzioni tecnologiche all'avanguardia per esperienze digitali indimenticabili.",
    subservices: [
      {
        title: "Siti Web",
        description:
          "Design minimalista e soluzioni tecnologiche all'avanguardia per esperienze digitali indimenticabili.",
      },
      {
        title: "App Mobile",
        description:
          "Applicazioni intuitive e performanti per una connessione immediata con i tuoi utenti.",
      },
      {
        title: "eCommerce",
        description:
          "Piattaforme digitali su misura per vendere online e far crescere il tuo business.",
      },
      {
        title: "Piattaforme Web",
        description:
          "Tecnologie innovative abbinate a un design essenziale, per prodotti digitali complessi.",
      },
    ],
    relatedProjectSlugs: ["newstanis", "nbgshop-it"],
  },
  branding: {
    slug: "branding",
    title: "Branding",
    eyebrow: "Strategy, naming, logo, UI/UX",
    intro:
      "Diamo forma alla tua identità visiva con un design studiato per emozionare e distinguerti.",
    subservices: [
      {
        title: "Strategy",
        description:
          "Progettiamo strategie che riflettono la tua visione con un design coerente e distintivo.",
      },
      {
        title: "Naming",
        description:
          "Sviluppiamo il nome perfetto per il tuo brand, unendo creatività e strategia.",
      },
      {
        title: "Logo Design",
        description:
          "Linee essenziali e design iconici per un logo che definisce la tua presenza.",
      },
      {
        title: "UI/UX Design",
        description:
          "Interfacce progettate per un'esperienza utente fluida, elegante e funzionale.",
      },
    ],
    relatedProjectSlugs: ["giudice-pubblicita", "nbgshop-it"],
  },
  social: {
    slug: "social",
    title: "Social",
    eyebrow: "SMM, foto, video, spot",
    intro:
      "Strategie visive curate per trasformare ogni contenuto in un'esperienza di design.",
    subservices: [
      {
        title: "Social Media Management",
        description:
          "Strategie visive curate per trasformare ogni contenuto in un'esperienza di design.",
      },
      {
        title: "Fotografia",
        description:
          "Scatti che raccontano il tuo brand con un'estetica raffinata e un'attenzione estrema ai dettagli.",
      },
      {
        title: "Videografia",
        description:
          "Produzioni video dal taglio cinematografico per comunicazioni visive memorabili.",
      },
      {
        title: "Spot per i Social",
        description:
          "Ideazione e realizzazione di spot con un design narrativo coinvolgente e un'estetica impeccabile.",
      },
    ],
    relatedProjectSlugs: ["giudice-pubblicita", "newstanis"],
  },
};

export const SERVICES_LIST = Object.values(SERVICES);
