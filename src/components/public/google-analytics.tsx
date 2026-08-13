"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { COOKIE_CONSENT_KEY, COOKIE_DECIDED_EVENT } from "@/lib/cookie-consent";

const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const read = () => setConsented(localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted");
    read();
    window.addEventListener(COOKIE_DECIDED_EVENT, read);
    return () => window.removeEventListener(COOKIE_DECIDED_EVENT, read);
  }, []);

  useEffect(() => {
    if (!MEASUREMENT_ID) return;
    // Interruttore ufficiale di Google per fermare l'invio di dati senza dover
    // rimuovere lo script: necessario se l'utente accetta e poi revoca il consenso
    // nella stessa sessione, senza ricaricare la pagina.
    (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = !consented;
  }, [consented]);

  if (!MEASUREMENT_ID || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
