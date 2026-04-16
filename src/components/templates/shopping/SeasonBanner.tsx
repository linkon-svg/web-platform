import Link from "next/link";

interface SeasonBannerProps {
  subtitle?: string;
  heading: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function SeasonBanner({
  subtitle,
  heading,
  description,
  ctaText = "컬렉션 보기",
  ctaLink = "/templates/shopping/shop",
}: SeasonBannerProps) {
  return (
    <section
      className="relative w-full flex items-end justify-start px-6 lg:px-16"
      style={{
        height: "80vh",
        backgroundColor: "var(--color-shop-hover, #333)",
      }}
    >
      {/* Overlay content */}
      <div className="relative z-10 pb-16 lg:pb-24 max-w-xl">
        {subtitle && (
          <p
            className="text-xs mb-4 uppercase"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              letterSpacing: "0.2em",
              color: "var(--color-shop-text-muted, #CCC)",
            }}
          >
            {subtitle}
          </p>
        )}
        <h2
          className="text-4xl lg:text-6xl font-light mb-4"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            letterSpacing: "0.05em",
            color: "var(--color-shop-white, #FFF)",
          }}
        >
          {heading}
        </h2>
        {description && (
          <p
            className="text-sm font-light mb-6 leading-relaxed"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              color: "var(--color-shop-text-muted, #CCC)",
            }}
          >
            {description}
          </p>
        )}
        <Link
          href={ctaLink}
          className="inline-flex items-center text-xs min-h-[44px] transition-opacity hover:opacity-70"
          style={{
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            letterSpacing: "0.15em",
            color: "var(--color-shop-white, #FFF)",
          }}
        >
          {ctaText} &rarr;
        </Link>
      </div>
    </section>
  );
}
