'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { API_BASE } from '@/lib/api';

interface Philosophy {
  id: number;
  hospital_id: number;
  icon: string | null;
  title: string;
  title_ko: string;
  description: string;
  sort_order: number;
}

const ICON_MAP: Record<string, ReactNode> = {
  heart: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  sun: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  shield: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  sparkle: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  ),
};

const DEFAULT_ICON: ReactNode = (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

function getIcon(iconKey: string | null): ReactNode {
  if (!iconKey) return DEFAULT_ICON;
  return ICON_MAP[iconKey] || DEFAULT_ICON;
}

interface PhilosophyItem {
  icon?: string | null;
  title: string;
  title_ko?: string | null;
  description?: string | null;
}

interface PhilosophySectionProps {
  philosophies?: PhilosophyItem[];
}

export default function PhilosophySection({ philosophies }: PhilosophySectionProps) {
  if (!philosophies || philosophies.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-white">
      <div className="section-narrow">
        {/* Section Title */}
        <div className="mb-12 lg:mb-16">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-hospital-dark italic">
            Philosophy
          </h2>
          <p className="mt-4 text-sm text-hospital-gray leading-relaxed max-w-md">
            자연이 주는 건강한 아름다움을 추구하고
            <br />
            자신감을 대해 새로움을 찾아가는
            <br />
            이곳을 찾아 주십시오.
          </p>
        </div>

        {/* Philosophy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {philosophies.map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-hospital-cream rounded-sm p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Decorative top line */}
              <div className="w-10 h-[2px] bg-hospital-gold mb-6 transition-all duration-300 group-hover:w-16" />

              {/* Icon */}
              <div className="text-hospital-gold mb-4">
                {getIcon(item.icon ?? null)}
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl text-hospital-dark mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-hospital-gray leading-relaxed whitespace-pre-line">
                {item.description ?? ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
