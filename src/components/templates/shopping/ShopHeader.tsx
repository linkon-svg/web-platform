"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
}

interface ShopHeaderProps {
  logo?: string;
  shopName?: string;
  menuItems?: MenuItem[];
}

const defaultMenuItems: MenuItem[] = [
  { label: "쇼핑", href: "/templates/shopping/shop" },
  { label: "컬렉션", href: "/templates/shopping/shop" },
  { label: "소개", href: "/templates/shopping/about" },
  { label: "매장", href: "/templates/shopping/stores" },
  { label: "소식", href: "/templates/shopping/news" },
];

export default function ShopHeader({
  logo = "SOLID",
  shopName,
  menuItems = defaultMenuItems,
}: ShopHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const displayLogo = shopName || logo;

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b"
      style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
    >
      <div className="mx-auto flex items-center justify-between px-6 lg:px-12" style={{ height: 60 }}>
        {/* Logo */}
        <Link
          href="/templates/shopping"
          className="font-bold text-xl"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            letterSpacing: "0.3em",
            color: "var(--color-shop-black, #000)",
          }}
        >
          {displayLogo}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="text-xs min-h-[44px] flex items-center transition-colors hover:opacity-70"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.1em",
                color: pathname === item.href
                  ? "var(--color-shop-text, #000)"
                  : "var(--color-shop-text-secondary, #999)",
                fontWeight: pathname === item.href ? 600 : 300,
              }}
            >
              {item.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-6 text-xs" style={{ letterSpacing: "0.1em" }}>
          <span
            className="cursor-pointer min-h-[44px] flex items-center"
            style={{ fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)" }}
          >
            KRW
          </span>
          <span className="cursor-pointer min-h-[44px] flex items-center">검색</span>
          <span className="cursor-pointer min-h-[44px] flex items-center">로그인</span>
          <span className="cursor-pointer min-h-[44px] flex items-center">장바구니</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl"
          onClick={() => setMobileOpen(true)}
          aria-label="메뉴 열기"
        >
          &#9776;
        </button>
      </div>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-white"
          style={{ color: "var(--color-shop-text, #000)" }}
        >
          <div className="flex items-center justify-between px-6" style={{ height: 60 }}>
            <span
              className="font-bold text-xl"
              style={{
                fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
                letterSpacing: "0.3em",
              }}
            >
              {displayLogo}
            </span>
            <button
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-2xl"
              onClick={() => setMobileOpen(false)}
              aria-label="메뉴 닫기"
            >
              &times;
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center flex-1 gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="text-lg"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  letterSpacing: "0.15em",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label.toUpperCase()}
              </Link>
            ))}
            <div className="flex gap-8 mt-8 text-sm" style={{ letterSpacing: "0.1em" }}>
              <span className="cursor-pointer">검색</span>
              <span className="cursor-pointer">로그인</span>
              <span className="cursor-pointer">장바구니</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
