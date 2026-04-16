'use client';

import { useState, useEffect, useRef } from 'react';

const NAV_ITEMS = [
  {
    label: 'ABOUT',
    href: '/introduce',
    children: [
      { label: '병원 안내', href: '/introduce' },
      { label: '공간 소개', href: '/introduce/space' },
      { label: '의료진 소개', href: '/introduce/staff' },
      { label: '진료시간', href: '/introduce/schedule' },
    ],
  },
  { label: 'PROMOTION', href: '/exhibitions' },
  {
    label: '디자인 리프팅',
    href: '#',
    children: [
      { label: '써마지FLX', href: '#' },
      { label: '울쎄라피프라임', href: '#' },
      { label: '써펙트', href: '#' },
      { label: '리프테라2', href: '#' },
    ],
  },
  {
    label: '모공 · 탄력 · 볼륨',
    href: '#',
    children: [
      { label: '스킨부스터', href: '#' },
      { label: '콜라겐 부스터', href: '#' },
      { label: '포텐자', href: '#' },
    ],
  },
  {
    label: '쁘띠',
    href: '#',
    children: [
      { label: '보톡스', href: '#' },
      { label: '필러', href: '#' },
      { label: '브이디파인', href: '#' },
    ],
  },
  {
    label: '기타 시술',
    href: '#',
    children: [
      { label: '에어녹스', href: '#' },
    ],
  },
  { label: '커뮤니티', href: '#' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = (idx: number) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(idx);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-hospital-brown/95 backdrop-blur-sm shadow-md'
            : 'bg-hospital-brown'
        }`}
      >
        <div className="section-narrow flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-white font-serif text-xl lg:text-2xl tracking-widest">
              YEPIDA CLINIC
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  href={item.href}
                  className="px-3 xl:px-4 py-2 text-sm text-white/85 hover:text-white transition-colors whitespace-nowrap"
                >
                  {item.label}
                </a>
                {item.children && openDropdown === idx && (
                  <div className="absolute top-full left-0 pt-2 min-w-[180px] animate-fade-in">
                    <div className="bg-white rounded shadow-lg border border-hospital-beige py-2">
                      {item.children.map((child, cIdx) => (
                        <a
                          key={cIdx}
                          href={child.href}
                          className="block px-5 py-2.5 text-sm text-hospital-dark hover:bg-hospital-beige hover:text-hospital-gold-dark transition-colors"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="hidden md:flex items-center gap-1 text-sm text-white/70">
              <button className="px-2 py-1 hover:text-white transition-colors cursor-pointer">EN</button>
              <span className="text-white/30">|</span>
              <button className="px-2 py-1 text-white hover:text-white transition-colors cursor-pointer">KO</button>
            </div>

            {/* Search */}
            <button className="hidden md:flex p-2 text-white/70 hover:text-white transition-colors cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="메뉴 열기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-16 right-0 w-72 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-xl animate-fade-in">
            <nav className="py-4">
              {NAV_ITEMS.map((item, idx) => (
                <div key={idx}>
                  <a
                    href={item.href}
                    className="block px-6 py-3 text-hospital-dark font-medium hover:bg-hospital-beige transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    <div className="bg-hospital-cream">
                      {item.children.map((child, cIdx) => (
                        <a
                          key={cIdx}
                          href={child.href}
                          className="block px-10 py-2.5 text-sm text-hospital-gray hover:text-hospital-gold-dark transition-colors"
                          onClick={() => setMobileOpen(false)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="border-t border-hospital-beige mt-2 pt-2 px-6">
                <div className="flex items-center gap-3 py-2 text-sm text-hospital-gray">
                  <button className="hover:text-hospital-dark transition-colors cursor-pointer">EN</button>
                  <span>|</span>
                  <button className="text-hospital-dark font-medium cursor-pointer">KO</button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
