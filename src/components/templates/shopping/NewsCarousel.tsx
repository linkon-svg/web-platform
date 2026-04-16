"use client";

import { useRef } from "react";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  image?: string;
}

interface NewsCarouselProps {
  title?: string;
  items: NewsItem[];
}

export default function NewsCarousel({
  title = "새로운 소식",
  items,
}: NewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-20 lg:py-28">
      {/* Header */}
      <div className="px-6 lg:px-12 flex items-center justify-between mb-10">
        <h2
          className="text-3xl lg:text-4xl font-light"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            color: "var(--color-shop-text, #000)",
          }}
        >
          {title}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center border text-sm transition-colors hover:bg-black hover:text-white"
            style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
            aria-label="이전"
          >
            &#8592;
          </button>
          <button
            onClick={() => scroll("right")}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center border text-sm transition-colors hover:bg-black hover:text-white"
            style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
            aria-label="다음"
          >
            &#8594;
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-6 overflow-x-auto px-6 lg:px-12 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start flex-shrink-0 w-72 lg:w-80">
            {/* Image */}
            <div
              className="w-full aspect-[4/3] mb-4"
              style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
            />
            {/* Category tag */}
            <span
              className="text-[10px] uppercase mb-2 inline-block"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.15em",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              {item.category}
            </span>
            {/* Title */}
            <p
              className="text-sm font-light leading-snug"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text, #000)",
              }}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
