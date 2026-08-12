interface PageHeroProps {
  title: string;
  description?: string;
}

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <header className="px-6 md:px-12 pt-20 pb-20 max-w-7xl mx-auto">
      <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[0.95] tracking-tight max-w-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-lg text-[#999999] max-w-2xl">{description}</p>
      )}
    </header>
  );
}
