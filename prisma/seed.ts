import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { SERVICES_LIST } from "../src/lib/content/services";
import { PROJECTS } from "../src/lib/content/projects";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      heroTitle: "crediamo\nnel design",
      heroSubtitle: "Siti web, branding e social per aziende che vogliono distinguersi.",
      heroCtaLabel: "Contattaci",
      heroCtaUrl: "/contatti",
      companyName: "Omnia Marketing",
      piva: "09553001216",
      legalAddress: "Vico Bagnara, 4 — 80135 Napoli",
      operationalAddress: "Viale Alfa Romeo, 17 — 80038 Pomigliano d'Arco (NA)",
      contactEmail: "info@omniamarketing.it",
      footerText: "Crediamo nel design. Siti web, branding e social per aziende che vogliono distinguersi.",
    },
    update: {},
  });

  for (const service of SERVICES_LIST) {
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      create: {
        slug: service.slug,
        title: service.title,
        excerpt: service.eyebrow,
        description: service.intro,
        seoTitle: `${service.title} — ${service.eyebrow}`,
        seoDescription: service.intro,
      },
      update: {
        title: service.title,
        excerpt: service.eyebrow,
        description: service.intro,
      },
    });

    for (const [i, sub] of service.subservices.entries()) {
      const existing = await prisma.serviceBenefit.findFirst({
        where: { serviceId: created.id, title: sub.title },
      });
      if (existing) {
        await prisma.serviceBenefit.update({
          where: { id: existing.id },
          data: { description: sub.description, order: i },
        });
      } else {
        await prisma.serviceBenefit.create({
          data: {
            serviceId: created.id,
            title: sub.title,
            description: sub.description,
            order: i,
          },
        });
      }
    }
  }

  for (const [i, project] of PROJECTS.entries()) {
    const created = await prisma.project.upsert({
      where: { slug: project.slug },
      create: {
        slug: project.slug,
        title: project.client,
        client: project.client,
        category: project.category,
        description: project.description,
        externalUrl: project.externalUrl,
        resultsText: project.results.join(" · "),
        testimonialAuthor: project.client,
        testimonialQuote: project.testimonialQuote,
        order: i,
        seoTitle: `${project.client} — Case Study`,
        seoDescription: project.description,
      },
      update: {
        title: project.client,
        description: project.description,
        resultsText: project.results.join(" · "),
        testimonialQuote: project.testimonialQuote,
      },
    });

    for (const serviceSlug of project.serviceSlugs) {
      const service = await prisma.service.findUnique({ where: { slug: serviceSlug } });
      if (!service) continue;
      await prisma.projectService.upsert({
        where: { projectId_serviceId: { projectId: created.id, serviceId: service.id } },
        create: { projectId: created.id, serviceId: service.id },
        update: {},
      });
    }

    const existingTestimonial = await prisma.testimonial.findFirst({
      where: { projectId: created.id },
    });
    if (!existingTestimonial) {
      await prisma.testimonial.create({
        data: {
          authorName: project.client,
          quote: project.testimonialQuote,
          projectId: created.id,
          order: i,
        },
      });
    }
  }

  await prisma.legalPage.upsert({
    where: { slug: "privacy-policy" },
    create: {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: "Vedi src/app/(public)/privacy-policy/page.tsx per il contenuto attuale (in attesa di migrazione al CMS).",
    },
    update: {},
  });

  await prisma.legalPage.upsert({
    where: { slug: "cookie-policy" },
    create: {
      slug: "cookie-policy",
      title: "Cookie Policy",
      content: "Vedi src/app/(public)/cookie-policy/page.tsx per il contenuto attuale (in attesa di migrazione al CMS).",
    },
    update: {},
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "m.vincix@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      create: {
        email: adminEmail,
        name: "Marco",
        passwordHash,
        role: "ADMIN",
      },
      update: {},
    });
    console.log(`Admin utente pronto: ${adminEmail}`);
  } else {
    console.log("SEED_ADMIN_PASSWORD non impostata: utente admin non creato/aggiornato.");
  }

  console.log("Seed completato.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
