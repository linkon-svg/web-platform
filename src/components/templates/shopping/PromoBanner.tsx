"use client";

import { useState, useEffect, useCallback } from "react";

interface PromoBannerProps {
  messages: string[];
}

export default function PromoBanner({ messages }: PromoBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  }, [messages.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  }, [messages.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  if (!visible || messages.length === 0) return null;

  return (
    <div
      className="relative flex items-center justify-center py-2 px-6 text-center"
      style={{
        backgroundColor: "var(--color-shop-black, #000)",
        color: "var(--color-shop-white, #FFF)",
        fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
      }}
    >
      {messages.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm opacity-60 hover:opacity-100 transition-opacity"
          aria-label="이전"
        >
          &#8592;
        </button>
      )}

      <span
        className="text-xs"
        style={{ letterSpacing: "0.15em" }}
      >
        {messages[currentIndex]}
      </span>

      {messages.length > 1 && (
        <button
          onClick={next}
          className="absolute right-12 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm opacity-60 hover:opacity-100 transition-opacity"
          aria-label="다음"
        >
          &#8594;
        </button>
      )}

      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-sm opacity-60 hover:opacity-100 transition-opacity"
        aria-label="닫기"
      >
        &times;
      </button>
    </div>
  );
}
