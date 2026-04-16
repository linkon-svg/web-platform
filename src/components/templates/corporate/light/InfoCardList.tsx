"use client";

import React from "react";
import Link from "next/link";

export interface InfoCard {
  title: string;
  description: string;
  href: string;
}

interface InfoCardListProps {
  title?: string;
  cards: InfoCard[];
}

export default function InfoCardList({ title, cards }: InfoCardListProps) {
  return (
    <section className="py-20 bg-[#F9F9F9]">
      <div className="max-w-[1200px] mx-auto px-6">
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-[#191919] mb-10 tracking-tight">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group block bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-md"
            >
              <h3 className="text-base font-bold text-[#191919] mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-[#666] leading-relaxed mb-4">
                {card.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-[#191919] group-hover:gap-2 transition-all">
                바로가기
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
