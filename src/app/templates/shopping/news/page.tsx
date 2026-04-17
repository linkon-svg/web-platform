import Link from "next/link";
import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

const API_BASE = 'http://localhost:8000';

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function NewsPage() {
  const [newsData, config] = await Promise.all([
    fetchAPI('/api/shopping/news'),
    fetchAPI('/api/shopping/config'),
  ]);

  const newsItems: { id: string; title: string; category: string; image?: string }[] = newsData || [];
  const promoMessages = config?.promo_text
    ? [config.promo_text]
    : ["전 상품 무료 배송 & 무료 반품"];

  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={promoMessages} />
      <ShopHeader shopName={config?.shop_name} />

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

        {newsItems.length === 0 ? (
          <p
            className="text-sm font-light"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              color: "var(--color-shop-text-secondary, #999)",
            }}
          >
            소식이 없습니다
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {newsItems.map((item) => (
              <Link key={item.id} href="#" className="group block">
                {/* Image */}
                {item.image ? (
                  <img
                    src={item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`}
                    alt={item.title}
                    className="w-full aspect-[4/3] object-cover mb-4 transition-all duration-500 group-hover:brightness-90"
                  />
                ) : (
                  <div
                    className="w-full aspect-[4/3] mb-4 transition-all duration-500 group-hover:brightness-90"
                    style={{ backgroundColor: "var(--color-shop-bg-product, #F0F0F0)" }}
                  />
                )}
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
        )}
      </section>

      <ShopFooter companyName={config?.shop_name_en || config?.shop_name} snsLinks={config?.sns_links} />
    </div>
  );
}
