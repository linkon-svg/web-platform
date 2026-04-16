"use client";

import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

interface CorporateDarkHeaderProps {
  logo?: string;
  navItems?: NavItem[];
  languages?: string[];
  activeLanguage?: string;
  onLanguageChange?: (lang: string) => void;
}

const defaultNavItems: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Studios", href: "#studios" },
  { label: "Games", href: "#games" },
  { label: "More Experience", href: "#experience" },
  { label: "Careers", href: "#careers" },
  { label: "IR", href: "#ir" },
  { label: "CSR", href: "#csr" },
  { label: "News", href: "#news" },
];

const defaultLanguages = ["KO", "EN", "CN", "JP"];

export default function CorporateDarkHeader({
  logo = "KRAFTON",
  navItems = defaultNavItems,
  languages = defaultLanguages,
  activeLanguage = "KO",
  onLanguageChange,
}: CorporateDarkHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(activeLanguage);

  const handleLangClick = (lang: string) => {
    setCurrentLang(lang);
    onLanguageChange?.(lang);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#333]">
      <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="text-white text-xl font-bold tracking-[0.15em] uppercase shrink-0"
        >
          {logo}
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 ml-12">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-white/80 text-[13px] font-light tracking-wide uppercase hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Language Selector (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 ml-auto">
          {languages.map((lang, i) => (
            <span key={lang} className="flex items-center">
              <button
                onClick={() => handleLangClick(lang)}
                className={`text-[12px] tracking-wide px-1.5 py-0.5 transition-colors ${
                  currentLang === lang
                    ? "text-white font-medium"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {lang}
              </button>
              {i < languages.length - 1 && (
                <span className="text-white/20 text-[10px]">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-black/95 backdrop-blur-lg border-t border-[#333]">
          <nav className="flex flex-col px-8 py-6 gap-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white/80 text-sm tracking-wide uppercase hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 px-8 pb-6">
            {languages.map((lang, i) => (
              <span key={lang} className="flex items-center">
                <button
                  onClick={() => {
                    handleLangClick(lang);
                    setMobileOpen(false);
                  }}
                  className={`text-[12px] tracking-wide px-1 ${
                    currentLang === lang
                      ? "text-white font-medium"
                      : "text-white/40"
                  }`}
                >
                  {lang}
                </button>
                {i < languages.length - 1 && (
                  <span className="text-white/20 text-[10px]">|</span>
                )}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
