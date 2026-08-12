"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { COOKIE_CONSENT_KEY, COOKIE_DECIDED_EVENT } from "@/lib/cookie-consent";

export function CookieBanner() {
  const { grantConsent } = useVisitorTracking();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Blocca lo scroll e l'interazione col resto del sito finché non si sceglie.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    grantConsent();
    setVisible(false);
    window.dispatchEvent(new Event(COOKIE_DECIDED_EVENT));
  }

  function reject() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setVisible(false);
    window.dispatchEvent(new Event(COOKIE_DECIDED_EVENT));
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="relative w-full max-w-md rounded-[2rem] border border-[#1f1f1f] bg-[#0a0a0a] p-8 md:p-10">
        <h2 id="cookie-banner-title" className="font-display text-2xl md:text-3xl text-white">
          Cookie e privacy
        </h2>
        <p className="mt-4 text-sm text-[#999999] leading-relaxed">
          Usiamo cookie tecnici necessari al funzionamento del sito e, solo
          se acconsenti, dati anonimi salvati sul tuo dispositivo per
          personalizzare i contenuti in base a ciò che visiti. Maggiori
          informazioni nella{" "}
          <Link href="/privacy-policy" className="underline hover:text-white">
            Privacy Policy
          </Link>{" "}
          e nella{" "}
          <Link href="/cookie-policy" className="underline hover:text-white">
            Cookie Policy
          </Link>
          .
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={accept}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            Accetta
          </button>
          <button
            type="button"
            onClick={reject}
            className="w-full rounded-full border border-[#2a2a2a] px-5 py-3 text-sm text-[#cccccc] transition-colors hover:border-white/40 hover:text-white"
          >
            Rifiuta
          </button>
        </div>
      </div>
    </div>
  );
}
