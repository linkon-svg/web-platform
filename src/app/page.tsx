'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';
import HeroSection from '@/components/templates/hospital/HeroSection';
import PhilosophySection from '@/components/templates/hospital/PhilosophySection';
import TreatmentSlider from '@/components/templates/hospital/TreatmentSlider';
import CTASection from '@/components/templates/hospital/CTASection';
import SpaceCarousel from '@/components/templates/hospital/SpaceCarousel';
import MapSection from '@/components/templates/hospital/MapSection';
import Button from '@/components/common/Button';
import Loading from '@/components/common/Loading';
import type { Treatment } from '@/types/hospital';

export default function Home() {
  const [featuredTreatments, setFeaturedTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/hospitals/1/treatments`)
      .then((res) => res.json())
      .then((data) => {
        const items = Array.isArray(data) ? data : [];
        setFeaturedTreatments(items.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroSection />

      <PhilosophySection />

      <TreatmentSlider />

      <CTASection />

      {/* Featured Treatment Cards */}
      <section className="section-padding bg-hospital-cream">
        <div className="section-narrow">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-hospital-dark">
              Popular Treatment
            </h2>
            <p className="mt-2 text-sm text-hospital-gray">
              예피다의 인기 시술을 소개합니다
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="md" />
            </div>
          ) : featuredTreatments.length === 0 ? (
            <div className="text-center py-12 text-hospital-gray">
              아직 등록된 시술이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTreatments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image or placeholder */}
                  {item.image_url ? (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={`${API_BASE}${item.image_url}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-hospital-beige via-hospital-gold-light/30 to-hospital-cream flex items-center justify-center">
                      <span className="font-serif text-2xl text-hospital-gold/40 italic">
                        {item.name}
                      </span>
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs text-hospital-gold tracking-wide uppercase">
                      {item.category ?? '기타'}
                    </span>
                    <h3 className="mt-1 text-lg font-medium text-hospital-dark">
                      {item.name}
                    </h3>
                    <p className="mt-2 text-sm text-hospital-gray leading-relaxed line-clamp-3">
                      {item.description ?? ''}
                    </p>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        자세히 보기
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <SpaceCarousel />

      <MapSection />
    </>
  );
}
