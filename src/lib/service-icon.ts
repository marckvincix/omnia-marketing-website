import {
  Smartphone,
  ShoppingCart,
  Layers,
  Globe,
  Compass,
  Type,
  PenTool,
  LayoutTemplate,
  Megaphone,
  Camera,
  Video,
  Clapperboard,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_RULES: [RegExp, LucideIcon][] = [
  [/app|mobile/i, Smartphone],
  [/e-?commerce|shop/i, ShoppingCart],
  [/piattaform/i, Layers],
  [/sito|web/i, Globe],
  [/strateg/i, Compass],
  [/naming/i, Type],
  [/logo/i, PenTool],
  [/ui\s?\/?\s?ux|design/i, LayoutTemplate],
  [/social|smm/i, Megaphone],
  [/foto/i, Camera],
  [/spot/i, Clapperboard],
  [/video/i, Video],
];

export function getServiceIcon(title: string): LucideIcon {
  const rule = ICON_RULES.find(([pattern]) => pattern.test(title));
  return rule ? rule[1] : Sparkles;
}
