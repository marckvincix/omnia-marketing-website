"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { COOKIE_CONSENT_KEY, COOKIE_DECIDED_EVENT } from "@/lib/cookie-consent";

export function CookieBanner() {
  const { grantConsent } = useVisitorTracking();
  const [visible, setVisible] = useState(false);
  const t = useTranslations("cookieBanner");
  const tFooter = useTranslations("footer");

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
          {t("titolo")}
        </h2>
        <p className="mt-4 text-sm text-[#999999] leading-relaxed">
          {t("testo")}{" "}
          {t("maggioriInfo")}{" "}
          <Link href="/privacy-policy" className="underline hover:text-white">
            {tFooter("privacyPolicy")}
          </Link>{" "}
          ·{" "}
          <Link href="/cookie-policy" className="underline hover:text-white">
            {tFooter("cookiePolicy")}
          </Link>
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={accept}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            {t("accetta")}
          </button>
          <button
            type="button"
            onClick={reject}
            className="w-full rounded-full border border-[#2a2a2a] px-5 py-3 text-sm text-[#cccccc] transition-colors hover:border-white/40 hover:text-white"
          >
            {t("rifiuta")}
          </button>
        </div>
      </div>
    </div>
  );
}
