"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const RECENT_CLIENTS = [
  { initials: "GP", name: "Giudice Pubblicità" },
  { initials: "NB", name: "Nbgshop.it" },
  { initials: "NT", name: "Newstanis" },
];

export function Hero() {
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
          crediamo
          <br />
          nel design
        </h1>
        <p className="mt-6 text-base md:text-lg text-[#999999] max-w-xl mx-auto">
          Siti web, branding e social per aziende che vogliono distinguersi.
        </p>
      </motion.div>

      <div className="absolute bottom-12 left-8 md:left-12 flex items-center gap-5">
        <div className="flex -space-x-4">
          {RECENT_CLIENTS.map((client) => (
            <div
              key={client.initials}
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

      <div className="absolute bottom-12 right-8 md:right-12 text-right">
        <Link
          href="/contatti"
          className="text-white font-medium hover:text-[#ff6b50] transition-colors border-b-2 border-white hover:border-[#ff6b50] pb-1"
        >
          Contattaci →
        </Link>
      </div>
    </header>
  );
}
