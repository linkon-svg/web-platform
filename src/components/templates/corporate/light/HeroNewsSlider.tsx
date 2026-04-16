"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

export interface HeroSlide {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref: string;
  bgImage?: string;
  bgColor?: string;
}

interface HeroNewsSliderProps {
  slides: HeroSlide[];
  autoPlayInterval?: number;
}

export default function HeroNewsSlider({
  slides,
  autoPlayInterval = 5000,
}: HeroNewsSliderProps) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(next, autoPlayInterval);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next, autoPlayInterval]);

  const slide = slides[current];

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[680px] overflow-hidden bg-[#F9F9F9]">
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          backgroundColor: slide.bgColor || "#F2F2F2",
          backgroundImage: slide.bgImage ? `url(${slide.bgImage})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Overlay for readability */}
      {slide.bgImage && (
        <div className="absolute inset-0 bg-black/20" />
      )}

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 h-full flex flex-col justify-center">
        <h2
          className={`text-3xl md:text-4xl lg:text-[40px] font-bold leading-tight tracking-tight mb-4 ${
            slide.bgImage ? "text-white" : "text-[#191919]"
          }`}
        >
          {slide.title}
        </h2>
        <p
          className={`text-base md:text-lg max-w-[560px] mb-8 leading-relaxed ${
            slide.bgImage ? "text-white/90" : "text-[#666]"
          }`}
        >
          {slide.description}
        </p>
        <Link
          href={slide.ctaHref}
          className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
            slide.bgImage
              ? "text-white hover:text-white/80"
              : "text-[#191919] hover:text-[#666]"
          }`}
        >
          {slide.ctaLabel || "자세히 보기"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
        aria-label="이전 슬라이드"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors shadow-sm"
        aria-label="다음 슬라이드"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === current
                  ? "bg-[#191919] w-6"
                  : "bg-[#191919]/30 hover:bg-[#191919]/50"
              }`}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>

        {/* Pause / Play */}
        <button
          onClick={() => setPaused(!paused)}
          className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
          aria-label={paused ? "자동 재생" : "일시 정지"}
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#191919">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#191919">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </button>
      </div>
    </section>
  );
}
