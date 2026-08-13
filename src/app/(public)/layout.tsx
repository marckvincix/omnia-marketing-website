import { FloatingDock } from "@/components/public/floating-dock";
import { SiteFooter } from "@/components/public/site-footer";
import { NamePopup } from "@/components/public/name-popup";
import { CookieBanner } from "@/components/public/cookie-banner";
import { GoogleAnalytics } from "@/components/public/google-analytics";
import { ScrollTriggerRouteCleanup } from "@/components/public/scroll-trigger-route-cleanup";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/shared/json-ld";
import { VisitorNameProvider } from "@/lib/visitor-name-context";
import { VisitorTrackingProvider } from "@/lib/visitor-tracking-context";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <VisitorNameProvider>
      <VisitorTrackingProvider>
        <div className="min-h-screen bg-[#000000] text-[#ebebeb] selection-coral overflow-x-clip">
          <OrganizationJsonLd />
          <WebSiteJsonLd />
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
          <CookieBanner />
          <GoogleAnalytics />
          <ScrollTriggerRouteCleanup />
        </div>
      </VisitorTrackingProvider>
    </VisitorNameProvider>
  );
}
