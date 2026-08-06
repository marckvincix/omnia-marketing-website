import Link from "next/link";

interface CtaBandProps {
  title: string;
  description?: string;
  ctaLabel?: string;
}

export function CtaBand({
  title,
  description,
  ctaLabel = "Contattaci",
}: CtaBandProps) {
  return (
    <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto border-t border-[#1a1a1a]">
      <div className="flex flex-col items-start gap-6">
        <h2 className="font-display text-3xl md:text-5xl text-white max-w-2xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-lg text-[#999999]">{description}</p>
        )}
        <Link
          href="/contatti"
          className="inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-80"
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
