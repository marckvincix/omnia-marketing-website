"use client";

import Link from "next/link";
import { useState } from "react";
import { MAIN_NAV, CLIENTS_AREA_URL } from "@/lib/nav";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur supports-[backdrop-filter]:bg-black/70">
      <nav
        aria-label="Navigazione principale"
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      >
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-white"
        >
          Omnia Marketing
        </Link>

        <ul className="hidden items-center gap-6 text-sm font-medium text-white md:flex">
          {MAIN_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="transition-colors hover:text-white/60"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href={CLIENTS_AREA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black"
          >
            Area Clienti
          </a>
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex h-5 w-6 flex-col justify-between">
            <span
              className={`h-0.5 w-full bg-white transition-transform ${open ? "translate-y-[9px] rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-full bg-white transition-transform ${open ? "-translate-y-[9px] -rotate-45" : ""}`}
            />
          </div>
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-white/10 bg-black px-6 pb-6 md:hidden"
        >
          <ul className="flex flex-col gap-4 pt-4 text-white">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={CLIENTS_AREA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block rounded-full border border-white px-4 py-2 text-sm font-semibold"
              >
                Area Clienti
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
