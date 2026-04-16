"use client";

import React from "react";
import {
  CorporateLightHeader,
  HeroNewsSlider,
  ServiceCardGrid,
  InfoCardList,
  ServiceCarousel,
  CorporateLightFooter,
} from "@/components/templates/corporate/light";
import type {
  HeroSlide,
  ServiceCard,
  InfoCard,
  ServiceItem,
} from "@/components/templates/corporate/light";

/* ── Sample Data ── */

const heroSlides: HeroSlide[] = [
  {
    title: "AI로 여는\n새로운 연결의 시대",
    description:
      "카카오는 AI 기술을 기반으로 사람과 사람, 사람과 세상을 더 가깝게 연결합니다.",
    ctaHref: "/service/tech/ai",
    bgColor: "#EAEEF3",
  },
  {
    title: "카나나,\n카카오의 글로벌 AI 서비스",
    description:
      "전 세계 사용자에게 새로운 경험을 선사하는 카카오의 AI 플랫폼을 만나보세요.",
    ctaHref: "/service/service",
    bgColor: "#E8F0E8",
  },
  {
    title: "지속가능한 미래를 위한\n카카오의 약속",
    description:
      "기술의 힘으로 더 나은 세상을 만들어가는 카카오의 ESG 활동을 소개합니다.",
    ctaHref: "/esg",
    bgColor: "#F0ECE8",
  },
];

const serviceCards: ServiceCard[] = [
  {
    title: "서비스",
    description: "나의 세계를 바꾸는 카카오",
    href: "/service/service",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 17v4" />
      </svg>
    ),
  },
  {
    title: "AI 기술",
    description: "나에게 가장 가까운, 가장 쉬운 AI",
    href: "/service/tech/ai",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V6a4 4 0 0 1 4-4z" />
        <path d="M9 8v2a3 3 0 0 0 6 0V8" />
        <path d="M4 14h16" />
        <path d="M6 14v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4" />
      </svg>
    ),
  },
  {
    title: "채용",
    description: "함께 나아갈 미래의 크루들에게",
    href: "/careers",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "ESG",
    description: "지속가능한 미래를 위한 카카오의 약속과 책임",
    href: "/esg",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
];

const infoCards: InfoCard[] = [
  {
    title: "뉴스",
    description: "카카오의 최신 소식과 미디어 보도자료를 확인하세요.",
    href: "/news",
  },
  {
    title: "투자정보",
    description: "주가, 재무정보, IR 자료 등 투자자를 위한 정보입니다.",
    href: "/ir",
  },
  {
    title: "카카오소식",
    description: "카카오가 만들어가는 다양한 이야기를 전합니다.",
    href: "/news/kakao",
  },
  {
    title: "그룹사소식",
    description: "카카오 그룹사들의 최신 소식을 확인하세요.",
    href: "/news/group",
  },
  {
    title: "고객센터",
    description: "도움이 필요하시면 언제든 문의해 주세요.",
    href: "/support",
  },
];

const serviceItems: ServiceItem[] = [
  { name: "카카오톡", description: "국민 메신저, 카카오톡으로 대화하세요" },
  { name: "카카오맵", description: "길찾기부터 주변 정보까지 한 번에" },
  { name: "카카오톡 채널", description: "비즈니스 소통의 새로운 기준" },
  { name: "카카오페이지", description: "웹툰, 웹소설의 모든 것" },
  { name: "카카오페이", description: "간편하고 안전한 모바일 결제" },
  { name: "카카오T", description: "택시, 대리, 주차 등 이동의 모든 것" },
  { name: "카카오뱅크", description: "쉽고 편리한 모바일 은행" },
  { name: "카카오스토리", description: "일상을 기록하고 공유하세요" },
];

/* ── Page ── */

export default function CorporateLightPage() {
  return (
    <div className="min-h-screen bg-white text-[#191919]">
      <CorporateLightHeader />

      <main>
        <HeroNewsSlider slides={heroSlides} />
        <ServiceCardGrid cards={serviceCards} />
        <InfoCardList title="카카오의 다양한 모습" cards={infoCards} />
        <ServiceCarousel
          title="더 나은 세상을 만드는 카카오 서비스"
          items={serviceItems}
        />
      </main>

      <CorporateLightFooter />
    </div>
  );
}
