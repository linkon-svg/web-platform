"use client";

import { useState } from "react";

interface PromoBarProps {
  text: string;
  ctaText: string;
  ctaLink: string;
  bgColor?: string;
}

export default function PromoBar({
  text,
  ctaText,
  ctaLink,
  bgColor,
}: PromoBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="w-full py-3 px-4 md:px-8"
      style={{ backgroundColor: bgColor || "var(--color-landing-primary)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="text-white text-sm md:text-base font-medium flex-1">
          {text}
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={ctaLink}
            className="inline-flex items-center justify-center px-4 py-2 bg-white rounded-md text-sm font-semibold transition-colors hover:bg-gray-100 min-h-[44px]"
            style={{ color: bgColor || "var(--color-landing-primary)" }}
          >
            {ctaText}
          </a>
          <button
            onClick={() => setVisible(false)}
            className="text-white/80 hover:text-white transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="프로모션 배너 닫기"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
