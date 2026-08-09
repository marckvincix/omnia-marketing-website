import Link from "next/link";
import { MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FOOTER_NAV, CLIENTS_AREA_URL } from "@/lib/nav";
import { LightBeamButton } from "./light-beam-button";
import { NewsletterForm } from "./newsletter-form";
import { SocialIcons } from "./social-icons";

const DEFAULT_EMAIL = "info@omniamarketing.it";
const DEFAULT_ADDRESS = "Viale Alfa Romeo, 17 — 80038 Pomigliano d'Arco (NA)";
const DEFAULT_PIVA = "09553001216";
const DEFAULT_COMPANY = "Omnia Marketing";

export async function SiteFooter() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const year = new Date().getFullYear();

  const email = settings?.contactEmail || DEFAULT_EMAIL;
  const address = settings?.operationalAddress || DEFAULT_ADDRESS;
  const piva = settings?.piva || DEFAULT_PIVA;
  const companyName = settings?.companyName || DEFAULT_COMPANY;

  return (
    <footer id="contatti" className="relative pt-40 pb-20 px-6 md:px-12 border-t border-[#1a1a1a] bg-[#000000]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-16">
        <div className="flex-1">
          <h2 className="text-[13vw] md:text-[8vw] leading-[0.85] font-black tracking-tighter text-white mb-12 select-none font-display">
            PARLIAMO
            <br />
            NE.
          </h2>
          <div className="flex flex-col gap-6">
            <a
              href={`mailto:${email}`}
              className="text-2xl md:text-3xl font-semibold hover:text-[#2e9bd6] transition-colors w-fit"
            >
              {email}
            </a>
            <p className="text-[#666666] flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {address}
            </p>
          </div>
        </div>

        <div className="md:mb-6">
          <LightBeamButton href={CLIENTS_AREA_URL} target="_blank" rel="noopener noreferrer">
            Area Clienti
          </LightBeamButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-[#111111] flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-normal text-[#888888] mb-3">Newsletter</p>
          <NewsletterForm />
        </div>
        <SocialIcons className="flex gap-3" />
      </div>

      <nav aria-label="Link footer" className="max-w-7xl mx-auto mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#888888]">
        {FOOTER_NAV.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
            {item.label}
          </Link>
        ))}
      </nav>

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
        </div>
      </div>
    </footer>
  );
}
