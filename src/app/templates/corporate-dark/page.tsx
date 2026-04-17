import {
  CorporateDarkHeader,
  FullscreenHero,
  NewsSection,
  CareersSection,
  ProductCarousel,
  TeamGrid,
  CorporateDarkFooter,
  CookieBanner,
  ScrollFadeIn,
} from "@/components/templates/corporate/dark";

import type {
  NewsItem,
  CareerCard,
  ProductItem,
  TeamCard,
} from "@/components/templates/corporate/dark";

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

const fallbackNews: NewsItem[] = [
  {
    title: "크래프톤, 2024년 4분기 실적 발표 — 매출 전년 대비 32% 증가",
    date: "2024.12.15",
    href: "#",
  },
  {
    title: "배틀그라운드 모바일, 글로벌 누적 다운로드 15억 돌파",
    date: "2024.12.10",
    href: "#",
  },
  {
    title: "크래프톤, AI 기반 게임 개발 기술 연구소 신설",
    date: "2024.12.05",
    href: "#",
  },
];

const fallbackCareers: CareerCard[] = [
  {
    heading: "PEOPLE & LIFE",
    description:
      "자유로운 소통과 활발한 교류를 바탕으로 크래프톤만의 문화를 만들어 갑니다.",
    backgroundImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    href: "#",
  },
  {
    heading: "KRAFTON RECRUIT",
    description: "크래프톤의 최신 채용공고를 살펴보세요.",
    backgroundImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    href: "#",
  },
];

const fallbackProducts: ProductItem[] = [
  {
    thumbnail:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
    studio: "PUBG STUDIOS",
    title: "BATTLEGROUNDS",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&q=80",
    studio: "PUBG STUDIOS",
    title: "배틀그라운드 모바일",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b2b28?w=400&q=80",
    studio: "BLUEHOLE STUDIO",
    title: "테라",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
    studio: "RISINGWINGS",
    title: "골프킹",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&q=80",
    studio: "RISINGWINGS",
    title: "미니골프킹",
  },
  {
    thumbnail:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80",
    studio: "STRIKING DISTANCE",
    title: "칼리스토 프로토콜",
  },
];

const fallbackTeams: TeamCard[] = [
  {
    name: "PUBG STUDIOS",
    description: "배틀그라운드 시리즈를 만드는 글로벌 스튜디오",
    backgroundImage:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
  },
  {
    name: "Bluehole Studio",
    description: "MMORPG의 새로운 기준을 제시하는 스튜디오",
    backgroundImage:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&q=80",
  },
  {
    name: "RisingWings",
    description: "모바일 캐주얼 게임의 글로벌 리더",
    backgroundImage:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80",
  },
  {
    name: "Striking Distance Studios",
    description: "차세대 호러 서바이벌 게임을 개발하는 미국 스튜디오",
    backgroundImage:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&q=80",
  },
];

/* ─── Page ─── */

export default async function CorporateDarkPage() {
  const [config, news, careers, teams] = await Promise.all([
    fetchAPI("/api/corporate/config"),
    fetchAPI("/api/corporate/news?is_featured=true"),
    fetchAPI("/api/corporate/careers"),
    fetchAPI("/api/corporate/teams"),
  ]);

  /* Map API data to component props */
  const heroTitle = config?.company_name_en || "UNKNOWN STARTS HERE";
  const heroSubtitle =
    config?.vision_description ||
    "미지의 영역에 도전하며 새로운 경험을 만들어갑니다";
  const heroImage =
    config?.hero_media ||
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80";

  const newsItems: NewsItem[] = news
    ? (news as Array<Record<string, unknown>>).map((n) => ({
        title: (n.title as string) || "",
        date: n.published_at
          ? new Date(n.published_at as string).toLocaleDateString("ko-KR")
          : new Date(n.created_at as string).toLocaleDateString("ko-KR"),
        href: `/templates/corporate-dark/news`,
      }))
    : fallbackNews;

  const careerCards: CareerCard[] = careers
    ? (careers as Array<Record<string, unknown>>).map((c) => ({
        heading: (c.title as string) || "",
        description: (c.description as string) || "",
        backgroundImage:
          (c.image as string) ||
          "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
        href: (c.link as string) || "/templates/corporate-dark/careers",
      }))
    : fallbackCareers;

  const teamCards: TeamCard[] = teams
    ? (teams as Array<Record<string, unknown>>).map((t) => ({
        name: (t.name as string) || "",
        description: (t.description as string) || "",
        backgroundImage:
          (t.image as string) ||
          "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
        href: (t.link as string) || "#",
      }))
    : fallbackTeams;

  return (
    <main className="bg-black text-white">
      <CorporateDarkHeader logo={config?.company_name || "KRAFTON"} />

      <FullscreenHero
        backgroundImage={heroImage}
        title={heroTitle}
        subtitle={heroSubtitle}
      />

      <ScrollFadeIn>
        <NewsSection items={newsItems} />
      </ScrollFadeIn>

      <ScrollFadeIn delay={100}>
        <CareersSection cards={careerCards} />
      </ScrollFadeIn>

      <ScrollFadeIn direction="left">
        <ProductCarousel items={fallbackProducts} />
      </ScrollFadeIn>

      <ScrollFadeIn>
        <TeamGrid cards={teamCards} />
      </ScrollFadeIn>

      <CorporateDarkFooter />
      <CookieBanner />
    </main>
  );
}
