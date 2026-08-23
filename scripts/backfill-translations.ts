// Traduce nelle 7 lingue tutti i contenuti già esistenti nel database (creati prima
// dell'introduzione del sito multilingua). Da lanciare una sola volta dopo il deploy;
// i contenuti futuri si traducono da soli al salvataggio in admin.
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  translateAndSaveBlogPost,
  translateAndSaveProject,
  translateAndSaveService,
  translateAndSaveTestimonial,
  translateAndSaveFaq,
  translateAndSaveTeamMember,
  translateAndSaveSiteSettings,
} from "../src/lib/i18n/translate-and-save";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [posts, projects, services, testimonials, faqs, team] = await Promise.all([
    prisma.blogPost.findMany({ select: { id: true, title: true } }),
    prisma.project.findMany({ select: { id: true, title: true } }),
    prisma.service.findMany({ select: { id: true, title: true } }),
    prisma.testimonial.findMany({ select: { id: true, authorName: true } }),
    prisma.faq.findMany({ select: { id: true, question: true } }),
    prisma.teamMember.findMany({ select: { id: true, name: true } }),
  ]);

  console.log(
    `Trovati: ${posts.length} articoli, ${projects.length} progetti, ${services.length} servizi, ${testimonials.length} testimonianze, ${faqs.length} FAQ, ${team.length} team.`,
  );

  console.log("\n--- Impostazioni sito ---");
  await translateAndSaveSiteSettings();
  console.log("  fatto");

  console.log("\n--- Articoli blog ---");
  for (const p of posts) {
    console.log(`  ${p.title}`);
    await translateAndSaveBlogPost(p.id);
  }

  console.log("\n--- Progetti ---");
  for (const p of projects) {
    console.log(`  ${p.title}`);
    await translateAndSaveProject(p.id);
  }

  console.log("\n--- Servizi (+ benefit) ---");
  for (const s of services) {
    console.log(`  ${s.title}`);
    await translateAndSaveService(s.id);
  }

  console.log("\n--- Testimonianze ---");
  for (const t of testimonials) {
    console.log(`  ${t.authorName}`);
    await translateAndSaveTestimonial(t.id);
  }

  console.log("\n--- FAQ ---");
  for (const f of faqs) {
    console.log(`  ${f.question.slice(0, 60)}`);
    await translateAndSaveFaq(f.id);
  }

  console.log("\n--- Team ---");
  for (const m of team) {
    console.log(`  ${m.name}`);
    await translateAndSaveTeamMember(m.id);
  }

  console.log("\nCompletato.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
