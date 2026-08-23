import type { Metadata } from "next";
import { Inter, Geist_Mono, Archivo_Black, Space_Mono, Montserrat, Alfa_Slab_One } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../../globals.css";
import { routing } from "@/i18n/routing";
import { isRtl, OG_LOCALE, type Locale } from "@/lib/i18n/locales";
import { FloatingDock } from "@/components/public/floating-dock";
import { SiteFooter } from "@/components/public/site-footer";
import { NamePopup } from "@/components/public/name-popup";
import { CookieBanner } from "@/components/public/cookie-banner";
import { GoogleAnalytics } from "@/components/public/google-analytics";
import { ScrollTriggerRouteCleanup } from "@/components/public/scroll-trigger-route-cleanup";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/shared/json-ld";
import { VisitorNameProvider } from "@/lib/visitor-name-context";
import { VisitorTrackingProvider } from "@/lib/visitor-tracking-context";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const alfaSlabOne = Alfa_Slab_One({
  variable: "--font-alfa-slab",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const DEFAULT_TITLE = "Omnia Marketing — Agenzia Web, Branding e Social a Napoli";
const DEFAULT_DESCRIPTION =
  "Omnia Marketing è un'agenzia di web design, branding e social media management con sede a Napoli. Realizziamo siti web, e-commerce, identità di brand e gestiamo i canali social per aziende in tutta Italia da molti anni.";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: DEFAULT_TITLE,
      template: "%s | Omnia Marketing",
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale as Locale] ?? OG_LOCALE.it,
      siteName: "Omnia Marketing",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

// Radice HTML separata dall'area admin ((admin)/layout.tsx): il sito pubblico è
// multilingua tramite next-intl (pattern "multiple root layouts" di Next.js), quindi
// qui vive tutto ciò che dipende dalla lingua (lang/dir, catalogo messaggi) più i
// provider già esistenti per nome visitatore/tracciamento interessi e il dock/footer.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${inter.variable} ${geistMono.variable} ${archivoBlack.variable} ${spaceMono.variable} ${montserrat.variable} ${alfaSlabOne.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
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
                <main id="main-content" className="pb-24">
                  {children}
                </main>
                <SiteFooter />
                <NamePopup />
                <CookieBanner />
                <GoogleAnalytics />
                <ScrollTriggerRouteCleanup />
              </div>
            </VisitorTrackingProvider>
          </VisitorNameProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
