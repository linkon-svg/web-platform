interface FeatureSectionProps {
  sectionTitle: string;
  heading: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  reversed?: boolean;
  bgColor?: string;
  accentColor?: string;
}

export default function FeatureSection({
  sectionTitle,
  heading,
  description,
  ctaText,
  ctaLink,
  reversed = false,
  bgColor,
  accentColor,
}: FeatureSectionProps) {
  return (
    <section
      className="landing-section"
      style={{ backgroundColor: bgColor || "var(--color-landing-bg)" }}
    >
      <div
        className={`landing-container flex flex-col gap-10 ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        } md:items-center md:gap-16`}
      >
        {/* Text side */}
        <div className="flex-1 space-y-5">
          <p
            className="text-sm md:text-base font-semibold uppercase tracking-widest"
            style={{
              color: accentColor || "var(--color-landing-primary)",
            }}
          >
            {sectionTitle}
          </p>
          <h2
            className="text-2xl md:text-4xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-landing-display)",
              color: "var(--color-landing-text)",
            }}
          >
            {heading}
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed"
            style={{ color: "var(--color-landing-text-secondary)" }}
          >
            {description}
          </p>
          <a
            href={ctaLink}
            className="inline-flex items-center gap-2 font-semibold transition-colors min-h-[44px]"
            style={{
              color: accentColor || "var(--color-landing-primary)",
            }}
          >
            {ctaText}
            <svg
              width="18"
              height="18"
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

        {/* Visual placeholder */}
        <div className="flex-1">
          <div
            className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--color-landing-bg-alt)",
              border: "1px solid var(--color-landing-border)",
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="8"
                y="14"
                width="48"
                height="36"
                rx="4"
                stroke="var(--color-landing-text-secondary)"
                strokeWidth="2"
                opacity="0.3"
              />
              <circle
                cx="22"
                cy="28"
                r="5"
                stroke="var(--color-landing-text-secondary)"
                strokeWidth="2"
                opacity="0.3"
              />
              <polyline
                points="8,44 24,34 36,42 48,30 56,36"
                stroke="var(--color-landing-text-secondary)"
                strokeWidth="2"
                opacity="0.3"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
