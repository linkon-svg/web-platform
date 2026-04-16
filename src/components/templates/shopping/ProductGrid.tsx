"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  currency?: string;
  categoryId?: number;
  salePrice?: number;
  thumbnail?: string;
  isNew?: boolean;
  isRecommended?: boolean;
  categoryName?: string;
}

interface ProductGridProps {
  title?: string;
  products: Product[];
  showFilter?: boolean;
  categories?: { id: number; name: string }[];
}

export default function ProductGrid({
  title = "쇼핑",
  products,
  showFilter = true,
  categories,
}: ProductGridProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const perPage = 12;

  const filteredProducts = activeCategory
    ? products.filter(p => (p as any).categoryId === activeCategory)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / perPage);
  const pagedProducts = sortedProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <section className="px-6 lg:px-12 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2
          className="text-3xl lg:text-4xl font-light"
          style={{
            fontFamily: "var(--font-shop-serif, 'Cormorant Garamond', Georgia, serif)",
            color: "var(--color-shop-text, #000)",
          }}
        >
          {title}
        </h2>
        {showFilter && (
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="text-xs min-h-[44px] px-4 flex items-center border transition-colors"
            style={{
              letterSpacing: "0.1em",
              fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
              borderColor: "var(--color-shop-border, #E5E5E5)",
              color: "var(--color-shop-text, #000)",
            }}
          >
            필터 {filterOpen ? "−" : "+"}
          </button>
        )}
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div
          className="mb-8 pb-8 border-b flex flex-wrap items-center gap-6 text-xs"
          style={{
            borderColor: "var(--color-shop-border, #E5E5E5)",
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
          }}
        >
          <button
            onClick={() => { setActiveCategory(null); setCurrentPage(1); }}
            className="cursor-pointer transition-colors"
            style={{ color: activeCategory === null ? 'var(--color-shop-text, #000)' : 'var(--color-shop-text-secondary, #999)', fontWeight: activeCategory === null ? 600 : 300 }}>
            전체
          </button>
          {(categories || []).map(cat => (
            <button key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
              className="cursor-pointer transition-colors"
              style={{ color: activeCategory === cat.id ? 'var(--color-shop-text, #000)' : 'var(--color-shop-text-secondary, #999)', fontWeight: activeCategory === cat.id ? 600 : 300 }}>
              {cat.name}
            </button>
          ))}
          <span style={{ color: 'var(--color-shop-border, #E5E5E5)' }}>|</span>
          <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as any); setCurrentPage(1); }}
            className="bg-transparent text-xs cursor-pointer outline-none"
            style={{ color: 'var(--color-shop-text-secondary, #999)', fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)" }}>
            <option value="default">기본 정렬</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
          </select>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {pagedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
        {pagedProducts.length === 0 && (
          <div className="col-span-full py-20 text-center text-sm"
            style={{ color: 'var(--color-shop-text-secondary, #999)', fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)" }}>
            표시할 상품이 없습니다
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm disabled:opacity-30"
          >
            &#8592;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm transition-colors"
              style={{
                fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
                fontWeight: page === currentPage ? 700 : 300,
                color:
                  page === currentPage
                    ? "var(--color-shop-text, #000)"
                    : "var(--color-shop-text-secondary, #999)",
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-sm disabled:opacity-30"
          >
            &#8594;
          </button>
        </div>
      )}
    </section>
  );
}
