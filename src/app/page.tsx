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

const API_BASE_URL = 'http://localhost:8000';

async function fetchAPI(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const FALLBACK_TREATMENTS = [
  {
    name: 'Juvelook',
    category: '스킨부스터',
    description:
      'PDLLA 기반의 차세대 스킨부스터로, 콜라겐 재생을 촉진하여 피부 탄력과 볼륨을 자연스럽게 개선합니다.',
  },
  {
    name: 'Exosome',
    category: '재생 치료',
    description:
      '엑소좀을 활용한 첨단 재생 시술로, 피부 세포 간 신호 전달을 최적화하여 근본적인 피부 개선을 돕습니다.',
  },
  {
    name: 'Rejuran',
    category: '스킨부스터',
    description:
      '연어 유래 PN(폴리뉴클레오타이드) 성분이 피부 재생을 촉진하여 피부결과 탄력을 회복시킵니다.',
  },
];

export default async function Home() {
  const [hospital, treatments, promotions, spaces, philosophies] = await Promise.all([
    fetchAPI('/api/hospitals/1'),
    fetchAPI('/api/hospitals/1/treatments'),
    fetchAPI('/api/hospitals/1/promotions'),
    fetchAPI('/api/hospitals/1/spaces'),
    fetchAPI('/api/hospitals/1/philosophy'),
  ]);

  const featuredTreatments = treatments && treatments.length > 0
    ? treatments.map((t: { id?: number; name: string; category?: string; description?: string; image_url?: string }) => ({
        id: t.id,
        name: t.name,
        category: t.category || '',
        description: t.description || '',
        image_url: t.image_url,
      }))
    : FALLBACK_TREATMENTS;

  const spaceItems = spaces && spaces.length > 0
    ? spaces.map((s: { image_url: string; caption?: string }, idx: number) => ({
        label: s.caption || `공간 ${idx + 1}`,
        gradient: 'from-hospital-beige to-hospital-cream',
        image_url: s.image_url,
      }))
    : undefined;

  return (
    <>
      <HeroSection
        title={hospital?.name_en || hospital?.name || 'YEPIDA CLINIC'}
        subtitle="당신의 아름다움이 피어나는 곳"
      />

      <PhilosophySection philosophies={philosophies} />

      <TreatmentSlider treatments={treatments} />

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

          {featuredTreatments.length === 0 ? (
            <div className="text-center py-12 text-hospital-gray">
              아직 등록된 시술이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredTreatments.slice(0, 3).map((item: { id?: number; name: string; category: string; description: string; image_url?: string }, idx: number) => (
                <div
                  key={item.id ?? idx}
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

      <SpaceCarousel spaces={spaceItems} />

      <MapSection />
    </>
  );
}
