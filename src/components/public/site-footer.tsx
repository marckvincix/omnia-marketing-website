import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { CLIENTS_AREA_URL, FOOTER_NAV } from "@/lib/nav";
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
  const locale = await getLocale();
  const [settings, latestPosts, t, tNav] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    getLatestBlogPosts(3, locale),
    getTranslations("footer"),
    getTranslations("nav"),
  ]);
  const year = new Date().getFullYear();

  const piva = settings?.piva || DEFAULT_PIVA;
  const companyName = settings?.companyName || DEFAULT_COMPANY;

  return (
    <footer id="contatti" className="relative pt-40 pb-20 px-6 md:px-12 border-t border-[#1a1a1a] bg-[#000000]">
      <div className="max-w-7xl mx-auto">
        {latestPosts.length > 0 && (
          <div className="mb-24">
            <h2 className={`${SECTION_HEADING} mb-12`}>{t("blogHeading")}</h2>
            <BlogCardsGrid posts={latestPosts} />
            <LightBeamButton href="/blog" className="mt-8">
              {t("vediTuttoBlog")}
            </LightBeamButton>
          </div>
        )}

        <div className="mb-24 pt-24 border-t border-[#111111]">
          <h2 className={`${SECTION_HEADING} mb-16`}>
            {t("restaAggiornatoRiga1")}
            <br />
            {t("restaAggiornatoRiga2")}
          </h2>
          <NewsletterForm />
        </div>

        <div className="pt-24 border-t border-[#111111] flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
          <div className="flex-1">
            <h2 className={`${SECTION_HEADING} mb-12`}>
              {t("parliamoNeRiga1")}
              <br />
              {t("parliamoNeRiga2")}
            </h2>
            <div className="flex flex-col gap-6">
              <SocialIcons className="flex gap-3" />
            </div>
          </div>

          <div className="md:mb-6">
            <LightBeamButton href={CLIENTS_AREA_URL} target="_blank" rel="noopener noreferrer">
              {t("areaClienti")}
            </LightBeamButton>
          </div>
        </div>

        <div className="pt-16 border-t border-[#111111] grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <nav aria-label={t("naviga")}>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-normal text-[#555555]">{t("naviga")}</p>
            <ul className="flex flex-col gap-2">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-[#999999] hover:text-white transition-colors">
                    {tNav(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase tracking-normal text-[#555555]">{t("doveSiamo")}</p>
            <address className="not-italic text-[#999999] leading-relaxed">
              {t("sedeCitta")}
              <br />
              {t("sedeNota")}
            </address>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-10 border-t border-[#111111] flex flex-col md:flex-row justify-between text-[#444444] text-[10px] font-bold uppercase tracking-normal gap-4">
        <p>{t("copyright", { year, companyName, piva })}</p>
        <div className="flex gap-10">
          <Link href="/privacy-policy" className="hover:text-[#888888] transition-colors">
            {t("privacyPolicy")}
          </Link>
          <Link href="/cookie-policy" className="hover:text-[#888888] transition-colors">
            {t("cookiePolicy")}
          </Link>
          <Link href="/cookie-policy#preferenze" className="hover:text-[#888888] transition-colors">
            {t("preferenzeCookie")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
