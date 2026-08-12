"use client";

import { useEffect } from "react";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";

export function TrackContact() {
  const { markContacted } = useVisitorTracking();

  useEffect(() => {
    markContacted();
  }, [markContacted]);

  return null;
}
