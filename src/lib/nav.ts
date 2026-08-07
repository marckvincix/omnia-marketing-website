import type { LucideIcon } from "lucide-react";
import { Home, Users, Code2, PenTool, Megaphone, LayoutGrid, Newspaper, Mail, LogIn } from "lucide-react";

export const CLIENTS_AREA_URL = "https://hub.omniamarketing.it";

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
  { label: "Home", href: "/", icon: Home },
  { label: "Chi Siamo", href: "/chi-siamo", icon: Users },
  { label: "Web", href: "/web", icon: Code2 },
  { label: "Branding", href: "/branding", icon: PenTool },
  { label: "Social", href: "/social", icon: Megaphone },
  { label: "Portfolio", href: "/progetti", icon: LayoutGrid },
  { label: "Blog", href: "/blog", icon: Newspaper },
];

export const DOCK_CTA_ICON = Mail;
export const CLIENTS_AREA_ICON = LogIn;
