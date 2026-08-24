"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check } from "lucide-react";
import * as Flags from "country-flag-icons/react/3x2";
import { DOCK_ITEMS, DOCK_CTA_ICON, CLIENTS_AREA_ICON, CLIENTS_AREA_URL } from "@/lib/nav";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { INTEREST_CLICK_WEIGHT } from "@/lib/use-interest-tracking";
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/locales";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LightBeamButton } from "./light-beam-button";

const SERVICE_SLUGS = new Set(["web", "branding", "social"]);

function FlagIcon({ locale, className }: { locale: Locale; className?: string }) {
  const Flag = Flags[LOCALE_META[locale].flagCountry as keyof typeof Flags];
  return (
    <span className={`inline-block shrink-0 overflow-hidden rounded-[3px] ${className ?? ""}`}>
      <Flag title={LOCALE_META[locale].label} className="block h-full w-full" />
    </span>
  );
}

function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        title={t("lingua")}
        className="shrink-0 rounded-xl p-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white md:rounded-xl md:p-2.5"
      >
        <FlagIcon locale={locale} className="h-4 w-6 md:h-3.5 md:w-5" />
        <span className="sr-only">{t("lingua")}</span>
      </DialogTrigger>
      <DialogContent
        className="z-[120] max-h-[85vh] overflow-y-auto sm:max-w-xs"
        overlayClassName="z-[120]"
      >
        <DialogHeader>
          <DialogTitle>{t("lingua")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          {LOCALES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setOpen(false);
                router.replace(pathname, { locale: l });
              }}
              className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-accent ${
                l === locale ? "bg-accent" : ""
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FlagIcon locale={l} className="h-4 w-6" />
                {LOCALE_META[l].label}
              </span>
              {l === locale && <Check className="size-4" aria-hidden="true" />}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FloatingDock() {
  const pathname = usePathname();
  const { recordView } = useVisitorTracking();
  const t = useTranslations("nav");
  const CtaIcon = DOCK_CTA_ICON;
  const ClientsIcon = CLIENTS_AREA_ICON;

  return (
    <nav
      aria-label={t("navigazionePrincipale")}
      className="fixed bottom-3 left-1/2 z-[110] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0a0a]/90 px-2 py-2 shadow-2xl backdrop-blur-md md:bottom-4 md:gap-1 md:px-2 md:py-2"
    >
      <div className="flex shrink-0 items-center gap-1 pr-1.5 border-r border-white/10 md:gap-0.5 md:pr-2">
        {DOCK_ITEMS.map((item) => {
          const active = pathname === item.href;
          const serviceSlug = item.href.replace(/^\//, "");
          const isServiceLink = SERVICE_SLUGS.has(serviceSlug);
          const label = t(item.labelKey);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={label}
              aria-current={active ? "page" : undefined}
              onClick={isServiceLink ? () => recordView(serviceSlug, INTEREST_CLICK_WEIGHT) : undefined}
              className={`shrink-0 rounded-xl p-2.5 transition-all md:rounded-xl md:p-2.5 ${
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="size-5 md:size-4" aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}

        <a
          href={CLIENTS_AREA_URL}
          target="_blank"
          rel="noopener noreferrer"
          title={t("areaClienti")}
          className="hidden shrink-0 rounded-xl p-2.5 text-white/70 transition-all hover:bg-white/10 hover:text-white md:inline-flex md:rounded-xl md:p-2.5"
        >
          <ClientsIcon className="size-5 md:size-4" aria-hidden="true" />
          <span className="sr-only">{t("areaClienti")}</span>
        </a>

        <LanguageSwitcher />
      </div>

      <LightBeamButton href="/contatti" className="shrink-0 px-3.5 py-2.5 text-sm md:px-5 md:py-2 md:text-sm">
        <CtaIcon className="size-5 md:size-4" aria-hidden="true" />
        <span className="hidden sm:inline">{t("contatti")}</span>
      </LightBeamButton>
    </nav>
  );
}
