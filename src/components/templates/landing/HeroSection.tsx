interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
}: HeroSectionProps) {
  return (
    <section className="w-full min-h-[80vh] flex flex-col md:flex-row">
      {/* Left: Dark background with serif typography */}
      <div
        className="flex-1 flex flex-col justify-center px-8 md:px-16 py-16 md:py-0"
        style={{ backgroundColor: "var(--color-landing-dark)" }}
      >
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8"
          style={{
            fontFamily: "var(--font-landing-display)",
            color: "#FFFFFF",
          }}
        >
          {title}
        </h1>
        <a
          href={ctaLink}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-lg font-medium min-h-[44px] w-fit"
          aria-label={ctaText}
        >
          {ctaText}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="10" x2="16" y2="10" />
            <polyline points="10,4 16,10 10,16" />
          </svg>
        </a>
      </div>

      {/* Right: Accent background with Korean message */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-8 md:px-16 py-16 md:py-0 text-center"
        style={{ backgroundColor: "var(--color-landing-accent)" }}
      >
        <p
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug text-white"
          style={{ fontFamily: "var(--font-landing-heading)" }}
        >
          {subtitle}
        </p>
      </div>
    </section>
  );
}
