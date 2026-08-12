import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CLIENTS_AREA_URL } from "@/lib/nav";
import { LightBeamButton } from "./light-beam-button";
import { NewsletterForm } from "./newsletter-form";
import { SocialIcons } from "./social-icons";
import { BlogCardsGrid } from "./blog-cards-section";
import { getLatestBlogPosts } from "@/lib/data/blog";

const DEFAULT_PIVA = "09553001216";
const DEFAULT_COMPANY = "Omnia Marketing";

const SECTION_HEADING =
  "text-[13vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-white select-none font-display";

export async function SiteFooter() {
  const [settings, latestPosts] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getLatestBlogPosts(3),
  ]);
  const year = new Date().getFullYear();

  const piva = settings?.piva || DEFAULT_PIVA;
  const companyName = settings?.companyName || DEFAULT_COMPANY;

  return (
    <footer id="contatti" className="relative pt-40 pb-20 px-6 md:px-12 border-t border-[#1a1a1a] bg-[#000000]">
      <div className="max-w-7xl mx-auto">
        {latestPosts.length > 0 && (
          <div className="mb-24">
            <h2 className={`${SECTION_HEADING} mb-12`}>BLOG</h2>
            <BlogCardsGrid posts={latestPosts} />
            <LightBeamButton href="/blog" className="mt-8">
              Vedi tutto il blog →
            </LightBeamButton>
          </div>
        )}

        <div className="mb-24 pt-24 border-t border-[#111111]">
          <h2 className={`${SECTION_HEADING} mb-16`}>
            RESTA
            <br />
            AGGIORNATO
          </h2>
          <NewsletterForm />
        </div>

        <div className="pt-24 border-t border-[#111111] flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="flex-1">
            <h2 className={`${SECTION_HEADING} mb-12`}>
              PARLIAMO
              <br />
              NE.
            </h2>
            <div className="flex flex-col gap-6">
              <SocialIcons className="flex gap-3" />
            </div>
          </div>

          <div className="md:mb-6">
            <LightBeamButton href={CLIENTS_AREA_URL} target="_blank" rel="noopener noreferrer">
              Area Clienti
            </LightBeamButton>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-[#111111] flex flex-col md:flex-row justify-between text-[#444444] text-[10px] font-bold uppercase tracking-normal gap-4">
        <p>
          &copy; {year} {companyName} — Omniaweb S.r.l.s — P.IVA {piva}
        </p>
        <div className="flex gap-10">
          <Link href="/privacy-policy" className="hover:text-[#888888] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cookie-policy" className="hover:text-[#888888] transition-colors">
            Cookie Policy
          </Link>
          <Link href="/cookie-policy#preferenze" className="hover:text-[#888888] transition-colors">
            Preferenze cookie
          </Link>
        </div>
      </div>
    </footer>
  );
}
