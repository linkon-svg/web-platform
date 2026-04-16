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
  const [products, config, rawCategories] = await Promise.all([
    fetchAPI("/api/shopping/products"),
    fetchAPI("/api/shopping/config"),
    fetchAPI("/api/shopping/categories"),
  ]);

  const categoriesMap: Record<number, string> = {};
  (rawCategories || []).forEach((c: any) => {
    categoriesMap[c.id] = c.name;
  });

  const categoriesList = (rawCategories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
  }));

  const productList = (products || []).map((p: any) => ({
    id: String(p.id),
    name: p.name,
    price: p.price,
    salePrice: p.sale_price || undefined,
    thumbnail: p.thumbnail || undefined,
    isNew: p.is_new || false,
    isRecommended: p.is_recommended || false,
    categoryId: p.category_id || undefined,
    categoryName: categoriesMap[p.category_id] || undefined,
  }));

  const promoMessages = config?.promo_text
    ? [config.promo_text]
    : ["전 상품 무료 배송 & 무료 반품"];

  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={promoMessages} />
      <ShopHeader />
      <ProductGrid title="쇼핑" products={productList} showFilter categories={categoriesList} />
      <ShopFooter />
    </div>
  );
}
