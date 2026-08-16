"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { syncVisitorProfile } from "@/lib/visitor-name/actions";

const STORAGE_KEY = "omnia_visitor_profile";

interface VisitorProfile {
  visitorId: string;
  firstSeenDate: string;
  lastSeenDate: string;
  visitCount: number;
  interestViews: Record<string, number>;
  contacted: boolean;
}

interface VisitorTrackingContextValue {
  hydrated: boolean;
  consented: boolean;
  visitorId: string | null;
  isReturning: boolean;
  topInterest: string | null;
  /** 0 = prima visita di ritorno, sale con i giorni per rendere i messaggi via via più diretti. */
  tier: number;
  contacted: boolean;
  visitCount: number;
  /** Somma di tutte le interazioni tracciate su qualunque categoria: misura di engagement grezza. */
  interestScore: number;
  /** peso facoltativo: 1 = visita pagina (default), usato anche per hover/click con peso maggiore. */
  recordView: (slug: string, weight?: number) => void;
  grantConsent: () => void;
  /** Cancella il profilo salvato sul dispositivo e interrompe ogni tracciamento futuro. */
  revokeConsent: () => void;
  markContacted: () => void;
}

/** Soglie di visitCount per ogni livello di escalation (indice = tier). */
const TIER_THRESHOLDS = [2, 4, 7];

function tierFor(visitCount: number): number {
  let tier = 0;
  for (let i = 0; i < TIER_THRESHOLDS.length; i++) {
    if (visitCount >= TIER_THRESHOLDS[i]) tier = i;
  }
  return tier;
}

const VisitorTrackingContext = createContext<VisitorTrackingContextValue | null>(null);

function todayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readProfile(): VisitorProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VisitorProfile;
  } catch {
    return null;
  }
}

function writeProfile(profile: VisitorProfile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function topInterestOf(profile: VisitorProfile | null): string | null {
  if (!profile) return null;
  let best: string | null = null;
  let bestCount = 0;
  for (const [slug, count] of Object.entries(profile.interestViews)) {
    if (count > bestCount) {
      best = slug;
      bestCount = count;
    }
  }
  return best;
}

function interestScoreOf(profile: VisitorProfile | null): number {
  if (!profile) return 0;
  return Object.values(profile.interestViews).reduce((sum, n) => sum + n, 0);
}

function syncProfile(profile: VisitorProfile) {
  syncVisitorProfile(profile.visitorId, {
    topInterest: topInterestOf(profile),
    visitCount: profile.visitCount,
    tier: tierFor(profile.visitCount),
    interestScore: interestScoreOf(profile),
    contacted: profile.contacted,
  }).catch(() => {});
}

export function VisitorTrackingProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<VisitorProfile | null>(null);
  const [consented, setConsented] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Nessuna scrittura su localStorage finché il consenso non è confermato nel popup:
    // qui leggiamo solo lo stato esistente, senza crearne uno nuovo.
    const existing = readProfile();
    if (existing) {
      setProfile(existing);
      setConsented(true);
    }
    setHydrated(true);
  }, []);

  const grantConsent = useCallback(() => {
    setConsented(true);
    setProfile((prev) => {
      if (prev) return prev;
      const today = todayLocal();
      const created: VisitorProfile = {
        visitorId: crypto.randomUUID(),
        firstSeenDate: today,
        lastSeenDate: today,
        visitCount: 1,
        interestViews: {},
        contacted: false,
      };
      writeProfile(created);
      return created;
    });
  }, []);

  useEffect(() => {
    if (!consented || !profile) return;
    const today = todayLocal();
    if (profile.lastSeenDate !== today) {
      const updated: VisitorProfile = {
        ...profile,
        lastSeenDate: today,
        visitCount: profile.visitCount + 1,
      };
      writeProfile(updated);
      setProfile(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consented]);

  const recordView = useCallback(
    (slug: string, weight: number = 1) => {
      if (!consented) return;
      setProfile((prev) => {
        if (!prev) return prev;
        const updated: VisitorProfile = {
          ...prev,
          interestViews: {
            ...prev.interestViews,
            [slug]: (prev.interestViews[slug] ?? 0) + weight,
          },
        };
        writeProfile(updated);
        // Fire-and-forget: aggiorna i segnali del punteggio lead in admin, se questo
        // visitatore ha già lasciato il nome (altrimenti l'azione è un no-op silenzioso).
        syncProfile(updated);
        return updated;
      });
    },
    [consented],
  );

  const revokeConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
    setConsented(false);
  }, []);

  const markContacted = useCallback(() => {
    setProfile((prev) => {
      if (!prev || prev.contacted) return prev;
      const updated: VisitorProfile = { ...prev, contacted: true };
      writeProfile(updated);
      // Il contatto è il segnale più forte per il punteggio lead: sincronizzalo subito,
      // non aspettare la prossima recordView.
      syncProfile(updated);
      return updated;
    });
  }, []);

  const value: VisitorTrackingContextValue = {
    hydrated,
    consented,
    visitorId: profile?.visitorId ?? null,
    isReturning: (profile?.visitCount ?? 0) >= 2,
    topInterest: topInterestOf(profile),
    tier: tierFor(profile?.visitCount ?? 0),
    contacted: profile?.contacted ?? false,
    visitCount: profile?.visitCount ?? 1,
    interestScore: interestScoreOf(profile),
    recordView,
    grantConsent,
    revokeConsent,
    markContacted,
  };

  return (
    <VisitorTrackingContext.Provider value={value}>{children}</VisitorTrackingContext.Provider>
  );
}

export function useVisitorTracking() {
  const ctx = useContext(VisitorTrackingContext);
  if (!ctx) throw new Error("useVisitorTracking must be used within VisitorTrackingProvider");
  return ctx;
}
