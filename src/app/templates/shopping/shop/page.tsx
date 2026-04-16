import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ProductGrid from "@/components/templates/shopping/ProductGrid";
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

export default async function ShopListPage() {
  const [products, config] = await Promise.all([
    fetchAPI("/api/shopping/products"),
    fetchAPI("/api/shopping/config"),
  ]);

  const productList = (products || []).map((p: any) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
  }));

  const promoMessages = config?.promo_text
    ? [config.promo_text]
    : ["전 상품 무료 배송 & 무료 반품"];

  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={promoMessages} />
      <ShopHeader />
      <ProductGrid title="쇼핑" products={productList} showFilter />
      <ShopFooter />
    </div>
  );
}
