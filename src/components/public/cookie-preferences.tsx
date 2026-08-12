"use client";

import { useState } from "react";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { useVisitorName } from "@/lib/visitor-name-context";
import { COOKIE_CONSENT_KEY, COOKIE_DECIDED_EVENT } from "@/lib/cookie-consent";

export function CookiePreferences() {
  const { hydrated, consented, grantConsent, revokeConsent } = useVisitorTracking();
  const { clearName, dismiss } = useVisitorName();
  const [feedback, setFeedback] = useState<"accepted" | "rejected" | null>(null);

  function handleAccept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    grantConsent();
    window.dispatchEvent(new Event(COOKIE_DECIDED_EVENT));
    setFeedback("accepted");
  }

  function handleReject() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    revokeConsent();
    clearName();
    dismiss();
    window.dispatchEvent(new Event(COOKIE_DECIDED_EVENT));
    setFeedback("rejected");
  }

  return (
    <div
      id="preferenze"
      className="scroll-mt-24 rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] p-6 md:p-8"
    >
      <h3 className="font-display text-xl text-white mb-2">Gestisci le tue preferenze</h3>

      {!hydrated ? (
        <p className="text-sm text-[#666666]">Caricamento…</p>
      ) : (
        <>
          <p className="text-sm text-[#999999] leading-relaxed">
            Stato attuale:{" "}
            <span className="text-white font-medium">
              {consented ? "personalizzazione attiva" : "personalizzazione disattivata"}
            </span>
            . {consented
              ? "Il tuo dispositivo memorizza un identificativo anonimo e le pagine che visiti, per adattare i testi del sito a ciò che ti interessa."
              : "Non viene salvato né utilizzato alcun dato per personalizzare i contenuti che vedi."}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAccept}
              disabled={consented}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Attiva personalizzazione
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={!consented}
              className="rounded-full border border-[#2a2a2a] px-5 py-3 text-sm text-[#cccccc] transition-colors hover:border-white/40 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Disattiva e cancella i dati salvati
            </button>
          </div>

          {feedback && (
            <p className="mt-4 text-xs text-[#2e9bd6]">
              {feedback === "accepted"
                ? "Personalizzazione attivata."
                : "Preferenza salvata: i dati sono stati cancellati dal tuo dispositivo."}
            </p>
          )}
        </>
      )}
    </div>
  );
}
