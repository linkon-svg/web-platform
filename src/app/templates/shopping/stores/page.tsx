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

export default async function StoresPage() {
  const [stores, config] = await Promise.all([
    fetchAPI('/api/shopping/stores'),
    fetchAPI('/api/shopping/config'),
  ]);

  const storeList = stores || [];
  const domesticStores = storeList.filter((s: any) => s.region === '국내');
  const internationalStores = storeList.filter((s: any) => s.region === '해외');
  const promoMessages = config?.promo_text
    ? [config.promo_text]
    : ["전 상품 무료 배송 & 무료 반품"];

  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={promoMessages} />
      <ShopHeader />

      <section className="px-6 lg:px-12 py-20 lg:py-28">
        <h1
          className="text-4xl lg:text-6xl font-light mb-20"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            color: "var(--color-shop-text, #000)",
          }}
        >
          매장
        </h1>

        {/* Domestic */}
        <div className="mb-20">
          <h2
            className="text-[10px] uppercase mb-10"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              letterSpacing: "0.2em",
              color: "var(--color-shop-text-secondary, #999)",
              fontWeight: 600,
            }}
          >
            국내 매장
          </h2>
          <div className="flex flex-col gap-10">
            {domesticStores.map((store: any) => (
              <div
                key={store.name}
                className="pb-10 border-b"
                style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
              >
                <h3
                  className="text-lg font-light mb-2"
                  style={{
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text, #000)",
                  }}
                >
                  {store.name}
                </h3>
                <p
                  className="text-xs font-light mb-1"
                  style={{
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text-secondary, #999)",
                  }}
                >
                  {store.address}
                </p>
                <p
                  className="text-xs font-light"
                  style={{
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text-secondary, #999)",
                  }}
                >
                  {store.phone}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* International */}
        <div>
          <h2
            className="text-[10px] uppercase mb-10"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              letterSpacing: "0.2em",
              color: "var(--color-shop-text-secondary, #999)",
              fontWeight: 600,
            }}
          >
            해외 매장
          </h2>
          <div className="flex flex-col gap-10">
            {internationalStores.map((store: any) => (
              <div
                key={store.name}
                className="pb-10 border-b"
                style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
              >
                <h3
                  className="text-lg font-light mb-2"
                  style={{
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text, #000)",
                  }}
                >
                  {store.name}
                </h3>
                <p
                  className="text-xs font-light mb-1"
                  style={{
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text-secondary, #999)",
                  }}
                >
                  {store.address}
                </p>
                <p
                  className="text-xs font-light"
                  style={{
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text-secondary, #999)",
                  }}
                >
                  {store.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ShopFooter />
    </div>
  );
}
