import { Link } from "@/i18n/navigation";

const LINK_PATTERN = /\[([^\]]+)]\(([^)\s]+)\)/g;
const LINK_CLASS = "text-[#2e9bd6] underline hover:text-white transition-colors";

// Rende i link scritti in sintassi Markdown — [testo](url) — dentro un testo altrimenti
// semplice: i testi dei progetti non passano da un renderer Markdown come gli articoli del
// blog, ma i link interni ed esterni nel corpo del testo servono comunque alla SEO.
export function LinkedText({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const [full, label, href] = match;
    const start = match.index ?? 0;
    if (start > lastIndex) parts.push(text.slice(lastIndex, start));
    parts.push(
      href.startsWith("/") ? (
        <Link key={start} href={href} className={LINK_CLASS}>
          {label}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
          {label}
        </a>
      ),
    );
    lastIndex = start + full.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <>{parts}</>;
}
