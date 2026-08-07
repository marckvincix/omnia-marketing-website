import Link from "next/link";
import { DOCK_ITEMS } from "@/lib/nav";
import { Mail } from "lucide-react";
import { LightBeamButton } from "./light-beam-button";

export function FloatingDock() {
  const items = DOCK_ITEMS.filter((item) => item.label !== "Contatti");

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] hidden md:flex items-center gap-2 p-2 rounded-2xl shadow-2xl border border-white/10 bg-[#111111]/80 backdrop-blur-md">
      <div className="flex items-center gap-1 pr-4 border-r border-[#333333]">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className="p-3 hover:bg-[#222222] rounded-xl transition-all text-white"
          >
            <item.icon className="size-5" aria-hidden="true" />
            <span className="sr-only">{item.label}</span>
          </Link>
        ))}
      </div>
      <LightBeamButton href="/contatti" className="px-6 py-3 text-sm font-bold tracking-wide uppercase">
        <Mail className="size-4" aria-hidden="true" />
        Contatti
      </LightBeamButton>
    </div>
  );
}
