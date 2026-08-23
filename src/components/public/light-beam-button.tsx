import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface LightBeamButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  gradientColors?: [string, string, string];
  type?: "button" | "submit";
  disabled?: boolean;
}

const DEFAULT_COLORS: [string, string, string] = ["#2e9bd6", "#ffffff", "#2e9bd6"];

const BASE_CLASSES =
  "group relative isolate inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-[#000000] px-8 py-3 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(46,155,214,0.35)] hover:shadow-[0_0_28px_-5px_rgba(46,155,214,0.55)] disabled:opacity-50 disabled:pointer-events-none";

function ButtonInner({
  children,
  gradient,
}: {
  children: React.ReactNode;
  gradient: string;
}) {
  return (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        aria-hidden="true"
        className="animate-border-spin absolute inset-0 -z-10 rounded-full p-[1px]"
        style={{ background: gradient }}
      />
      <span aria-hidden="true" className="absolute inset-[1.5px] -z-10 rounded-full bg-[#000000]" />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(46,155,214,0.22)_0%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
    </>
  );
}

export function LightBeamButton({
  children,
  className,
  onClick,
  href,
  target,
  rel,
  gradientColors = DEFAULT_COLORS,
  type = "button",
  disabled,
}: LightBeamButtonProps) {
  const gradient = `conic-gradient(from var(--gradient-angle), transparent 0%, ${gradientColors[0]} 40%, ${gradientColors[1]} 50%, transparent 60%, transparent 100%)`;

  if (href) {
    return (
      <Link href={href} target={target} rel={rel} onClick={onClick} className={cn(BASE_CLASSES, className)}>
        <ButtonInner gradient={gradient}>{children}</ButtonInner>
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cn(BASE_CLASSES, className)}>
      <ButtonInner gradient={gradient}>{children}</ButtonInner>
    </button>
  );
}
