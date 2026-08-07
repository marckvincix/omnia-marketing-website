"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from "lucide-react";
import { TOP_NAV, SERVICES_NAV, CLIENTS_AREA_URL } from "@/lib/nav";
import { LightBeamButton } from "./light-beam-button";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex items-center justify-between text-sm font-medium tracking-tight"
    >
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center group" aria-label="Omnia Marketing, torna alla home">
          <span className="w-9 h-9 bg-white rounded flex items-center justify-center text-black font-display font-black text-lg transition-transform group-hover:rotate-12">
            O.
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[#888888]">
          {TOP_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-white transition-colors outline-none">
              Servizi
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-[#111111] border-[#2a2a2a] text-white">
              {SERVICES_NAV.map((service) => (
                <DropdownMenuItem
                  key={service.href}
                  render={<Link href={service.href} />}
                  className="flex flex-col items-start gap-0.5 py-2 focus:bg-[#1a1a1a] focus:text-white"
                >
                  <span className="font-semibold">{service.label}</span>
                  <span className="text-xs text-[#888888]">{service.description}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-4">
        <a
          href={CLIENTS_AREA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#888888] hover:text-white transition-colors"
        >
          Area Clienti
        </a>
        <LightBeamButton href="/contatti" className="px-5 py-2.5 text-sm">
          Contattaci
        </LightBeamButton>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Chiudi menu" : "Apri menu"}
        className="md:hidden text-white p-2"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute top-full left-0 right-0 mt-2 mx-4 rounded-2xl border border-[#2a2a2a] bg-[#111111]/95 backdrop-blur-md p-6 md:hidden"
        >
          <ul className="flex flex-col gap-4 text-white">
            {[...TOP_NAV, ...SERVICES_NAV].map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block text-base">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <LightBeamButton href="/contatti" onClick={() => setOpen(false)} className="mt-2 w-full">
                Contattaci
              </LightBeamButton>
            </li>
            <li>
              <a href={CLIENTS_AREA_URL} target="_blank" rel="noopener noreferrer" className="text-[#888888]">
                Area Clienti
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
