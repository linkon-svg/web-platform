'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';
import PromotionCard from '@/components/templates/hospital/PromotionCard';
import Loading from '@/components/common/Loading';
import type { Promotion } from '@/types/hospital';

export default function ExhibitionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/hospitals/1/promotions`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setPromotions(items.filter((p: Promotion) => p.is_active));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      <section className="section-padding bg-white">
        <div className="section-narrow">
          {/* Heading */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic">
              Promotion
            </h1>
            <p className="mt-4 text-base md:text-lg text-hospital-gray leading-relaxed max-w-lg mx-auto">
              예피다의원의 특별한 프로모션을 확인하세요
            </p>
          </div>

          {/* Promotion Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="md" />
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12 text-hospital-gray">
              현재 진행 중인 프로모션이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {promotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  title={promo.title}
                  imageUrl={promo.image_url ? `${API_BASE}${promo.image_url}` : undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
