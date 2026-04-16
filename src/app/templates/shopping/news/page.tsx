import Link from "next/link";
import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

const newsItems = [
  { id: "1", title: "2026 S/S 컬렉션 공개", category: "소식" },
  { id: "2", title: "압구정 플래그십 스토어 리뉴얼 오픈", category: "매장" },
  { id: "3", title: "지속 가능한 패션을 향하여", category: "캠페인" },
  { id: "4", title: "봄 스타일링 가이드: 레이어링의 기술", category: "소식" },
  { id: "5", title: "한정판 캡슐 컬렉션 출시", category: "소식" },
  { id: "6", title: "아트 콜라보레이션 시리즈 Vol.3", category: "캠페인" },
  { id: "7", title: "도쿄 팝업 스토어 오픈 안내", category: "매장" },
  { id: "8", title: "비하인드 더 브랜드: 장인의 손길", category: "캠페인" },
  { id: "9", title: "SOLID x 서울패션위크 2026", category: "소식" },
];

export default function NewsPage() {
  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"]} />
      <ShopHeader />

      <section className="px-6 lg:px-12 py-20 lg:py-28">
        <h1
          className="text-4xl lg:text-6xl font-light mb-16 lg:mb-20"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            color: "var(--color-shop-text, #000)",
          }}
        >
          소식
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {newsItems.map((item) => (
            <Link key={item.id} href="#" className="group block">
              {/* Image placeholder */}
              <div
                className="w-full aspect-[4/3] mb-4 transition-all duration-500 group-hover:brightness-90"
                style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
              />
              {/* Category */}
              <span
                className="text-[10px] uppercase mb-2 inline-block"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  letterSpacing: "0.15em",
                  color: "var(--color-shop-text-secondary, #999)",
                }}
              >
                {item.category}
              </span>
              {/* Title */}
              <h3
                className="text-sm font-light leading-snug"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  color: "var(--color-shop-text, #000)",
                }}
              >
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
