export interface Project {
  slug: string;
  client: string;
  category: string[];
  servicesRendered: string[];
  serviceSlugs: ("web" | "branding" | "social")[];
  description: string;
  context: string;
  results: string[];
  testimonialQuote: string;
  externalUrl: string;
  gradient: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "giudice-pubblicita",
    client: "Giudice Pubblicità",
    category: ["Sito Web", "Branding", "Social"],
    servicesRendered: ["Sito Web", "Social Media Management", "Fotografia", "Video", "Branding"],
    serviceSlugs: ["web", "social", "branding"],
    description:
      "Leader nelle insegne di prestigio, autore dell'insegna più grande d'Europa sulla Torre Hadid di Milano. Abbiamo potenziato la loro presenza digitale con un sito moderno e una strategia di branding coerente.",
    context: "Leader nelle insegne di prestigio",
    results: [
      "Identità brand forte e moderna, con design pulito e intuitivo",
      "Maggiore visibilità online",
      "Incremento dei contatti digitali",
      "Consolidamento come punto di riferimento nel settore",
    ],
    testimonialQuote:
      "Il nostro sito web ha acquisito un'identità forte e moderna. Il design è pulito, intuitivo e perfettamente allineato al brand.",
    externalUrl: "https://www.pubblicitagiudice.it/",
    gradient: "from-[#3a2a20] to-[#0a0a0a]",
  },
  {
    slug: "nbgshop-it",
    client: "Nbgshop.it",
    category: ["eCommerce", "Branding"],
    servicesRendered: ["eCommerce", "Logo Design", "Branding", "Social Media Management"],
    serviceSlugs: ["web", "branding", "social"],
    description:
      "eCommerce omnicanale per New Business Group, azienda leader nell'ingrosso: 3.000 referenze sincronizzate al gestionale di magazzino, per un'azienda ventennale con 5.000 clienti attivi e 20.000 articoli in catalogo.",
    context: "Azienda ventennale, leader nell'ingrosso",
    results: [
      "Rafforzamento della presenza digitale",
      "Miglioramento della visibilità online",
      "Incremento delle vendite",
      "Piattaforma omnicanale con 3.000 prodotti sincronizzati",
    ],
    testimonialQuote:
      "Il design è pulito, intuitivo e perfettamente in linea con il nostro brand. Ascoltano, propongono e realizzano progetti unici.",
    externalUrl: "https://www.nbgshop.it/",
    gradient: "from-[#20303a] to-[#0a0a0a]",
  },
  {
    slug: "newstanis",
    client: "Newstanis",
    category: ["Sito Web", "SEO"],
    servicesRendered: ["Sito Web", "SEO"],
    serviceSlugs: ["web"],
    description:
      "Leader da oltre 100 anni nel settore serrature e casseforti. Un sito responsive innovativo e raffinato, personalizzato per target diversi: leisure, business, hotel, honeymoon.",
    context: "Leader da 100+ anni in serrature e casseforti",
    results: [
      "Identità visiva forte e moderna",
      "Design intuitivo e responsive",
      "Esperienza utente ottimizzata",
      "Piattaforma personalizzata per le esigenze aziendali",
    ],
    testimonialQuote:
      "Un punto di riferimento per chi vuole distinguersi nel digitale.",
    externalUrl: "https://www.newstanis.it/",
    gradient: "from-[#2a2a20] to-[#0a0a0a]",
  },
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
