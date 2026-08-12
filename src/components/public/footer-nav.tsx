"use client";

import Link from "next/link";
import { FOOTER_NAV } from "@/lib/nav";
import { useVisitorTracking } from "@/lib/visitor-tracking-context";
import { INTEREST_CLICK_WEIGHT } from "@/lib/use-interest-tracking";

const SERVICE_SLUGS = new Set(["web", "branding", "social"]);

export function FooterNav() {
  const { recordView } = useVisitorTracking();

  return (
    <nav aria-label="Link footer" className="max-w-7xl mx-auto mt-16 flex flex-wrap gap-x-8 gap-y-3 text-sm text-[#888888]">
      {FOOTER_NAV.map((item) => {
        const slug = item.href.replace(/^\//, "");
        const isServiceLink = SERVICE_SLUGS.has(slug);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={isServiceLink ? () => recordView(slug, INTEREST_CLICK_WEIGHT) : undefined}
            className="hover:text-white transition-colors"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
