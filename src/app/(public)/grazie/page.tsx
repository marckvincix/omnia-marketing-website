import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Grazie",
  description: "Grazie per averci contattato, ti risponderemo il prima possibile.",
  robots: { index: false, follow: true },
};

export default function GraziePage() {
  return (
    <section className="px-6 md:px-12 pt-48 pb-32 max-w-4xl mx-auto text-center">
      <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[0.95]">
        Grazie.
      </h1>
      <p className="mt-6 text-lg text-[#999999] max-w-xl mx-auto">
        La tua richiesta è stata ricevuta: il nostro team la valuterà e ti
        risponderà il prima possibile.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          href="/progetti"
          className="rounded-full border border-[#333333] px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-black transition-all"
        >
          Guarda i nostri progetti
        </Link>
        <Link
          href="/"
          className="rounded-full bg-[#ff6b50] hover:bg-[#e55a40] px-6 py-3 text-sm font-semibold text-black transition-colors"
        >
          Torna alla home
        </Link>
      </div>
    </section>
  );
}
