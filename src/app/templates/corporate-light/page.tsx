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

/* ─── API Helpers ─── */

const API_BASE = "http://localhost:8000";

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/* ─── Fallback Data ─── */

const fallbackHeroSlides: HeroSlide[] = [
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

const fallbackServiceCards: ServiceCard[] = [
  {
    title: "서비스",
    description: "나의 세계를 바꾸는 카카오",
    href: "/service/service",
  },
  {
    title: "AI 기술",
    description: "나에게 가장 가까운, 가장 쉬운 AI",
    href: "/service/tech/ai",
  },
  {
    title: "채용",
    description: "함께 나아갈 미래의 크루들에게",
    href: "/careers",
  },
  {
    title: "ESG",
    description: "지속가능한 미래를 위한 카카오의 약속과 책임",
    href: "/esg",
  },
];

const fallbackInfoCards: InfoCard[] = [
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
];

const fallbackServiceItems: ServiceItem[] = [
  { name: "카카오톡", description: "국민 메신저, 카카오톡으로 대화하세요" },
  { name: "카카오맵", description: "길찾기부터 주변 정보까지 한 번에" },
  { name: "카카오톡 채널", description: "비즈니스 소통의 새로운 기준" },
  { name: "카카오페이지", description: "웹툰, 웹소설의 모든 것" },
  { name: "카카오페이", description: "간편하고 안전한 모바일 결제" },
  { name: "카카오T", description: "택시, 대리, 주차 등 이동의 모든 것" },
];

/* ─── Page ─── */

export default async function CorporateLightPage() {
  const [config, news, services, milestones] = await Promise.all([
    fetchAPI("/api/corporate/config"),
    fetchAPI("/api/corporate/news?is_featured=true"),
    fetchAPI("/api/corporate/services"),
    fetchAPI("/api/corporate/milestones"),
  ]);

  /* Map API news to hero slides */
  const heroSlides: HeroSlide[] = news
    ? (news as Array<Record<string, unknown>>)
        .slice(0, 3)
        .map((n, i) => ({
          title: (n.title as string) || "",
          description: (n.summary as string) || (n.content as string) || "",
          ctaHref: `/templates/corporate-light/news`,
          bgColor: ["#EAEEF3", "#E8F0E8", "#F0ECE8"][i % 3],
        }))
    : fallbackHeroSlides;

  /* Map API services to service cards */
  const serviceCards: ServiceCard[] = services
    ? (services as Array<Record<string, unknown>>).map((s) => ({
        title: (s.title as string) || "",
        description: (s.description as string) || "",
        href: (s.link as string) || "/templates/corporate-light/services",
      }))
    : fallbackServiceCards;

  /* News items for info cards */
  const infoCards: InfoCard[] = news
    ? [
        {
          title: "뉴스",
          description: "최신 소식과 미디어 보도자료를 확인하세요.",
          href: "/templates/corporate-light/news",
        },
        {
          title: "서비스",
          description: "다양한 서비스를 살펴보세요.",
          href: "/templates/corporate-light/services",
        },
        {
          title: "연혁",
          description: "회사의 주요 연혁을 확인하세요.",
          href: "/templates/corporate-light/milestones",
        },
        {
          title: "소개",
          description: "회사 비전과 미션을 살펴보세요.",
          href: "/templates/corporate-light/about",
        },
      ]
    : fallbackInfoCards;

  /* Map API services to carousel items */
  const serviceItems: ServiceItem[] = services
    ? (services as Array<Record<string, unknown>>).map((s) => ({
        name: (s.title as string) || "",
        description: (s.description as string) || "",
        href: (s.link as string) || "#",
      }))
    : fallbackServiceItems;

  return (
    <div className="min-h-screen bg-white text-[#191919]">
      <CorporateLightHeader />

      <main>
        <HeroNewsSlider slides={heroSlides.length > 0 ? heroSlides : fallbackHeroSlides} />
        <ServiceCardGrid cards={serviceCards.length > 0 ? serviceCards : fallbackServiceCards} />
        <InfoCardList title={`${config?.company_name || "카카오"}의 다양한 모습`} cards={infoCards} />
        <ServiceCarousel
          title={`더 나은 세상을 만드는 ${config?.company_name || "카카오"} 서비스`}
          items={serviceItems.length > 0 ? serviceItems : fallbackServiceItems}
        />
      </main>

      <CorporateLightFooter />
    </div>
  );
}
