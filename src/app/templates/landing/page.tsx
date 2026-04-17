import PromoBar from "@/components/templates/landing/PromoBar";
import HeroSection from "@/components/templates/landing/HeroSection";
import FeatureSection from "@/components/templates/landing/FeatureSection";
import CardCarousel from "@/components/templates/landing/CardCarousel";
import ServiceGrid from "@/components/templates/landing/ServiceGrid";
import LandingFooter from "@/components/templates/landing/LandingFooter";

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

// Fallback data used when the backend is unreachable
const fallbackConfig = {
  promo_bar_active: true,
  promo_bar_text: "지금 가입하면 첫 캠페인 30% 할인!",
  promo_bar_cta_text: "찾아보기",
  promo_bar_cta_link: "/signup",
  promo_bar_bg_color: "var(--color-landing-dark)",
  hero_title: "Where Beauty Meets Influence",
  hero_subtitle: "K-뷰티 브랜드와 글로벌 인플루언서를 연결합니다",
  hero_cta_text: "서비스 둘러보기",
  hero_cta_link: "/services",
  footer_company_name: "LINKON Inc.",
  footer_phone: "02-1234-5678",
  footer_address: "서울특별시 강남구 테헤란로 123, 4층",
  footer_biz_number: "123-45-67890",
  footer_links: [
    { label: "이용약관", href: "/terms" },
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "사업자 정보", href: "/company" },
    { label: "고객센터", href: "/support" },
  ],
};

const fallbackSections = [
  {
    id: 1,
    section_title: "INFLUENCER MATCHING",
    heading: "최적의 인플루언서를 만나보세요",
    description:
      "AI 기반 매칭 시스템이 브랜드 가치와 타겟 오디언스에 맞는 인플루언서를 추천합니다. 수천 명의 검증된 크리에이터 풀에서 최적의 파트너를 찾아드립니다.",
    cta_text: "매칭 시작하기",
    cta_link: "/matching",
    has_carousel: false,
    reversed: false,
    sort_order: 1,
  },
  {
    id: 2,
    section_title: "CAMPAIGN MANAGEMENT",
    heading: "캠페인을 한곳에서 관리하세요",
    description:
      "기획, 계약, 콘텐츠 검수, 성과 분석까지 캠페인의 모든 과정을 하나의 플랫폼에서 관리하세요. 복잡한 프로세스를 심플하게.",
    cta_text: "캠페인 관리 알아보기",
    cta_link: "/campaign",
    has_carousel: false,
    reversed: true,
    bg_color: "var(--color-landing-bg-alt)",
    accent_color: "var(--color-landing-accent)",
    sort_order: 2,
  },
  {
    id: 3,
    section_title: "INSIGHTS",
    heading: "인사이트 & 트렌드",
    description: "최신 K-뷰티 마케팅 트렌드와 성공 사례를 확인하세요",
    cta_text: "",
    cta_link: "",
    has_carousel: true,
    reversed: false,
    sort_order: 3,
  },
];

const fallbackCards: Record<number, any[]> = {
  3: [
    {
      id: "1",
      title: "인플루언서 마케팅의 새로운 기준",
      description:
        "K-뷰티 브랜드와 글로벌 인플루언서를 연결하는 가장 효율적인 방법을 소개합니다.",
      author: "LINKON 팀",
      date: "2026.04.10",
    },
    {
      id: "2",
      title: "성공적인 캠페인 사례 분석",
      description:
        "실제 브랜드와 인플루언서 협업 사례를 통해 성과를 분석합니다.",
      author: "마케팅팀",
      date: "2026.04.08",
    },
    {
      id: "3",
      title: "글로벌 뷰티 트렌드 리포트",
      description:
        "2026년 상반기 글로벌 뷰티 시장 트렌드와 인사이트를 정리했습니다.",
      author: "리서치팀",
      date: "2026.04.05",
    },
    {
      id: "4",
      title: "인플루언서 선정 가이드",
      description:
        "브랜드에 맞는 인플루언서를 선정하는 핵심 기준과 팁을 공유합니다.",
      author: "파트너십팀",
      date: "2026.04.01",
    },
    {
      id: "5",
      title: "ROI 극대화 전략",
      description:
        "제한된 예산으로 최대 성과를 내는 인플루언서 마케팅 전략을 알아봅니다.",
      author: "전략팀",
      date: "2026.03.28",
    },
  ],
};

const fallbackServices = [
  {
    id: "1",
    icon: "🔍",
    name: "인플루언서 매칭",
    description:
      "브랜드에 최적화된 인플루언서를 AI 기반으로 매칭하여 캠페인 성과를 극대화합니다.",
    link: "/services/matching",
  },
  {
    id: "2",
    icon: "📊",
    name: "캠페인 관리",
    description:
      "캠페인 기획부터 실행, 성과 분석까지 올인원 대시보드로 편리하게 관리하세요.",
    link: "/services/campaign",
  },
  {
    id: "3",
    icon: "🌏",
    name: "글로벌 네트워크",
    description:
      "한국, 일본, 중국, 동남아 등 아시아 전역의 인플루언서 네트워크에 접근하세요.",
    link: "/services/network",
  },
  {
    id: "4",
    icon: "📈",
    name: "성과 분석",
    description:
      "실시간 데이터 기반의 상세한 리포트로 캠페인 ROI를 정확히 측정합니다.",
    link: "/services/analytics",
  },
];

export default async function LandingTemplatePage() {
  const [config, sections, services] = await Promise.all([
    fetchAPI("/api/landing/config"),
    fetchAPI("/api/landing/sections"),
    fetchAPI("/api/landing/services"),
  ]);

  const cfg = config || fallbackConfig;
  const sectionList: any[] = sections || fallbackSections;
  const serviceList: any[] = services || fallbackServices;

  // For sections with has_carousel, fetch their cards
  const carouselSections = sectionList.filter((s: any) => s.has_carousel);
  const cardsMap: Record<number, any[]> = {};
  await Promise.all(
    carouselSections.map(async (s: any) => {
      const cards = await fetchAPI(`/api/landing/sections/${s.id}/cards`);
      cardsMap[s.id] = cards || (fallbackCards[s.id] ?? []);
    })
  );

  // Parse footer links from config (may be JSON string or array)
  const footerLinks =
    cfg.footer_links && typeof cfg.footer_links === "string"
      ? JSON.parse(cfg.footer_links)
      : cfg.footer_links || fallbackConfig.footer_links;

  return (
    <main className="w-full">
      {/* 1. Promo Bar */}
      {cfg.promo_bar_active && (
        <PromoBar
          text={cfg.promo_bar_text}
          ctaText={cfg.promo_bar_cta_text || "찾아보기"}
          ctaLink={cfg.promo_bar_cta_link || "/signup"}
          bgColor={cfg.promo_bar_bg_color || "var(--color-landing-dark)"}
        />
      )}

      {/* 2. Hero Section */}
      <HeroSection
        title={cfg.hero_title || fallbackConfig.hero_title}
        subtitle={cfg.hero_subtitle || fallbackConfig.hero_subtitle}
        ctaText={cfg.hero_cta_text || fallbackConfig.hero_cta_text}
        ctaLink={cfg.hero_cta_link || fallbackConfig.hero_cta_link}
      />

      {/* 3. Sections — Feature sections and carousels */}
      {sectionList.map((section: any) =>
        section.has_carousel ? (
          <CardCarousel
            key={section.id}
            title={section.heading}
            subtitle={section.description}
            cards={(cardsMap[section.id] || []).map((card: any) => ({
              id: String(card.id),
              title: card.title,
              description: card.description,
              author: card.author,
              date: card.date,
            }))}
          />
        ) : (
          <FeatureSection
            key={section.id}
            sectionTitle={section.section_title}
            heading={section.heading}
            description={section.description}
            ctaText={section.cta_text}
            ctaLink={section.cta_link}
            reversed={section.reversed}
            bgColor={section.bg_color}
            accentColor={section.accent_color}
          />
        )
      )}

      {/* 4. Service Grid */}
      <ServiceGrid
        title="Our Services"
        services={serviceList.map((svc: any) => ({
          id: String(svc.id),
          icon: svc.icon,
          name: svc.name || svc.title,
          description: svc.description,
          link: svc.link,
        }))}
      />

      {/* 5. Landing Footer */}
      <LandingFooter
        companyName={cfg.footer_company_name || fallbackConfig.footer_company_name}
        phone={cfg.footer_phone || fallbackConfig.footer_phone}
        address={cfg.footer_address || fallbackConfig.footer_address}
        bizNumber={cfg.footer_biz_number || fallbackConfig.footer_biz_number}
        links={footerLinks}
      />
    </main>
  );
}
