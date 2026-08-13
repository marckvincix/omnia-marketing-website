import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const serviceBenefitSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Titolo obbligatorio"),
  description: z.string().trim().min(1, "Descrizione obbligatoria"),
});

export const serviceSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Titolo obbligatorio"),
  slug: z.string().trim().toLowerCase().regex(slugRegex, "Slug non valido (usa lettere minuscole e trattini)"),
  excerpt: z.string().trim().min(1, "Sottotitolo obbligatorio"),
  description: z.string().trim().min(1, "Descrizione obbligatoria"),
  ctaLabel: z.string().trim().min(1).default("Contattaci"),
  ctaUrl: z.string().trim().min(1).default("/contatti"),
  published: z.boolean().default(true),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  benefits: z.array(serviceBenefitSchema).default([]),
});
export type ServiceInput = z.infer<typeof serviceSchema>;

export const projectMediaSchema = z.object({
  id: z.string().optional(),
  url: z.string().trim().min(1, "URL obbligatorio"),
  alt: z.string().trim().min(1, "Testo alternativo obbligatorio"),
  type: z.enum(["IMAGE", "VIDEO"]).default("IMAGE"),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Titolo obbligatorio"),
  slug: z.string().trim().toLowerCase().regex(slugRegex, "Slug non valido"),
  client: z.string().trim().min(1, "Cliente obbligatorio"),
  category: z.array(z.string().trim().min(1)).min(1, "Seleziona almeno una categoria"),
  description: z.string().trim().min(1, "Descrizione obbligatoria"),
  processText: z.string().trim().optional().or(z.literal("")),
  coverImage: z.string().trim().optional().or(z.literal("")),
  year: z.coerce.number().int().optional().nullable(),
  externalUrl: z.string().trim().optional().or(z.literal("")),
  resultsText: z.string().trim().optional().or(z.literal("")),
  testimonialAuthor: z.string().trim().optional().or(z.literal("")),
  testimonialRole: z.string().trim().optional().or(z.literal("")),
  testimonialQuote: z.string().trim().optional().or(z.literal("")),
  published: z.boolean().default(true),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  geoTitle: z.string().trim().optional().or(z.literal("")),
  geoDescription: z.string().trim().optional().or(z.literal("")),
  serviceIds: z.array(z.string()).default([]),
  media: z.array(projectMediaSchema).default([]),
});
export type ProjectInput = z.infer<typeof projectSchema>;

export const testimonialSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().trim().min(1, "Nome obbligatorio"),
  authorRole: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  quote: z.string().trim().min(1, "Testimonianza obbligatoria"),
  projectId: z.string().optional().or(z.literal("")),
  published: z.boolean().default(true),
});
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const faqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(1, "Domanda obbligatoria"),
  answer: z.string().trim().min(1, "Risposta obbligatoria"),
  serviceId: z.string().optional().or(z.literal("")),
  published: z.boolean().default(true),
});
export type FaqInput = z.infer<typeof faqSchema>;

export const teamMemberSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Nome obbligatorio"),
  role: z.string().trim().min(1, "Ruolo obbligatorio"),
  bio: z.string().trim().optional().or(z.literal("")),
  photoUrl: z.string().trim().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().optional().or(z.literal("")),
  published: z.boolean().default(true),
});
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

export const siteSettingsSchema = z.object({
  heroTitle: z.string().trim().min(1, "Titolo hero obbligatorio"),
  heroSubtitle: z.string().trim().optional().or(z.literal("")),
  heroCtaLabel: z.string().trim().optional().or(z.literal("")),
  heroCtaUrl: z.string().trim().optional().or(z.literal("")),
  companyName: z.string().trim().min(1, "Ragione sociale obbligatoria"),
  piva: z.string().trim().min(1, "P.IVA obbligatoria"),
  legalAddress: z.string().trim().min(1, "Sede legale obbligatoria"),
  operationalAddress: z.string().trim().min(1, "Sede operativa obbligatoria"),
  contactEmail: z.string().trim().email("Email non valida"),
  contactPhone: z.string().trim().optional().or(z.literal("")),
  footerText: z.string().trim().optional().or(z.literal("")),
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Titolo obbligatorio"),
  slug: z.string().trim().toLowerCase().regex(slugRegex, "Slug non valido"),
  excerpt: z.string().trim().min(1, "Estratto obbligatorio"),
  content: z.string().trim().min(1, "Contenuto obbligatorio"),
  coverImage: z.string().trim().optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()).default([]),
  published: z.boolean().default(false),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
});
export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const blogTaxonomySchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Nome obbligatorio"),
  slug: z.string().trim().toLowerCase().regex(slugRegex, "Slug non valido"),
});
export type BlogTaxonomyInput = z.infer<typeof blogTaxonomySchema>;
