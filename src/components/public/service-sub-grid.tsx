import type { ServiceSub } from "@/lib/data/services";
import { getServiceIcon } from "@/lib/service-icon";
import { StackingCards } from "./stacking-cards";

export function ServiceSubGrid({ items }: { items: ServiceSub[] }) {
  if (items.length === 0) return null;

  return (
    <StackingCards>
      {items.map((item, i) => {
        const Icon = getServiceIcon(item.title);
        return (
          <div
            key={item.title}
            className="card-hover-glow relative flex min-h-[65vh] md:min-h-[70vh] flex-col justify-between overflow-hidden rounded-[2.5rem] border border-[#1f1f1f] bg-gradient-to-br from-[#131313] to-[#0a0a0a] p-10 md:p-16"
          >
            <div className="relative flex items-start justify-between">
              <span
                className="text-sm text-[#2e9bd6]"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex size-20 md:size-24 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
                <Icon className="size-10 md:size-12 text-[#2e9bd6]" strokeWidth={1} aria-hidden="true" />
              </div>
            </div>

            <div className="relative">
              <h3 className="font-display text-3xl md:text-5xl text-white leading-[1.05] mb-4">
                {item.title}
              </h3>
              <p className="max-w-xl text-base md:text-lg text-[#999999] leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </StackingCards>
  );
}
