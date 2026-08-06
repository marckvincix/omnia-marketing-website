import Link from "next/link";
import { MAIN_NAV, CLIENTS_AREA_URL } from "@/lib/nav";

type FooterProps = {
  companyName?: string;
  piva?: string;
};

export function Footer({
  companyName = "Omnia Marketing",
  piva = "09553001216",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-xl">{companyName}</p>
          <p className="mt-2 max-w-xs text-sm text-white/60">
            Crediamo nel design. Siti web, branding e social per aziende che
            vogliono distinguersi.
          </p>
        </div>

        <nav aria-label="Link footer" className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
          {MAIN_NAV.filter((i) => i.href !== "/").map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={CLIENTS_AREA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 transition-colors hover:text-white"
          >
            Area Clienti
          </a>
        </nav>

        <div className="flex flex-col gap-2 text-sm text-white/60">
          <Link href="/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/cookie-policy" className="hover:text-white">
            Cookie Policy
          </Link>
          <span>P.IVA {piva}</span>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/40">
        © {year} {companyName}. Tutti i diritti riservati.
      </div>
    </footer>
  );
}
