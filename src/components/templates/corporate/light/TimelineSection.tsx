"use client";

import React from "react";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
}

interface TimelineSectionProps {
  title?: string;
  items: TimelineItem[];
}

export default function TimelineSection({
  title,
  items,
}: TimelineSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-[#191919] mb-16 tracking-tight text-center">
            {title}
          </h2>
        )}

        {/* Desktop: alternating left/right */}
        <div className="hidden md:block relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#E5E5E5] -translate-x-1/2" />

          {items.map((item, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div key={`${item.year}-${idx}`} className="relative mb-16 last:mb-0">
                {/* Dot */}
                <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#191919] z-10 top-2" />

                <div
                  className={`flex items-start gap-12 ${
                    isLeft ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content side */}
                  <div className={`w-1/2 ${isLeft ? "text-right pr-12" : "text-left pl-12"}`}>
                    <span className="text-sm font-bold text-[#999] tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="text-lg font-bold text-[#191919] mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#666] leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Image side */}
                  <div className={`w-1/2 ${isLeft ? "pl-12" : "pr-12"}`}>
                    {item.image && (
                      <div className="w-full h-40 bg-[#F9F9F9] rounded-xl overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${item.image})` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: vertical stack */}
        <div className="md:hidden relative">
          {/* Left line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[#E5E5E5]" />

          {items.map((item, idx) => (
            <div key={`${item.year}-${idx}`} className="relative pl-12 mb-10 last:mb-0">
              {/* Dot */}
              <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-[#191919] z-10" />

              <span className="text-sm font-bold text-[#999] tracking-wider">
                {item.year}
              </span>
              <h3 className="text-base font-bold text-[#191919] mt-1 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed mb-3">
                {item.description}
              </p>
              {item.image && (
                <div className="w-full h-36 bg-[#F9F9F9] rounded-lg overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
