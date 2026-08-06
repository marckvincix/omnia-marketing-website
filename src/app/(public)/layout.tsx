import { SiteNav } from "@/components/public/site-nav";
import { FloatingDock } from "@/components/public/floating-dock";
import { SiteFooter } from "@/components/public/site-footer";
import { OrganizationJsonLd } from "@/components/shared/json-ld";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#ebebeb] selection-coral overflow-x-hidden">
      <OrganizationJsonLd />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
      >
        Vai al contenuto principale
      </a>
      <SiteNav />
      <FloatingDock />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}
