interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <header className="px-6 md:px-12 pt-20 pb-20 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-[#2e9bd6]" />
        <span className="text-[10px] font-bold tracking-normal text-[#666666] uppercase">
          {eyebrow}
        </span>
      </div>
      <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-lg text-[#999999] max-w-2xl">{description}</p>
      )}
    </header>
  );
}
