"use client";

import { motion } from "framer-motion";

export function ValueProps() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-2 h-2 rounded-full bg-[#ff6b50] animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#666666] uppercase">
          Perché scegliere Omnia Marketing
        </span>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="font-display text-4xl md:text-7xl font-medium leading-[1.05] tracking-tight text-white max-w-5xl mb-24"
      >
        &ldquo;Il design non è solo come appare, ma{" "}
        <span className="text-[#666666]">come funziona.</span>&rdquo;
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-[#111111] rounded-[2.5rem] p-12 min-h-[480px] flex flex-col justify-between relative overflow-hidden group hover:bg-[#161616] transition-all duration-500"
        >
          <div className="absolute top-10 right-10 bg-[#1a1a1a] text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest text-[#888888] border border-[#333333]">
            Web · Branding · Social
          </div>

          <div className="mt-auto">
            <h3 className="font-display text-5xl md:text-6xl font-semibold tracking-tighter mb-2 text-white">
              Un partner.
            </h3>
            <h3 className="font-display text-5xl md:text-6xl font-semibold tracking-tighter text-[#444444] group-hover:text-[#666666] transition-colors">
              Non tre fornitori.
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-br from-[#4a3a35] to-[#1a1210] rounded-[2.5rem] p-8 md:p-12 min-h-[480px] flex items-center justify-center relative overflow-hidden group"
        >
          <div className="w-full max-w-md bg-[#111111] rounded-xl shadow-2xl overflow-hidden transform group-hover:scale-105 transition-transform duration-700 ease-out border border-[#2a2a2a]">
            <div className="bg-[#1a1a1a] px-4 py-3 border-b border-[#2a2a2a] flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b50]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffb020]/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]/60" />
              <div className="ml-4 h-3 flex-1 max-w-40 bg-[#0a0a0a] rounded-full text-[9px] text-[#666666] flex items-center px-2">
                pubblicitagiudice.it
              </div>
            </div>
            <div className="aspect-video bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
              <div className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#666666]">
                Case study
              </div>
              <div className="font-display text-2xl text-white">
                Giudice Pubblicità
              </div>
              <p className="mt-2 text-xs text-[#888888]">
                L&apos;insegna più grande d&apos;Europa, sulla Torre Hadid di Milano.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
