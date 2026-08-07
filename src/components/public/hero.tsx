interface HeroProps {
  title?: string;
}

export function Hero({ title = "crediamo\nnel design" }: HeroProps) {
  const lines = title.split("\n");

  return (
    <div className="relative z-50 flex h-screen w-full items-center justify-center px-6 text-center">
      <h1 className="font-display font-black text-white text-[13vw] md:text-[9vw] leading-[0.9] tracking-[-0.03em] select-none drop-shadow-[0_4px_40px_rgba(0,0,0,0.9)]">
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </h1>
    </div>
  );
}
