"use client";

import React from "react";
import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface LegalLink {
  label: string;
  href: string;
  bold?: boolean;
}

export interface CorporateLightFooterProps {
  columns?: FooterColumn[];
  legalLinks?: LegalLink[];
  copyright?: string;
}

const defaultColumns: FooterColumn[] = [
  {
    title: "오늘의 카카오",
    links: [
      { label: "카카오톡", href: "#" },
      { label: "카카오맵", href: "#" },
      { label: "카카오페이", href: "#" },
      { label: "카카오T", href: "#" },
      { label: "카카오뱅크", href: "#" },
    ],
  },
  {
    title: "서비스",
    links: [
      { label: "커뮤니케이션", href: "#" },
      { label: "일상편의", href: "#" },
      { label: "비즈니스", href: "#" },
      { label: "쇼핑", href: "#" },
      { label: "엔터테인먼트", href: "#" },
      { label: "임팩트", href: "#" },
    ],
  },
  {
    title: "카카오그룹",
    links: [
      { label: "카카오엔터프라이즈", href: "#" },
      { label: "카카오엔터테인먼트", href: "#" },
      { label: "카카오페이", href: "#" },
      { label: "카카오모빌리티", href: "#" },
      { label: "카카오뱅크", href: "#" },
      { label: "카카오게임즈", href: "#" },
    ],
  },
  {
    title: "IR",
    links: [
      { label: "기업지배구조", href: "#" },
      { label: "주가정보", href: "#" },
      { label: "재무정보", href: "#" },
      { label: "IR 자료", href: "#" },
      { label: "공시정보", href: "#" },
    ],
  },
  {
    title: "계정 및 지원",
    links: [
      { label: "카카오계정", href: "#" },
      { label: "프라이버시", href: "#" },
      { label: "고객센터", href: "#" },
      { label: "인재영입", href: "#" },
    ],
  },
];

const defaultLegalLinks: LegalLink[] = [
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#", bold: true },
  { label: "운영정책", href: "#" },
  { label: "청소년보호정책", href: "#" },
  { label: "고객센터", href: "#" },
];

export default function CorporateLightFooter({
  columns = defaultColumns,
  legalLinks = defaultLegalLinks,
  copyright = "Copyright \u00A9 Kakao Corp. All rights reserved.",
}: CorporateLightFooterProps) {
  return (
    <footer className="bg-[#F2F2F2] pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-[#191919] mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#666] hover:text-[#191919] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="border-[#E0E0E0] mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs transition-colors ${
                  link.bold
                    ? "font-bold text-[#191919] hover:text-[#333]"
                    : "text-[#999] hover:text-[#666]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-[#999]">{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
