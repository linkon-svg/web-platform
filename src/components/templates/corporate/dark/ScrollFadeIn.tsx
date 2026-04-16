"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollFadeInProps {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  threshold?: number;
  className?: string;
}

export default function ScrollFadeIn({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.15,
  className = "",
}: ScrollFadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const translateMap = {
    up: "translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
  };

  const initialTransform = translateMap[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-x-0 translate-y-0"
          : `opacity-0 ${initialTransform}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
