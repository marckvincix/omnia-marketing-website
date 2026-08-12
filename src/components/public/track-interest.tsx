"use client";

import { useEffect } from "react";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";

export function TrackInterest({ slugs }: { slugs: string[] }) {
  const { recordView } = useVisitorTracking();
  const key = slugs.join(",");

  useEffect(() => {
    key.split(",").filter(Boolean).forEach((slug) => recordView(slug));
  }, [key, recordView]);

  return null;
}
