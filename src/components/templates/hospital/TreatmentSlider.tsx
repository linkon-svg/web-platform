'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import type { Treatment } from '@/types/hospital';

export default function TreatmentSlider() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    fetch(`${API_BASE}/api/hospitals/1/treatments`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setTreatments(items);
        if (items.length > 0) {
          const cats = [...new Set(items.map((t: Treatment) => t.category).filter(Boolean))] as string[];
          if (cats.length > 0) setActiveCategory(cats[0]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(treatments.map((t) => t.category).filter(Boolean))] as string[];
  const filtered = treatments.filter((t) => t.category === activeCategory);

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="section-narrow">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-hospital-dark">
              Treatment
            </h2>
            <p className="mt-2 text-sm text-hospital-gray">
              예피다만의 전문 시술을 만나보세요
            </p>
          </div>
          <div className="flex justify-center">
            <Loading size="md" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="section-narrow">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-hospital-dark">
            Treatment
          </h2>
          <p className="mt-2 text-sm text-hospital-gray">
            예피다만의 전문 시술을 만나보세요
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-sm rounded-sm transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-hospital-gold text-white'
                  : 'bg-hospital-cream text-hospital-gray hover:bg-hospital-beige'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Treatment Cards - horizontal scroll */}
        <div className="snap-x-container gap-5 pb-4">
          {filtered.map((treatment) => (
            <div
              key={treatment.id}
              className="w-[300px] md:w-[360px] bg-hospital-cream rounded-sm overflow-hidden group"
            >
              {/* Image or placeholder */}
              {treatment.image_url ? (
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={`${API_BASE}${treatment.image_url}`}
                    alt={treatment.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gradient-to-br from-hospital-beige via-hospital-gold-light/30 to-hospital-cream flex items-center justify-center">
                  <span className="font-serif text-2xl text-hospital-gold/50 italic">
                    {treatment.name}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <span className="text-xs text-hospital-gold tracking-wide uppercase">
                  {treatment.category ?? '기타'}
                </span>
                <h3 className="mt-1 text-lg font-medium text-hospital-dark">
                  {treatment.name}
                </h3>
                <p className="mt-2 text-sm text-hospital-gray leading-relaxed line-clamp-3">
                  {treatment.description ?? ''}
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    예약하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
