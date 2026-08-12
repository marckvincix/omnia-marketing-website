"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVisitorTracking } from "./visitor-tracking-context";

export const INTEREST_CLICK_WEIGHT = 3;
export const INTEREST_HOVER_WEIGHT = 1;
const HOVER_DWELL_MS = 1500;

/**
 * Segnali di interesse più forti della semplice visita di pagina: un click su una
 * card/link pesa come un'intenzione esplicita, un hover prolungato (>1.5s) come
 * un'attenzione passiva. Da collegare a onClick/onMouseEnter/onMouseLeave di una card.
 */
export function useInterestTracking(slugs: string[]) {
  const { recordView } = useVisitorTracking();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const onMouseEnter = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      slugs.forEach((slug) => recordView(slug, INTEREST_HOVER_WEIGHT));
    }, HOVER_DWELL_MS);
  }, [slugs, recordView, clearTimer]);

  const onMouseLeave = useCallback(() => {
    clearTimer();
  }, [clearTimer]);

  const onClick = useCallback(() => {
    clearTimer();
    slugs.forEach((slug) => recordView(slug, INTEREST_CLICK_WEIGHT));
  }, [slugs, recordView, clearTimer]);

  return { onClick, onMouseEnter, onMouseLeave };
}
