"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface HeroClient {
  initials: string;
  name: string;
}

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  recentClients?: HeroClient[];
}

export function Hero({
  title = "crediamo\nnel design",
  subtitle = "Siti web, branding e social per aziende che vogliono distinguersi.",
  ctaLabel = "Contattaci →",
  ctaUrl = "/contatti",
  recentClients = [],
}: HeroProps) {
  const lines = title.split("\n");

  return (
    <header className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#050505_70%)] opacity-70" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 px-6 text-center"
      >
        <h1 className="font-display font-black text-white text-[13vw] md:text-[9vw] leading-[0.9] tracking-[-0.03em]">
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className="mt-6 text-base md:text-lg text-[#999999] max-w-xl mx-auto">{subtitle}</p>
      </motion.div>

      <div className="absolute bottom-6 left-6 right-6 flex flex-col items-start gap-4 md:bottom-12 md:left-12 md:right-12 md:flex-row md:items-end md:justify-between">
        {recentClients.length > 0 && (
          <div className="flex items-center gap-5">
            <div className="flex -space-x-4 shrink-0">
              {recentClients.map((client) => (
                <div
                  key={client.name}
                  title={client.name}
                  className="w-10 h-10 rounded-full border-2 border-[#050505] bg-[#1a1a1a] flex items-center justify-center text-[11px] font-bold text-white"
                >
                  {client.initials}
                </div>
              ))}
            </div>
            <Link
              href="/progetti"
              className="text-xs md:text-sm font-medium leading-tight text-[#888888] hover:text-white transition-colors"
            >
              Progetti realizzati
              <br />
              per i nostri clienti.
            </Link>
          </div>
        )}

        <Link
          href={ctaUrl}
          className="text-white font-medium hover:text-[#ff6b50] transition-colors border-b-2 border-white hover:border-[#ff6b50] pb-1"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
