"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCK_ITEMS, DOCK_CTA_ICON, CLIENTS_AREA_ICON, CLIENTS_AREA_URL } from "@/lib/nav";
import { LightBeamButton } from "./light-beam-button";

export function FloatingDock() {
  const pathname = usePathname();
  const CtaIcon = DOCK_CTA_ICON;
  const ClientsIcon = CLIENTS_AREA_ICON;

  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed bottom-3 left-1/2 z-[110] flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-0.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0a0a]/90 px-1.5 py-1.5 shadow-2xl backdrop-blur-md md:bottom-4 md:gap-1 md:px-2 md:py-2"
    >
      <div className="flex shrink-0 items-center gap-px pr-1 border-r border-white/10 md:gap-0.5 md:pr-2">
        {DOCK_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={`shrink-0 rounded-lg p-1.5 transition-all md:rounded-xl md:p-2.5 ${
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="size-4" aria-hidden="true" />
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}

        <a
          href={CLIENTS_AREA_URL}
          target="_blank"
          rel="noopener noreferrer"
          title="Area Clienti"
          className="shrink-0 rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white md:rounded-xl md:p-2.5"
        >
          <ClientsIcon className="size-4" aria-hidden="true" />
          <span className="sr-only">Area Clienti</span>
        </a>
      </div>

      <LightBeamButton href="/contatti" className="shrink-0 px-2.5 py-1.5 text-xs md:px-5 md:py-2 md:text-sm">
        <CtaIcon className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Contatti</span>
      </LightBeamButton>
    </nav>
  );
}
