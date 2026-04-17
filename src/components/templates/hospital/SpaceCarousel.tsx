'use client';

import { useRef } from 'react';

interface SpaceImage {
  label: string;
  gradient: string;
  image_url?: string | null;
}

const DEFAULT_SPACES: SpaceImage[] = [
  { label: '리셉션', gradient: 'from-hospital-beige to-hospital-cream' },
  { label: '상담실', gradient: 'from-hospital-cream to-hospital-beige' },
  { label: '시술실', gradient: 'from-hospital-gold-light/20 to-hospital-cream' },
  { label: '대기실', gradient: 'from-hospital-beige to-hospital-gold-light/20' },
  { label: '파우더룸', gradient: 'from-hospital-cream to-hospital-beige' },
];

interface SpaceCarouselProps {
  spaces?: SpaceImage[];
}

export default function SpaceCarousel({ spaces }: SpaceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.offsetWidth * 0.6;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="section-padding bg-hospital-brown">
      <div className="section-narrow">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-white">
              Yepida Place
            </h2>
            <p className="mt-2 text-sm text-white/60">
              편안하고 프라이빗한 공간에서 최상의 시술을 경험하세요
            </p>
          </div>

          {/* Arrows */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors cursor-pointer"
              aria-label="이전"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors cursor-pointer"
              aria-label="다음"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div ref={scrollRef} className="snap-x-container gap-4">
          {(spaces && spaces.length > 0 ? spaces : DEFAULT_SPACES).map((space, idx) => (
            <div
              key={idx}
              className="w-[280px] md:w-[400px] lg:w-[500px] aspect-[16/10] rounded-sm overflow-hidden relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${space.gradient}`} />
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              <div className="absolute bottom-4 left-4">
                <span className="text-sm text-hospital-brown/60 font-medium">{space.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
