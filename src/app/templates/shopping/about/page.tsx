import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"]} />
      <ShopHeader />

      <section className="px-6 lg:px-12 py-20 lg:py-28">
        {/* Hero */}
        <div className="mb-20 lg:mb-28">
          <h1
            className="text-4xl lg:text-7xl font-light mb-6"
            style={{
              fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
              color: "var(--color-shop-text, #000)",
            }}
          >
            The House of SOLID
          </h1>
          <p
            className="text-xs uppercase"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              letterSpacing: "0.2em",
              color: "var(--color-shop-text-secondary, #999)",
            }}
          >
            SINCE 2010
          </p>
        </div>

        {/* Full-width image placeholder */}
        <div
          className="w-full aspect-[21/9] mb-20 lg:mb-28"
          style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
        />

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
          <div>
            <h2
              className="text-2xl lg:text-3xl font-light mb-8"
              style={{
                fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
                color: "var(--color-shop-text, #000)",
              }}
            >
              브랜드 철학
            </h2>
            <p
              className="text-sm font-light leading-loose mb-6"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              SOLID는 본질에 집중합니다. 불필요한 장식을 덜어내고, 순수한 형태와 최상의 소재만으로
              완성되는 옷을 추구합니다. 우리의 디자인은 시간이 흘러도 변하지 않는 가치를 담고 있습니다.
            </p>
            <p
              className="text-sm font-light leading-loose"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              2010년 서울에서 시작된 SOLID는 한국적 미니멀리즘과 유럽의 정통 테일러링을 결합하여
              독자적인 스타일을 만들어 왔습니다. 매 시즌 새로움을 추구하되, 브랜드의 근본적인
              정체성을 잃지 않는 것이 우리의 원칙입니다.
            </p>
          </div>
          <div
            className="aspect-[3/4]"
            style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
          />
        </div>

        {/* Second section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-28">
          <div
            className="aspect-[3/4] lg:order-1"
            style={{ backgroundColor: "#E0E0E0" }}
          />
          <div className="lg:order-2">
            <h2
              className="text-2xl lg:text-3xl font-light mb-8"
              style={{
                fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
                color: "var(--color-shop-text, #000)",
              }}
            >
              장인 정신
            </h2>
            <p
              className="text-sm font-light leading-loose mb-6"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              모든 SOLID 제품은 엄격하게 선별된 원단과 숙련된 장인의 손에서 탄생합니다.
              이탈리아와 일본의 최고급 원단 공급처와 협력하며, 한 벌의 옷이 완성되기까지
              수십 번의 피팅과 검수를 거칩니다.
            </p>
            <p
              className="text-sm font-light leading-loose"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              지속 가능한 패션을 위해 과잉 생산을 지양하고, 소량 생산 원칙을 고수합니다.
              하나의 제품이 오랜 시간 함께할 수 있도록, 내구성과 아름다움 모두를 충족시키는
              것이 SOLID의 약속입니다.
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="text-center py-16 lg:py-24">
          <blockquote
            className="text-2xl lg:text-4xl font-light italic max-w-3xl mx-auto"
            style={{
              fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
              color: "var(--color-shop-text, #000)",
              lineHeight: 1.6,
            }}
          >
            &ldquo;Less, but better.&rdquo;
          </blockquote>
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
