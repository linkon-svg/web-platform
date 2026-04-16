"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

const navItems: NavItem[] = [
  {
    label: "소개",
    href: "/about",
    subItems: [
      { label: "카카오 문화", href: "/about/culture" },
      { label: "카카오그룹", href: "/about/subsidiaryCompany" },
      { label: "연혁", href: "/about/milestones" },
    ],
  },
  {
    label: "기술과 서비스",
    href: "/service",
    subItems: [
      { label: "서비스 목록", href: "/service/service" },
      { label: "AI 기술", href: "/service/tech/ai" },
    ],
  },
  {
    label: "약속과 책임",
    href: "/esg",
  },
  {
    label: "소식",
    href: "/news",
    subItems: [
      { label: "뉴스", href: "/news" },
      { label: "카카오소식", href: "/news/kakao" },
      { label: "그룹사소식", href: "/news/group" },
    ],
  },
  {
    label: "투자정보",
    href: "https://ir.kakaocorp.com",
  },
];

export default function CorporateLightHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lang, setLang] = useState<"KR" | "EN">("KR");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(idx);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#191919] tracking-tight">
          kakao
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                className="text-[15px] font-medium text-[#191919] hover:text-[#666] transition-colors py-5 inline-block"
              >
                {item.label}
              </Link>
              {item.subItems && activeDropdown === idx && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1">
                  <div className="bg-white border border-[#E5E5E5] rounded-lg shadow-lg min-w-[180px] py-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-5 py-2.5 text-sm text-[#191919] hover:bg-[#F9F9F9] transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Utility buttons */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full hover:bg-[#F9F9F9] transition-colors"
            aria-label="검색"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "KR" ? "EN" : "KR")}
            className="px-3 py-1.5 text-xs font-semibold text-[#191919] border border-[#E5E5E5] rounded-full hover:bg-[#F9F9F9] transition-colors"
          >
            {lang}
          </button>

          {/* Dark mode toggle placeholder */}
          <button
            className="p-2 rounded-full hover:bg-[#F9F9F9] transition-colors"
            aria-label="다크모드 전환"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#191919" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="hidden lg:block border-t border-[#E5E5E5] bg-white">
          <div className="max-w-[1200px] mx-auto px-6 py-4">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full text-lg outline-none text-[#191919] placeholder:text-[#999]"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5E5E5] bg-white max-h-[80vh] overflow-y-auto">
          <nav className="px-6 py-4">
            {navItems.map((item) => (
              <div key={item.label} className="border-b border-[#F0F0F0] last:border-0">
                <Link
                  href={item.href}
                  className="block py-3.5 text-[15px] font-medium text-[#191919]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.subItems && (
                  <div className="pl-4 pb-2">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block py-2 text-sm text-[#666]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={() => setLang(lang === "KR" ? "EN" : "KR")}
                className="px-3 py-1.5 text-xs font-semibold text-[#191919] border border-[#E5E5E5] rounded-full"
              >
                {lang}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
