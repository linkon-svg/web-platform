"use client";

import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

interface BizInfo {
  name: string;
  ceo: string;
  bizNumber: string;
  address: string;
  phone: string;
  email: string;
}

interface ShopFooterProps {
  companyName?: string;
  bizInfo?: BizInfo;
  snsLinks?: { instagram?: string; youtube?: string; facebook?: string };
}

const defaultBizInfo: BizInfo = {
  name: "주식회사 솔리드",
  ceo: "홍길동",
  bizNumber: "123-45-67890",
  address: "서울특별시 강남구 압구정로 100, 3층",
  phone: "02-1234-5678",
  email: "contact@solid.co.kr",
};

export default function ShopFooter({
  companyName = "SOLID",
  bizInfo = defaultBizInfo,
  snsLinks,
}: ShopFooterProps) {
  const footerLinks = {
    about: {
      title: "소개",
      items: [
        { label: "브랜드 소개", href: "/templates/shopping/about" },
        { label: "매장 안내", href: "/templates/shopping/stores" },
        { label: "채용", href: "#" },
      ],
    },
    service: {
      title: "고객 서비스",
      items: [
        { label: "주문 조회", href: "#" },
        { label: "배송 안내", href: "#" },
        { label: "교환/반품", href: "#" },
        { label: "자주 묻는 질문", href: "#" },
      ],
    },
    legal: {
      title: "법적 고지",
      items: [
        { label: "이용약관", href: "#" },
        { label: "개인정보처리방침", href: "#" },
        { label: "소비자 분쟁해결", href: "#" },
      ],
    },
    social: {
      title: "소셜 미디어",
      items: [
        { label: "Instagram", href: snsLinks?.instagram || "#" },
        { label: "YouTube", href: snsLinks?.youtube || "#" },
        { label: "KakaoTalk", href: "#" },
      ],
    },
  };

  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--color-shop-border, #E5E5E5)",
        backgroundColor: "var(--color-shop-white, #FFF)",
      }}
    >
      {/* Main footer */}
      <div className="px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-8">
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4
                className="text-[10px] uppercase mb-6"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  letterSpacing: "0.15em",
                  color: "var(--color-shop-text, #000)",
                  fontWeight: 600,
                }}
              >
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.href !== "#" ? "_blank" : undefined}
                      rel={item.href !== "#" ? "noopener noreferrer" : undefined}
                      className="text-xs font-light transition-colors min-h-[44px] inline-flex items-center"
                      style={{
                        fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                        color: "var(--color-shop-text-secondary, #999)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-shop-text, #000)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--color-shop-text-secondary, #999)")
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Biz info */}
      <div
        className="px-6 lg:px-12 py-6 border-t"
        style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
      >
        <p
          className="text-[10px] font-light leading-relaxed"
          style={{
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            color: "var(--color-shop-text-muted, #CCC)",
          }}
        >
          {bizInfo.name} | 대표: {bizInfo.ceo} | 사업자등록번호: {bizInfo.bizNumber} |{" "}
          {bizInfo.address} | TEL: {bizInfo.phone} | {bizInfo.email}
        </p>
      </div>

      {/* Copyright */}
      <div
        className="px-6 lg:px-12 py-6 border-t"
        style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
      >
        <p
          className="text-[10px] uppercase text-center"
          style={{
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            letterSpacing: "0.2em",
            color: "var(--color-shop-text-muted, #CCC)",
          }}
        >
          &copy; 2026 {companyName}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
