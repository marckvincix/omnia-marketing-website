import type { ServiceSub } from "@/lib/content/services";

export function ServiceSubGrid({ items }: { items: ServiceSub[] }) {
  return (
    <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.title}
            className="bg-[#111111] rounded-[2rem] p-10 border border-[#1f1f1f] hover:border-[#333333] transition-colors"
          >
            <h3 className="font-display text-2xl md:text-3xl text-white mb-3">
              {item.title}
            </h3>
            <p className="text-[#999999] leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
