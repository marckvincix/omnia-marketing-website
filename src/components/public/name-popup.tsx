"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useVisitorName } from "@/lib/visitor-name-context";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { recordVisitorName } from "@/lib/visitor-name/actions";
import { LightBeamButton } from "./light-beam-button";

export function NamePopup() {
  const pathname = usePathname();
  const { name, dismissed, hydrated, setName, dismiss } = useVisitorName();
  const {
    hydrated: trackingHydrated,
    consented,
    visitorId,
    topInterest,
    visitCount,
    tier,
    interestScore,
    contacted,
    trafficSource,
  } = useVisitorTracking();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    // Il nome viene chiesto (e salvato) solo se il visitatore ha già accettato la
    // personalizzazione nel banner cookie: se rifiuta, questo popup non compare mai.
    if (!hydrated || !trackingHydrated || name || dismissed || !consented) return;

    if (pathname === "/") {
      const handler = () => setOpen(true);
      window.addEventListener("omnia:intro-complete", handler);
      return () => window.removeEventListener("omnia:intro-complete", handler);
    }
    const timer = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(timer);
  }, [hydrated, trackingHydrated, name, dismissed, consented, pathname]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    setName(value);
    if (visitorId) {
      recordVisitorName(value, visitorId, {
        topInterest,
        visitCount,
        tier,
        interestScore,
        contacted,
        trafficSource,
      }).catch(() => {});
    }
    setOpen(false);
  }

  function handleDismiss() {
    dismiss();
    setOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="name-popup-title"
    >
      <div className="relative w-full max-w-md rounded-[2rem] border border-[#1f1f1f] bg-[#0a0a0a] p-8 md:p-10">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Chiudi"
          className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888888] transition-colors hover:border-white/40 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <h2 id="name-popup-title" className="font-display text-2xl md:text-3xl text-white pr-10">
          Come ti chiami?
        </h2>
        <p className="mt-2 text-sm text-[#999999]">
          Personalizziamo il sito con il tuo nome mentre lo esplori.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Marco"
            autoFocus
            className="w-full bg-transparent border-0 border-b border-[#333333] pb-3 text-lg text-white placeholder:text-[#555555] focus:outline-none focus:border-[#2e9bd6] transition-colors"
          />
          <LightBeamButton type="submit" className="w-full justify-center">
            Conferma
          </LightBeamButton>
        </form>
      </div>
    </div>
  );
}
