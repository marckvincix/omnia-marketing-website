import { getLocale } from "next-intl/server";
import { getPublishedServices } from "@/lib/data/services";
import { ServiceIndexLink } from "./service-index-link";

export async function ServicesIndex() {
  const locale = await getLocale();
  const services = await getPublishedServices(locale);
  if (services.length === 0) return null;

  return (
    <section className="bg-[#000000] text-white">
      <div className="max-w-7xl mx-auto border-y border-white/20 divide-y divide-white/20">
        {services.map((service, i) => (
          <ServiceIndexLink key={service.slug} service={service} index={i} />
        ))}
      </div>
    </section>
  );
}
