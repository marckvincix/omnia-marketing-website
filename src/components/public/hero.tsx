"use client";

import { TubesBackground } from "./tubes-background";

interface HeroProps {
  title?: string;
}

export function Hero({ title = "crediamo\nnel design" }: HeroProps) {
  const lines = title.split("\n");

  return (
    <TubesBackground className="h-screen">
      <div className="flex h-full w-full items-center justify-center px-6 text-center">
        <h1
          className="font-black text-white text-[13vw] md:text-[9vw] leading-[0.9] tracking-[0.02em] select-none drop-shadow-[0_4px_40px_rgba(0,0,0,0.9)]"
          style={{ fontFamily: "var(--font-alfa-slab)" }}
        >
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </h1>
      </div>
    </TubesBackground>
  );
}
