import Link from "next/link";
import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ProductCard from "@/components/templates/shopping/ProductCard";
import SeasonBanner from "@/components/templates/shopping/SeasonBanner";
import CategoryBanner from "@/components/templates/shopping/CategoryBanner";
import NewsCarousel from "@/components/templates/shopping/NewsCarousel";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

const newProducts = [
  { id: "1", name: "오버사이즈 울 코트", price: 598000 },
  { id: "2", name: "캐시미어 니트 스웨터", price: 298000 },
  { id: "3", name: "와이드 테일러드 팬츠", price: 248000 },
  { id: "4", name: "실크 블렌드 셔츠", price: 198000 },
  { id: "5", name: "미니멀 레더 백", price: 458000 },
];

const recommendedProducts = [
  { id: "6", name: "더블 브레스티드 재킷", price: 498000 },
  { id: "7", name: "메리노 울 터틀넥", price: 178000 },
  { id: "8", name: "스트레이트 핏 데님", price: 228000 },
  { id: "9", name: "코튼 저지 티셔츠", price: 98000 },
  { id: "10", name: "나일론 윈드브레이커", price: 348000 },
  { id: "11", name: "울 블렌드 머플러", price: 128000 },
];

const categories = [
  { title: "아우터", description: "코트, 재킷, 점퍼", link: "/templates/shopping/shop" },
  { title: "상의", description: "셔츠, 니트, 티셔츠", link: "/templates/shopping/shop" },
  { title: "하의", description: "팬츠, 데님, 쇼츠", link: "/templates/shopping/shop" },
  { title: "액세서리", description: "가방, 머플러, 모자", link: "/templates/shopping/shop" },
];

const newsItems = [
  { id: "n1", title: "2026 S/S 컬렉션 공개", category: "소식" },
  { id: "n2", title: "압구정 플래그십 스토어 리뉴얼", category: "매장" },
  { id: "n3", title: "지속 가능한 패션을 향하여", category: "캠페인" },
  { id: "n4", title: "봄 스타일링 가이드", category: "소식" },
  { id: "n5", title: "한정판 캡슐 컬렉션", category: "소식" },
  { id: "n6", title: "아트 콜라보레이션 시리즈", category: "캠페인" },
  { id: "n7", title: "글로벌 팝업 스토어 오픈", category: "매장" },
  { id: "n8", title: "비하인드 더 브랜드: 장인의 손길", category: "캠페인" },
];

export default function ShoppingHomePage() {
  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      {/* 1. Promo Banner */}
      <PromoBanner messages={["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"]} />

      {/* 2. Header */}
      <ShopHeader />

      {/* 3. Hero — 2-column split */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div
          className="aspect-[3/4] md:aspect-auto md:min-h-[80vh] relative"
          style={{ backgroundColor: "#E8E8E8" }}
        >
          <div className="absolute bottom-8 left-8">
            <p
              className="text-xs uppercase mb-2"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.2em",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              NEW ARRIVAL
            </p>
            <h2
              className="text-3xl lg:text-5xl font-light"
              style={{
                fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
                color: "var(--color-shop-text, #000)",
              }}
            >
              Spring Essentials
            </h2>
          </div>
        </div>
        <div
          className="aspect-[3/4] md:aspect-auto md:min-h-[80vh] relative"
          style={{ backgroundColor: "#D5D5D5" }}
        >
          <div className="absolute bottom-8 left-8">
            <p
              className="text-xs uppercase mb-2"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.2em",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              LOOKBOOK
            </p>
            <h2
              className="text-3xl lg:text-5xl font-light"
              style={{
                fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
                color: "var(--color-shop-text, #000)",
              }}
            >
              Modern Tailoring
            </h2>
          </div>
        </div>
      </section>

      {/* 4. New Products — horizontal scroll */}
      <section className="py-20 lg:py-28">
        <div className="px-6 lg:px-12 flex items-end justify-between mb-10">
          <h2
            className="text-3xl lg:text-4xl font-light"
            style={{
              fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
              color: "var(--color-shop-text, #000)",
            }}
          >
            새로운 상품
          </h2>
          <Link
            href="/templates/shopping/shop"
            className="text-xs min-h-[44px] flex items-center transition-opacity hover:opacity-60"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              letterSpacing: "0.1em",
              color: "var(--color-shop-text-secondary, #999)",
            }}
          >
            더 많은 상품 보기 &rarr;
          </Link>
        </div>
        <div
          className="flex gap-4 lg:gap-6 overflow-x-auto px-6 lg:px-12 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {newProducts.map((product) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-64 lg:w-72">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Season Banner */}
      <SeasonBanner
        subtitle="선물 제안"
        heading="2026 봄-여름"
        description="새로운 시즌, 새로운 실루엣. 정교한 테일러링과 유연한 소재가 만들어내는 모던 스타일."
        ctaText="컬렉션 보기"
        ctaLink="/templates/shopping/shop"
      />

      {/* 6. Recommended Products — 3-col grid */}
      <section className="py-20 lg:py-28 px-6 lg:px-12">
        <div className="mb-2">
          <h2
            className="text-3xl lg:text-4xl font-light"
            style={{
              fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
              color: "var(--color-shop-text, #000)",
            }}
          >
            추천 상품
          </h2>
          <p
            className="text-xs mt-2"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              letterSpacing: "0.1em",
              color: "var(--color-shop-text-secondary, #999)",
            }}
          >
            타임리스 에센셜 컬렉션
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-10">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* 7. Category Banners — 2x2 grid */}
      <section className="px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <CategoryBanner key={cat.title} {...cat} />
          ))}
        </div>
      </section>

      {/* 8. News Carousel */}
      <NewsCarousel title="새로운 소식" items={newsItems} />

      {/* 9. Footer */}
      <ShopFooter />
    </div>
  );
}
