import { FaqJsonLd } from "@/components/shared/json-ld";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-6 md:px-12 py-20 max-w-4xl mx-auto border-t border-[#1a1a1a]">
      <FaqJsonLd items={items} />
      <h2 className="text-xs font-bold tracking-[0.4em] uppercase text-[#2e9bd6] mb-10">
        Domande frequenti
      </h2>
      <div className="flex flex-col divide-y divide-[#1a1a1a]">
        {items.map((item) => (
          <details key={item.question} className="group py-6">
            <summary className="flex cursor-pointer items-center justify-between text-lg text-white marker:content-none">
              {item.question}
              <span className="ml-4 shrink-0 text-[#666666] transition-transform group-open:rotate-45 text-2xl leading-none">
                +
              </span>
            </summary>
            <p className="mt-3 text-[#999999] leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
