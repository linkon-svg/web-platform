import Link from "next/link";
import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ProductCard from "@/components/templates/shopping/ProductCard";
import SeasonBanner from "@/components/templates/shopping/SeasonBanner";
import CategoryBanner from "@/components/templates/shopping/CategoryBanner";
import NewsCarousel from "@/components/templates/shopping/NewsCarousel";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

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

export default async function ShoppingHomePage() {
  const [config, rawNewProducts, rawRecommendedProducts, rawCategories, rawNews] =
    await Promise.all([
      fetchAPI("/api/shopping/config"),
      fetchAPI("/api/shopping/products?is_new=true"),
      fetchAPI("/api/shopping/products?is_recommended=true"),
      fetchAPI("/api/shopping/categories"),
      fetchAPI("/api/shopping/news"),
    ]);

  const newProducts = (rawNewProducts ?? []).map(
    (p: { id: number; name: string; price: number }) => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
    }),
  );

  const recommendedProducts = (rawRecommendedProducts ?? []).map(
    (p: { id: number; name: string; price: number }) => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
    }),
  );

  const categories = (rawCategories ?? []).map(
    (c: { name: string; description?: string }) => ({
      title: c.name,
      description: c.description || "",
      link: "/templates/shopping/shop",
    }),
  );

  const newsItems = (rawNews ?? []).map(
    (n: { id: number; title: string; category?: string }) => ({
      id: String(n.id),
      title: n.title,
      category: n.category || "소식",
    }),
  );

  const promoMessages = config?.promo_text
    ? [config.promo_text]
    : ["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"];

  const heroTitle = config?.hero_title ?? "Spring Essentials";
  const heroSubtitle = config?.hero_subtitle ?? "Modern Tailoring";

  const seasonSubtitle = config?.season_banner_subtitle ?? "선물 제안";
  const seasonTitle = config?.season_banner_title ?? "2026 봄-여름";
  const seasonDescription =
    config?.season_banner_description ??
    "새로운 시즌, 새로운 실루엣. 정교한 테일러링과 유연한 소재가 만들어내는 모던 스타일.";

  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      {/* 1. Promo Banner */}
      <PromoBanner messages={promoMessages} />

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
              {heroTitle}
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
              {heroSubtitle}
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
          {newProducts.map((product: { id: string; name: string; price: number }) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-64 lg:w-72">
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Season Banner */}
      <SeasonBanner
        subtitle={seasonSubtitle}
        heading={seasonTitle}
        description={seasonDescription}
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
          {recommendedProducts.map((product: { id: string; name: string; price: number }) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* 7. Category Banners — 2x2 grid */}
      <section className="px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {categories.map((cat: { title: string; description: string; link: string }) => (
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
