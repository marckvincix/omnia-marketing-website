import type { LucideIcon } from "lucide-react";
import { Code2, PenTool, Megaphone, LayoutGrid, Mail } from "lucide-react";

export const CLIENTS_AREA_URL = "https://hub.omniamarketing.it";

export const TOP_NAV = [
  { label: "Home", href: "/" },
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "Portfolio", href: "/progetti" },
] as const;

export const SERVICES_NAV = [
  { label: "Web", href: "/web", description: "Siti, app, e-commerce" },
  { label: "Branding", href: "/branding", description: "Strategy, naming, logo, UI/UX" },
  { label: "Social", href: "/social", description: "SMM, foto, video, spot" },
] as const;

export const FOOTER_NAV = [
  { label: "Home", href: "/" },
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "Web", href: "/web" },
  { label: "Branding", href: "/branding" },
  { label: "Social", href: "/social" },
  { label: "Portfolio", href: "/progetti" },
  { label: "Blog", href: "/blog" },
  { label: "Contatti", href: "/contatti" },
] as const;

export const DOCK_ITEMS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Web", href: "/web", icon: Code2 },
  { label: "Branding", href: "/branding", icon: PenTool },
  { label: "Social", href: "/social", icon: Megaphone },
  { label: "Portfolio", href: "/progetti", icon: LayoutGrid },
  { label: "Contatti", href: "/contatti", icon: Mail },
];
