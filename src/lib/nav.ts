import type { LucideIcon } from "lucide-react";
import { Home, Users, Code2, PenTool, Megaphone, LayoutGrid, Newspaper, Mail, LogIn } from "lucide-react";

export const CLIENTS_AREA_URL = "https://hub.omniamarketing.it";

// "labelKey" è la chiave nel namespace "nav" del catalogo messaggi (messages/*.json),
// non un'etichetta scritta qui: i componenti che consumano queste liste risolvono il
// testo con useTranslations("nav")/getTranslations("nav") nella lingua corrente.
export const FOOTER_NAV = [
  { labelKey: "home", href: "/" },
  { labelKey: "chiSiamo", href: "/chi-siamo" },
  { labelKey: "web", href: "/web" },
  { labelKey: "branding", href: "/branding" },
  { labelKey: "social", href: "/social" },
  { labelKey: "portfolio", href: "/progetti" },
  { labelKey: "blog", href: "/blog" },
  { labelKey: "contatti", href: "/contatti" },
] as const;

export const DOCK_ITEMS: { labelKey: string; href: string; icon: LucideIcon }[] = [
  { labelKey: "home", href: "/", icon: Home },
  { labelKey: "chiSiamo", href: "/chi-siamo", icon: Users },
  { labelKey: "web", href: "/web", icon: Code2 },
  { labelKey: "branding", href: "/branding", icon: PenTool },
  { labelKey: "social", href: "/social", icon: Megaphone },
  { labelKey: "portfolio", href: "/progetti", icon: LayoutGrid },
  { labelKey: "blog", href: "/blog", icon: Newspaper },
];

export const DOCK_CTA_ICON = Mail;
export const CLIENTS_AREA_ICON = LogIn;
