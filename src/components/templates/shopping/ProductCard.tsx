"use client";

import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image?: string;
  currency?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  currency = "KRW",
}: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <Link href={`/templates/shopping/product/${id}`} className="block relative">
        <div
          className="w-full aspect-square"
          style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
        >
          {image && (
            <div
              className="w-full h-full bg-center bg-cover"
              style={{ backgroundImage: `url(${image})` }}
            />
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWishlisted(!wishlisted);
          }}
          className="absolute top-3 right-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-lg transition-opacity"
          style={{
            opacity: hovered || wishlisted ? 1 : 0,
            color: wishlisted
              ? "var(--color-shop-wishlist, #FF0000)"
              : "var(--color-shop-text, #000)",
          }}
          aria-label={wishlisted ? "위시리스트 제거" : "위시리스트 추가"}
        >
          {wishlisted ? "\u2665" : "\u2661"}
        </button>

        {/* Quick buy */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-3 transition-opacity"
          style={{
            opacity: hovered ? 1 : 0,
            backgroundColor: "var(--color-shop-overlay, rgba(0,0,0,0.4))",
          }}
        >
          <span
            className="text-xs font-light min-h-[44px] flex items-center"
            style={{
              color: "var(--color-shop-white, #FFF)",
              letterSpacing: "0.15em",
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            }}
          >
            빠른 구매
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3">
        <Link href={`/templates/shopping/product/${id}`}>
          <p
            className="text-sm font-light leading-snug"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              color: "var(--color-shop-text, #000)",
            }}
          >
            {name}
          </p>
        </Link>
        <p
          className="mt-1 text-sm"
          style={{
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            color: "var(--color-shop-text, #000)",
          }}
        >
          {currency} {price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
