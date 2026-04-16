"use client";

import React, { useRef, useState, useEffect } from "react";

export interface ServiceItem {
  name: string;
  description: string;
  href?: string;
}

interface ServiceCarouselProps {
  title?: string;
  items: ServiceItem[];
}

export default function ServiceCarousel({
  title,
  items,
}: ServiceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.offsetWidth || 280;
    const amount = direction === "left" ? -cardWidth - 24 : cardWidth + 24;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-[#191919] tracking-tight">
              {title}
            </h2>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F9F9F9] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="이전"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10 rounded-full border border-[#E5E5E5] flex items-center justify-center hover:bg-[#F9F9F9] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="다음"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.name}
              className="snap-start flex-shrink-0 w-[calc(25%-18px)] min-w-[240px] bg-[#F9F9F9] rounded-xl p-6 transition-all duration-300 hover:shadow-md cursor-pointer"
            >
              <h3 className="text-base font-bold text-[#191919] mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
