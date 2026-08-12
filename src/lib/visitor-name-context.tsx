"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "omnia_visitor_name";
const DISMISSED_KEY = "omnia_visitor_name_dismissed";

interface VisitorNameContextValue {
  name: string | null;
  dismissed: boolean;
  hydrated: boolean;
  setName: (name: string) => void;
  dismiss: () => void;
  clearName: () => void;
}

const VisitorNameContext = createContext<VisitorNameContextValue | null>(null);

export function VisitorNameProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNameState(localStorage.getItem(STORAGE_KEY));
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
    setHydrated(true);
  }, []);

  const setName = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    localStorage.setItem(STORAGE_KEY, capitalized);
    setNameState(capitalized);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }, []);

  const clearName = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setNameState(null);
  }, []);

  return (
    <VisitorNameContext.Provider value={{ name, dismissed, hydrated, setName, dismiss, clearName }}>
      {children}
    </VisitorNameContext.Provider>
  );
}

export function useVisitorName() {
  const ctx = useContext(VisitorNameContext);
  if (!ctx) throw new Error("useVisitorName must be used within VisitorNameProvider");
  return ctx;
}
