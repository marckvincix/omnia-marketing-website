import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  MessageSquareQuote,
  HelpCircle,
  Users,
  Newspaper,
  Image as ImageIcon,
  Mail,
  Settings,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Servizi", href: "/admin/servizi", icon: Briefcase },
  { label: "Progetti", href: "/admin/progetti", icon: FolderKanban },
  { label: "Testimonianze", href: "/admin/testimonianze", icon: MessageSquareQuote },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Team", href: "/admin/team", icon: Users },
  { label: "Blog", href: "/admin/blog", icon: Newspaper },
  { label: "Media", href: "/admin/media", icon: ImageIcon },
  { label: "Messaggi", href: "/admin/messaggi", icon: Mail },
  { label: "Impostazioni", href: "/admin/impostazioni", icon: Settings },
];
