const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/omnia_marketingg/",
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100092530010219",
    path: (
      <path d="M15 3h-2a5 5 0 0 0-5 5v2H6v4h2v7h4v-7h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/10125463",
    path: (
      <>
        <rect x="3" y="9" width="4" height="12" />
        <circle cx="5" cy="4" r="2" />
        <path d="M11 9h4v2c1-1.5 2.5-2 4-2 3 0 5 2 5 6v6h-4v-6c0-1.5-1-2.5-2.5-2.5S15 14.5 15 16v5h-4z" />
      </>
    ),
  },
];

export function SocialIcons({ className }: { className?: string }) {
  return (
    <div className={className}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="flex size-9 items-center justify-center rounded-full border border-[#2a2a2a] text-[#888888] transition-colors hover:border-[#2e9bd6] hover:text-[#2e9bd6]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4">
            {social.path}
          </svg>
        </a>
      ))}
    </div>
  );
}
