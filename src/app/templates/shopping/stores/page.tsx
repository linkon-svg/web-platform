import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

const domesticStores = [
  {
    name: "SOLID 압구정 플래그십",
    address: "서울특별시 강남구 압구정로 100, 1-3층",
    phone: "02-1234-5678",
  },
  {
    name: "SOLID 한남",
    address: "서울특별시 용산구 이태원로 200, 2층",
    phone: "02-2345-6789",
  },
];

const internationalStores = [
  {
    name: "SOLID Tokyo Aoyama",
    address: "5-12-3 Minami-Aoyama, Minato-ku, Tokyo, Japan",
    phone: "+81 3-1234-5678",
  },
  {
    name: "SOLID Shanghai",
    address: "No. 100 Huaihai Middle Road, Huangpu District, Shanghai, China",
    phone: "+86 21-1234-5678",
  },
  {
    name: "SOLID Paris Le Marais",
    address: "15 Rue des Francs Bourgeois, 75004 Paris, France",
    phone: "+33 1-1234-5678",
  },
];

export default function StoresPage() {
  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"]} />
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
            {domesticStores.map((store) => (
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
            {internationalStores.map((store) => (
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
