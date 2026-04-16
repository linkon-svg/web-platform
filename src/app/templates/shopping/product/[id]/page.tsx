"use client";

import { use, useState, useEffect } from "react";
import PromoBanner from "@/components/templates/shopping/PromoBanner";
import ShopHeader from "@/components/templates/shopping/ShopHeader";
import ShopFooter from "@/components/templates/shopping/ShopFooter";

const API_BASE = "http://localhost:8000";

const defaultColors = [
  { name: "블랙", hex: "#000000" },
  { name: "그레이", hex: "#888888" },
  { name: "네이비", hex: "#1a1a3e" },
];

const defaultSizes = ["S", "M", "L", "XL"];

const defaultMaterial = "울 90%, 캐시미어 10% / 안감: 폴리에스터 100%";
const defaultShipping =
  "주문 후 1-3일 이내 발송 / 무료 배송 / 수령 후 14일 이내 무료 반품 가능";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("description");

  useEffect(() => {
    fetch(`${API_BASE}/api/shopping/products/${id}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
        <PromoBanner messages={["전 상품 무료 배송 & 무료 반품"]} />
        <ShopHeader />
        <div className="px-6 lg:px-12 py-12 lg:py-20 text-center">
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              color: "var(--color-shop-text-secondary, #999)",
            }}
          >
            로딩 중...
          </p>
        </div>
        <ShopFooter />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
        <PromoBanner messages={["전 상품 무료 배송 & 무료 반품"]} />
        <ShopHeader />
        <div className="px-6 lg:px-12 py-12 lg:py-20 text-center">
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              color: "var(--color-shop-text-secondary, #999)",
            }}
          >
            상품을 찾을 수 없습니다
          </p>
        </div>
        <ShopFooter />
      </div>
    );
  }

  const colors = defaultColors;
  const sizes = defaultSizes;
  const images: string[] =
    product.images && product.images.length > 0 ? product.images : [];
  const hasImages = images.length > 0;

  return (
    <div style={{ backgroundColor: "var(--color-shop-bg, #FFF)" }}>
      <PromoBanner messages={["전 상품 무료 배송 & 무료 반품", "신규 회원 10% 할인"]} />
      <ShopHeader />

      <div className="px-6 lg:px-12 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Left: Images (60%) */}
          <div className="lg:w-[60%] flex flex-col gap-2">
            {hasImages
              ? images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                ))
              : [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-full aspect-[3/4]"
                    style={{
                      backgroundColor:
                        "var(--color-shop-bg-product, #F0F0F0)",
                    }}
                  />
                ))}
          </div>

          {/* Right: Product info (40%) */}
          <div className="lg:w-[40%] lg:sticky lg:top-[80px] lg:self-start">
            {/* Product ID breadcrumb */}
            <p
              className="text-[10px] uppercase mb-6"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.15em",
                color: "var(--color-shop-text-secondary, #999)",
              }}
            >
              상품 #{id}
            </p>

            {/* Name */}
            <h1
              className="text-lg font-light mb-2"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                color: "var(--color-shop-text, #000)",
              }}
            >
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-8">
              {product.sale_price ? (
                <>
                  <p
                    className="text-sm line-through"
                    style={{
                      fontFamily:
                        "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                      color: "var(--color-shop-text-secondary, #999)",
                    }}
                  >
                    KRW {product.price.toLocaleString()}
                  </p>
                  <p
                    className="text-base"
                    style={{
                      fontFamily:
                        "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                      color: "var(--color-shop-text, #000)",
                    }}
                  >
                    KRW {product.sale_price.toLocaleString()}
                  </p>
                </>
              ) : (
                <p
                  className="text-base"
                  style={{
                    fontFamily:
                      "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                    color: "var(--color-shop-text, #000)",
                  }}
                >
                  KRW {product.price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Color selector */}
            <div className="mb-6">
              <p
                className="text-xs mb-3"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  color: "var(--color-shop-text-secondary, #999)",
                }}
              >
                컬러: {colors[selectedColor].name}
              </p>
              <div className="flex gap-3">
                {colors.map((color, i) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(i)}
                    className="w-8 h-8 rounded-full border-2 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    style={{
                      borderColor:
                        i === selectedColor
                          ? "var(--color-shop-border-dark, #000)"
                          : "var(--color-shop-border, #E5E5E5)",
                    }}
                    aria-label={color.name}
                  >
                    <span
                      className="w-5 h-5 rounded-full block"
                      style={{ backgroundColor: color.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p
                className="text-xs mb-3"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  color: "var(--color-shop-text-secondary, #999)",
                }}
              >
                사이즈
              </p>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="min-h-[44px] min-w-[44px] px-4 flex items-center justify-center border text-xs transition-colors"
                    style={{
                      fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                      letterSpacing: "0.1em",
                      borderColor:
                        size === selectedSize
                          ? "var(--color-shop-border-dark, #000)"
                          : "var(--color-shop-border, #E5E5E5)",
                      backgroundColor:
                        size === selectedSize
                          ? "var(--color-shop-black, #000)"
                          : "transparent",
                      color:
                        size === selectedSize
                          ? "var(--color-shop-white, #FFF)"
                          : "var(--color-shop-text, #000)",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p
                className="text-xs mb-3"
                style={{
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  color: "var(--color-shop-text-secondary, #999)",
                }}
              >
                수량
              </p>
              <div
                className="inline-flex items-center border"
                style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm"
                >
                  &minus;
                </button>
                <span
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm border-x"
                  style={{
                    borderColor: "var(--color-shop-border, #E5E5E5)",
                    fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart + wishlist */}
            <div className="flex gap-2 mb-3">
              <button
                className="flex-1 min-h-[44px] flex items-center justify-center text-xs transition-colors"
                style={{
                  backgroundColor: "var(--color-shop-black, #000)",
                  color: "var(--color-shop-white, #FFF)",
                  fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                  letterSpacing: "0.15em",
                }}
              >
                장바구니
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center border text-lg"
                style={{
                  borderColor: "var(--color-shop-border, #E5E5E5)",
                  color: wishlisted
                    ? "var(--color-shop-wishlist, #FF0000)"
                    : "var(--color-shop-text, #000)",
                }}
                aria-label="위시리스트"
              >
                {wishlisted ? "\u2665" : "\u2661"}
              </button>
            </div>

            {/* Buy now */}
            <button
              className="w-full min-h-[44px] flex items-center justify-center text-xs border transition-colors"
              style={{
                borderColor: "var(--color-shop-border-dark, #000)",
                color: "var(--color-shop-text, #000)",
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                letterSpacing: "0.15em",
              }}
            >
              바로 구매
            </button>

            {/* Accordion sections */}
            <div className="mt-10">
              {[
                {
                  key: "description",
                  title: "상품 설명",
                  content: product.description || "",
                },
                { key: "material", title: "소재 정보", content: defaultMaterial },
                { key: "shipping", title: "배송 및 반품", content: defaultShipping },
              ].map((section) => (
                <div
                  key={section.key}
                  className="border-t py-4"
                  style={{ borderColor: "var(--color-shop-border, #E5E5E5)" }}
                >
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between min-h-[44px] text-xs"
                    style={{
                      fontFamily:
                        "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                      letterSpacing: "0.1em",
                      color: "var(--color-shop-text, #000)",
                    }}
                  >
                    <span>{section.title}</span>
                    <span>{openSection === section.key ? "\u2212" : "+"}</span>
                  </button>
                  {openSection === section.key && (
                    <p
                      className="mt-3 text-xs font-light leading-relaxed"
                      style={{
                        fontFamily:
                          "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                        color: "var(--color-shop-text-secondary, #999)",
                      }}
                    >
                      {section.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ShopFooter />
    </div>
  );
}
