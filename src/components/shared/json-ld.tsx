import { prisma } from "@/lib/prisma";
import { SOCIAL_LINKS } from "@/lib/social-links";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function OrganizationJsonLd() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#organization`,
    name: "Omnia Marketing",
    // "companyName" nel pannello admin è il nome commerciale mostrato in giro sul sito
    // (di norma "Omnia Marketing" stesso), non la ragione sociale legale: quella resta
    // fissa, non essendoci un campo dedicato in SiteSettings.
    legalName: "Omniaweb S.r.l.s",
    description:
      "Agenzia di web design, branding e social media management con sede a Pomigliano d'Arco (Napoli).",
    url: SITE_URL,
    logo: `${SITE_URL}/logo-omnia-email.png`,
    image: `${SITE_URL}/logo-omnia-email.png`,
    email: settings?.contactEmail || "info@omniamarketing.it",
    ...(settings?.contactPhone ? { telephone: settings.contactPhone } : {}),
    vatID: "09553001216",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Viale Alfa Romeo, 17",
      addressLocality: "Pomigliano d'Arco",
      postalCode: "80038",
      addressRegion: "NA",
      addressCountry: "IT",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.9169,
      longitude: 14.3833,
    },
    areaServed: [
      { "@type": "City", name: "Napoli" },
      { "@type": "AdministrativeArea", name: "Campania" },
      { "@type": "Country", name: "Italia" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: SOCIAL_LINKS.map((s) => s.href),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Omnia Marketing",
    url: SITE_URL,
    inLanguage: "it-IT",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE_URL}${url}`,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "City",
      name: "Napoli",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function CreativeWorkJsonLd({
  name,
  description,
  url,
  client,
}: {
  name: string;
  description: string;
  url: string;
  client: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: `${SITE_URL}${url}`,
    creator: {
      "@id": `${SITE_URL}/#organization`,
    },
    about: client,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    datePublished,
    dateModified,
    ...(image ? { image } : {}),
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ReviewJsonLd({
  author,
  quote,
}: {
  author: string;
  quote: string;
}) {
  // Niente reviewRating: nel database non esiste un voto numerico associato alle
  // testimonianze, e inventarne uno violerebbe le linee guida sui dati strutturati
  // di Google. Il markup resta comunque utile a GEO/LLM come testimonianza strutturata.
  const data = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Organization",
      name: author,
    },
    reviewBody: quote,
    itemReviewed: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
