'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';
import Loading from '@/components/common/Loading';
import type { SpaceImage } from '@/types/hospital';

export default function SpacePage() {
  const [spaces, setSpaces] = useState<SpaceImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/hospitals/1/spaces`)
      .then((res) => res.json())
      .then((data) => setSpaces(Array.isArray(data) ? data : []))
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
              Yepida Place
            </h1>
            <p className="mt-4 text-base md:text-lg text-hospital-gray leading-relaxed max-w-lg mx-auto">
              편안하고 프라이빗한 공간에서
              <br />
              최상의 시술을 경험하세요
            </p>
          </div>

          {/* Space Gallery Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loading size="md" />
            </div>
          ) : spaces.length === 0 ? (
            <div className="text-center py-12 text-hospital-gray">
              등록된 공간 사진이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {spaces.map((space) => (
                <div
                  key={space.id}
                  className="aspect-[16/10] rounded-sm overflow-hidden relative group"
                >
                  {space.image_url ? (
                    <img
                      src={`${API_BASE}${space.image_url}`}
                      alt={space.caption ?? '공간 사진'}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-hospital-beige to-hospital-cream" />
                  )}
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-sm text-hospital-brown/60 font-medium">
                      {space.caption ?? ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
