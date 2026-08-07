import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublishedServices } from "@/lib/data/services";

export async function ServicesIndex() {
  const services = await getPublishedServices();
  if (services.length === 0) return null;

  return (
    <section className="bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto border-y border-white/20 divide-y divide-white/20">
        {services.map((service, i) => (
          <Link
            key={service.slug}
            href={`/${service.slug}`}
            className="group flex items-center gap-6 md:gap-10 px-6 md:px-12 py-10 md:py-14"
          >
            <span
              className="shrink-0 text-base md:text-lg text-[#ff4d00]"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="flex-1 min-w-0">
              <h3
                className="uppercase leading-[0.95] tracking-tight text-[7vw] md:text-[4.5vw] transition-transform duration-300 ease-out group-hover:translate-x-4 md:group-hover:translate-x-8"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                {service.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {service.subservices.map((sub) => (
                  <span
                    key={sub.title}
                    className="rounded-full border border-white/20 px-3 py-1 text-[11px] md:text-xs uppercase tracking-wide text-white/60"
                  >
                    {sub.title}
                  </span>
                ))}
              </div>
            </div>

            <ArrowUpRight
              className="size-10 md:size-16 shrink-0 text-[#ff4d00] opacity-0 -translate-x-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
