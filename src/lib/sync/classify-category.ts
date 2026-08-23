// Omnia Hub non fornisce una categoria per gli articoli che scrive: questo classificatore
// deduce la categoria (stessa tassonomia web/branding/social usata per gli interessi dei
// visitatori anonimi) dalle parole chiave del titolo+estratto+corpo, per poter attribuire
// i click sulla newsletter a un interesse anche senza input manuale dell'admin.
// Se Hub inizia a fornire una categoria propria in futuro, va preferita a questo fallback.

const KEYWORDS: Record<"web" | "branding" | "social", string[]> = {
  web: [
    "sito web",
    "siti web",
    "sito internet",
    "e-commerce",
    "ecommerce",
    "seo",
    "posizionamento",
    "google ads",
    "sea",
    "sem",
    "ppc",
    "landing page",
    "wordpress",
    "shopify",
    "sviluppo web",
    "app",
    "ux",
    "ui",
    "conversion rate",
    "cro",
    "google analytics",
    "funnel",
    "responsive",
    "performance del sito",
  ],
  branding: [
    "brand",
    "branding",
    "logo",
    "identità visiva",
    "identita visiva",
    "naming",
    "rebranding",
    "packaging",
    "tone of voice",
    "brand identity",
    "marchio",
    "comunicazione visiva",
    "payoff",
    "font aziendale",
    "palette colori",
  ],
  social: [
    "social media",
    "instagram",
    "facebook",
    "tiktok",
    "linkedin",
    "meta ads",
    "influencer",
    "content creator",
    "community management",
    "reel",
    "storie instagram",
    "post social",
    "engagement",
    "hashtag",
    "social media marketing",
  ],
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Confini di parola (\b), non semplice substring: "app" da solo non deve scattare dentro
// "whatsapp", né "sem" dentro "sempre" o "ui" dentro "quindi" — tutti casi reali osservati
// classificando gli articoli esistenti con un semplice .includes().
const KEYWORD_PATTERNS: Record<"web" | "branding" | "social", RegExp[]> = Object.fromEntries(
  Object.entries(KEYWORDS).map(([category, keywords]) => [
    category,
    keywords.map((keyword) => new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i")),
  ]),
) as Record<"web" | "branding" | "social", RegExp[]>;

export function classifyCategory(text: string): "web" | "branding" | "social" | null {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  let bestCategory: "web" | "branding" | "social" | null = null;
  let bestScore = 0;

  for (const [category, patterns] of Object.entries(KEYWORD_PATTERNS) as [
    "web" | "branding" | "social",
    RegExp[],
  ][]) {
    const score = patterns.reduce(
      (sum, pattern) => (pattern.test(normalized) ? sum + 1 : sum),
      0,
    );
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}
