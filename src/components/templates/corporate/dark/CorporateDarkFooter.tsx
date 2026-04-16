"use client";

import React, { useState } from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface SnsLink {
  name: string;
  href: string;
}

interface FamilySite {
  label: string;
  href: string;
}

interface CompanyInfo {
  ceo: string;
  address: string;
  phone: string;
  fax: string;
  email: string;
  businessRegistration: string;
  copyright: string;
}

export interface CorporateDarkFooterProps {
  topLinks?: FooterLink[];
  snsLinks?: SnsLink[];
  familySites?: FamilySite[];
  companyInfo?: CompanyInfo;
}

const defaultTopLinks: FooterLink[] = [
  { label: "찾아오시는 길", href: "#" },
  { label: "개인정보처리방침", href: "#" },
  { label: "문의하기", href: "#" },
  { label: "열린신고제도", href: "#" },
];

const defaultSnsLinks: SnsLink[] = [
  { name: "Blog", href: "#" },
  { name: "Youtube", href: "#" },
  { name: "Instagram", href: "#" },
  { name: "Facebook", href: "#" },
  { name: "LinkedIn", href: "#" },
];

const defaultFamilySites: FamilySite[] = [
  { label: "PUBG Studios", href: "#" },
  { label: "Bluehole Studio", href: "#" },
  { label: "RisingWings", href: "#" },
];

const defaultCompanyInfo: CompanyInfo = {
  ceo: "대표이사: 김창한",
  address: "서울특별시 강남구 테헤란로 123 크래프톤타워",
  phone: "TEL: 02-1234-5678",
  fax: "FAX: 02-1234-5679",
  email: "EMAIL: contact@krafton.com",
  businessRegistration: "사업자등록번호: 123-45-67890",
  copyright: "Copyright KRAFTON, Inc. All rights reserved.",
};

const snsIcons: Record<string, React.ReactElement> = {
  Blog: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2z" />
    </svg>
  ),
  Youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1A75 75 0 0012 4a75 75 0 00-8.37.58 2.92 2.92 0 00-1.72 1A8.5 8.5 0 001 9.71a38 38 0 000 4.58 8.5 8.5 0 00.91 4.13 3 3 0 001.72 1A75 75 0 0012 20a75 75 0 008.37-.58 3 3 0 001.72-1 8.5 8.5 0 00.91-4.13 38 38 0 000-4.58zM9.58 15.27V8.73L15.69 12z" />
    </svg>
  ),
  Instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.013 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.013-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm5.25-3.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" />
    </svg>
  ),
  Facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
};

export default function CorporateDarkFooter({
  topLinks = defaultTopLinks,
  snsLinks = defaultSnsLinks,
  familySites = defaultFamilySites,
  companyInfo = defaultCompanyInfo,
}: CorporateDarkFooterProps) {
  const [familyOpen, setFamilyOpen] = useState(false);

  return (
    <footer className="bg-[#0A0A0A] text-white/70 pt-16 pb-10 px-8">
      <div className="max-w-[1280px] mx-auto">
        {/* Top Links */}
        <div className="flex flex-wrap items-center gap-6 mb-8">
          {topLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* SNS + Family Site */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-10 border-b border-[#333]">
          <div className="flex items-center gap-5">
            {snsLinks.map((sns) => (
              <a
                key={sns.name}
                href={sns.href}
                aria-label={sns.name}
                className="text-white/40 hover:text-white transition-colors"
              >
                {snsIcons[sns.name] || (
                  <span className="text-xs">{sns.name}</span>
                )}
              </a>
            ))}
          </div>

          {/* Family Site Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFamilyOpen(!familyOpen)}
              className="flex items-center gap-2 text-sm text-white/50 border border-[#444] px-4 py-2 hover:text-white hover:border-[#666] transition-colors"
            >
              FAMILY SITE
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${familyOpen ? "rotate-180" : ""}`}
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            {familyOpen && (
              <div className="absolute bottom-full mb-1 right-0 bg-[#1A1A1A] border border-[#333] min-w-[200px] z-10">
                {familySites.map((site) => (
                  <a
                    key={site.label}
                    href={site.href}
                    className="block px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-[#252525] transition-colors"
                  >
                    {site.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Company Info */}
        <div className="space-y-1.5 text-[12px] text-white/30 font-light leading-relaxed">
          <p>{companyInfo.ceo}</p>
          <p>{companyInfo.address}</p>
          <p>
            {companyInfo.phone} | {companyInfo.fax}
          </p>
          <p>{companyInfo.email}</p>
          <p>{companyInfo.businessRegistration}</p>
        </div>

        <p className="text-[11px] text-white/20 mt-8">
          {companyInfo.copyright}
        </p>
      </div>
    </footer>
  );
}
