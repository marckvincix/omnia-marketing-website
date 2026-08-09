import { FloatingDock } from "@/components/public/floating-dock";
import { SiteFooter } from "@/components/public/site-footer";
import { NamePopup } from "@/components/public/name-popup";
import { OrganizationJsonLd } from "@/components/shared/json-ld";
import { VisitorNameProvider } from "@/lib/visitor-name-context";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <VisitorNameProvider>
      <div className="min-h-screen bg-[#000000] text-[#ebebeb] selection-coral overflow-x-clip">
        <OrganizationJsonLd />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          Vai al contenuto principale
        </a>
        <FloatingDock />
        <main id="main-content" className="pb-24">{children}</main>
        <SiteFooter />
        <NamePopup />
      </div>
    </VisitorNameProvider>
  );
}
