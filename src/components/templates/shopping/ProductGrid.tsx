"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  currency?: string;
}

interface ProductGridProps {
  title?: string;
  products: Product[];
  showFilter?: boolean;
}

export default function ProductGrid({
  title = "쇼핑",
  products,
  showFilter = true,
}: ProductGridProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;
  const totalPages = Math.ceil(products.length / perPage);
  const pagedProducts = products.slice(
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

      {/* Filter panel placeholder */}
      {filterOpen && (
        <div
          className="mb-8 pb-8 border-b flex flex-wrap gap-6 text-xs"
          style={{
            borderColor: "var(--color-shop-border, #E5E5E5)",
            fontFamily: "var(--font-shop-sans, 'Noto Sans KR', sans-serif)",
            color: "var(--color-shop-text-secondary, #999)",
          }}
        >
          <span className="cursor-pointer hover:text-black transition-colors">전체</span>
          <span className="cursor-pointer hover:text-black transition-colors">아우터</span>
          <span className="cursor-pointer hover:text-black transition-colors">상의</span>
          <span className="cursor-pointer hover:text-black transition-colors">하의</span>
          <span className="cursor-pointer hover:text-black transition-colors">액세서리</span>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {pagedProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
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
