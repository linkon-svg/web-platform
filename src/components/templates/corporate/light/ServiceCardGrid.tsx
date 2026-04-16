"use client";

import React from "react";
import Link from "next/link";

export interface ServiceCard {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

interface ServiceCardGridProps {
  cards: ServiceCard[];
}

export default function ServiceCardGrid({ cards }: ServiceCardGridProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group block p-8 bg-[#F9F9F9] rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {card.icon && (
                <div className="mb-5 text-[#191919]">{card.icon}</div>
              )}
              <h3 className="text-lg font-bold text-[#191919] mb-3 group-hover:text-[#333] transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed">
                {card.description}
              </p>
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-[#191919] opacity-0 group-hover:opacity-100 transition-opacity">
                자세히 보기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
