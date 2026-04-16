import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ProductGrid from "@/components/templates/shopping/ProductGrid";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

const demoProducts = [
  { id: "1", name: "오버사이즈 울 코트", price: 598000 },
  { id: "2", name: "캐시미어 니트 스웨터", price: 298000 },
  { id: "3", name: "와이드 테일러드 팬츠", price: 248000 },
  { id: "4", name: "실크 블렌드 셔츠", price: 198000 },
  { id: "5", name: "미니멀 레더 백", price: 458000 },
  { id: "6", name: "더블 브레스티드 재킷", price: 498000 },
  { id: "7", name: "메리노 울 터틀넥", price: 178000 },
  { id: "8", name: "스트레이트 핏 데님", price: 228000 },
  { id: "9", name: "코튼 저지 티셔츠", price: 98000 },
  { id: "10", name: "나일론 윈드브레이커", price: 348000 },
  { id: "11", name: "울 블렌드 머플러", price: 128000 },
  { id: "12", name: "스트럭처드 토트백", price: 378000 },
];

export default function ShopListPage() {
  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"]} />
      <ShopHeader />
      <ProductGrid title="쇼핑" products={demoProducts} showFilter />
      <ShopFooter />
    </div>
  );
}
