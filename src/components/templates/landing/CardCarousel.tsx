"use client";

interface CardData {
  id: string;
  title: string;
  description: string;
  author?: string;
  date?: string;
}

interface CardCarouselProps {
  title: string;
  subtitle?: string;
  cards: CardData[];
}

export default function CardCarousel({
  title,
  subtitle,
  cards,
}: CardCarouselProps) {
  return (
    <section
      className="landing-section"
      style={{ backgroundColor: "var(--color-landing-bg)" }}
    >
      <div className="landing-container">
        {/* Header */}
        <div className="mb-10">
          <h2
            className="text-2xl md:text-4xl font-bold mb-3"
            style={{
              fontFamily: "var(--font-landing-display)",
              color: "var(--color-landing-text)",
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className="text-base md:text-lg"
              style={{ color: "var(--color-landing-text-secondary)" }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Scrollable cards */}
        <div className="snap-x-container gap-5 pb-4 -mx-4 px-4 md:-mx-8 md:px-8">
          {cards.map((card) => (
            <article
              key={card.id}
              className="w-[240px] md:w-[280px] rounded-xl overflow-hidden shrink-0 transition-shadow hover:shadow-lg"
              style={{
                backgroundColor: "var(--color-landing-bg)",
                border: "1px solid var(--color-landing-border)",
              }}
            >
              {/* Image placeholder */}
              <div
                className="w-full h-40 flex items-center justify-center"
                style={{ backgroundColor: "var(--color-landing-bg-alt)" }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="4"
                    y="8"
                    width="32"
                    height="24"
                    rx="3"
                    stroke="var(--color-landing-text-secondary)"
                    strokeWidth="1.5"
                    opacity="0.25"
                  />
                  <circle
                    cx="14"
                    cy="18"
                    r="3"
                    stroke="var(--color-landing-text-secondary)"
                    strokeWidth="1.5"
                    opacity="0.25"
                  />
                  <polyline
                    points="4,28 16,20 24,26 32,18 36,22"
                    stroke="var(--color-landing-text-secondary)"
                    strokeWidth="1.5"
                    opacity="0.25"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3
                  className="text-base font-bold mb-2 line-clamp-2"
                  style={{ color: "var(--color-landing-text)" }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-sm line-clamp-3 mb-4"
                  style={{ color: "var(--color-landing-text-secondary)" }}
                >
                  {card.description}
                </p>
                {(card.author || card.date) && (
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "var(--color-landing-text-secondary)" }}
                  >
                    {card.author && <span>{card.author}</span>}
                    {card.author && card.date && (
                      <span aria-hidden="true">·</span>
                    )}
                    {card.date && <time>{card.date}</time>}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
