"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * ScrollTrigger inserisce un "pin-spacer" come nuovo genitore dell'elemento pinnato
 * (ScrollWordReveal, ProjectTestimonial, CtaBand). Se una transizione di pagina di
 * Next.js prova ad aggiungere/rimuovere un nodo fratello mentre uno spacer è ancora
 * attivo, React lancia "Failed to execute removeChild/insertBefore on Node" perché
 * la struttura DOM reale non corrisponde più a quella che si aspetta. Killando ogni
 * ScrollTrigger attivo nell'istante del click su un link interno — prima che la
 * transizione parta — lo spacer viene smontato in tempo utile.
 */
export function ScrollTriggerRouteCleanup() {
  useEffect(() => {
    function killAllTriggers() {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    }

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const link = target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
        return;
      }
      killAllTriggers();
    }

    document.addEventListener("click", handleClick, true);
    window.addEventListener("popstate", killAllTriggers);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("popstate", killAllTriggers);
    };
  }, []);

  return null;
}
