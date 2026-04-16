"use client";

import { useRef, useState, useCallback } from "react";

export interface ProductItem {
  thumbnail: string;
  studio: string;
  title: string;
  href?: string;
}

interface ProductCarouselProps {
  heading?: string;
  items: ProductItem[];
}

export default function ProductCarousel({
  heading = "KRAFTON GAMES",
  items,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  return (
    <section className="bg-black py-28">
      <div className="max-w-[1280px] mx-auto px-8 mb-10 flex items-center justify-between">
        <h2 className="text-white text-4xl md:text-5xl font-bold uppercase tracking-[0.03em]">
          {heading}
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-10 h-10 flex items-center justify-center border border-[#555] text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            aria-label="Previous"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 2l-6 6 6 6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-10 h-10 flex items-center justify-center border border-[#555] text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
            aria-label="Next"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-8 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href || "#"}
            className="group shrink-0 w-[220px] md:w-[260px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#1A1A1A] mb-4">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.thumbnail})` }}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
            <p className="text-[#999] text-[11px] uppercase tracking-[0.1em] mb-1">
              {item.studio}
            </p>
            <h5 className="text-white text-sm font-semibold leading-snug">
              {item.title}
            </h5>
          </a>
        ))}
      </div>
    </section>
  );
}
