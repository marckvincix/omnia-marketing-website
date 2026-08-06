import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnia Marketing — Agenzia web, branding e social a Napoli",
  description:
    "Omnia Marketing: crediamo nel design. Realizziamo siti web, e-commerce, branding e contenuti social per aziende che vogliono distinguersi. Agenzia web a Napoli e Pomigliano d'Arco.",
};

const SERVICE_AREAS = [
  {
    title: "Web",
    href: "/web",
    description:
      "Siti web, app mobile, e-commerce e piattaforme digitali con design minimalista e tecnologia all'avanguardia.",
  },
  {
    title: "Branding",
    href: "/branding",
    description:
      "Strategy, naming, logo design e UI/UX per un'identità visiva che emoziona e distingue il tuo brand.",
  },
  {
    title: "Social",
    href: "/social",
    description:
      "Social media management, fotografia, videografia e spot pubblicitari dal taglio cinematografico.",
  },
] as const;

const FEATURED_PROJECTS = [
  {
    slug: "giudice-pubblicita",
    client: "Giudice Pubblicità",
    category: "Sito Web · Branding · Social",
    description:
      "Leader nelle insegne di prestigio, autore dell'insegna più grande d'Europa sulla Torre Hadid di Milano.",
  },
  {
    slug: "nbgshop-it",
    client: "Nbgshop.it",
    category: "eCommerce · Branding",
    description:
      "eCommerce omnicanale per New Business Group: 5.000 clienti attivi e 20.000 articoli a catalogo.",
  },
  {
    slug: "newstanis",
    client: "Newstanis",
    category: "Sito Web · SEO",
    description:
      "Leader da oltre 100 anni nel settore serrature e casseforti: sito responsive su misura per ogni target.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-24 pt-20 md:pt-32">
        <h1 className="font-display text-6xl leading-[0.95] md:text-8xl">
          crediamo
          <br />
          nel design
        </h1>
        <p className="max-w-xl text-lg text-white/70">
          Creiamo siti web innovativi, piattaforme digitali, branding e
          contenuti social creativi per aziende che vogliono distinguersi.
        </p>
        <div>
          <Link
            href="/contatti"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
          >
            Contattaci
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-3xl md:text-4xl">Cosa facciamo</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICE_AREAS.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="group flex flex-col justify-between rounded-2xl border border-white/15 p-8 transition-colors hover:border-white/40"
              >
                <div>
                  <h3 className="font-display text-2xl">{area.title}</h3>
                  <p className="mt-3 text-sm text-white/70">
                    {area.description}
                  </p>
                </div>
                <span className="mt-6 text-sm font-semibold text-white/80 group-hover:text-white">
                  Scopri di più →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-3xl md:text-4xl">Progetti</h2>
            <Link
              href="/progetti"
              className="text-sm font-semibold text-white/70 hover:text-white"
            >
              Vedi tutti →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {FEATURED_PROJECTS.map((project) => (
              <Link
                key={project.slug}
                href={`/progetti/${project.slug}`}
                className="group flex flex-col rounded-2xl border border-white/15 p-8 transition-colors hover:border-white/40"
              >
                <span className="text-xs uppercase tracking-wide text-white/50">
                  {project.category}
                </span>
                <h3 className="mt-3 font-display text-xl">
                  {project.client}
                </h3>
                <p className="mt-3 text-sm text-white/70">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6">
          <h2 className="font-display text-3xl md:text-5xl">
            Hai un progetto in mente?
          </h2>
          <p className="max-w-lg text-white/70">
            Raccontaci la tua idea: la trasformiamo in un'esperienza digitale
            su misura.
          </p>
          <Link
            href="/contatti"
            className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
          >
            Contattaci
          </Link>
        </div>
      </section>
    </>
  );
}
