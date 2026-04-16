import PromoBar from "@/components/templates/landing/PromoBar";
import HeroSection from "@/components/templates/landing/HeroSection";
import FeatureSection from "@/components/templates/landing/FeatureSection";
import CardCarousel from "@/components/templates/landing/CardCarousel";
import ServiceGrid from "@/components/templates/landing/ServiceGrid";
import LandingFooter from "@/components/templates/landing/LandingFooter";

const demoCards = [
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
];

const demoServices = [
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

const footerLinks = [
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "사업자 정보", href: "/company" },
  { label: "고객센터", href: "/support" },
];

export default function LandingTemplatePage() {
  return (
    <main className="w-full">
      {/* 1. Promo Bar */}
      <PromoBar
        text="지금 가입하면 첫 캠페인 30% 할인!"
        ctaText="찾아보기"
        ctaLink="/signup"
        bgColor="var(--color-landing-dark)"
      />

      {/* 2. Hero Section */}
      <HeroSection
        title="Where Beauty Meets Influence"
        subtitle="K-뷰티 브랜드와 글로벌 인플루언서를 연결합니다"
        ctaText="서비스 둘러보기"
        ctaLink="/services"
      />

      {/* 3. Feature Section — Normal */}
      <FeatureSection
        sectionTitle="INFLUENCER MATCHING"
        heading="최적의 인플루언서를 만나보세요"
        description="AI 기반 매칭 시스템이 브랜드 가치와 타겟 오디언스에 맞는 인플루언서를 추천합니다. 수천 명의 검증된 크리에이터 풀에서 최적의 파트너를 찾아드립니다."
        ctaText="매칭 시작하기"
        ctaLink="/matching"
      />

      {/* 4. Feature Section — Reversed */}
      <FeatureSection
        sectionTitle="CAMPAIGN MANAGEMENT"
        heading="캠페인을 한곳에서 관리하세요"
        description="기획, 계약, 콘텐츠 검수, 성과 분석까지 캠페인의 모든 과정을 하나의 플랫폼에서 관리하세요. 복잡한 프로세스를 심플하게."
        ctaText="캠페인 관리 알아보기"
        ctaLink="/campaign"
        reversed
        bgColor="var(--color-landing-bg-alt)"
        accentColor="var(--color-landing-accent)"
      />

      {/* 5. Card Carousel */}
      <CardCarousel
        title="인사이트 & 트렌드"
        subtitle="최신 K-뷰티 마케팅 트렌드와 성공 사례를 확인하세요"
        cards={demoCards}
      />

      {/* 6. Service Grid */}
      <ServiceGrid title="Our Services" services={demoServices} />

      {/* 7. Landing Footer */}
      <LandingFooter
        companyName="LINKON Inc."
        phone="02-1234-5678"
        address="서울특별시 강남구 테헤란로 123, 4층"
        bizNumber="123-45-67890"
        links={footerLinks}
      />
    </main>
  );
}
