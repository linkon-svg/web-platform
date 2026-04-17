'use client';

import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';

const DEFAULT_ADDRESS = '서울특별시 강남구 강남대로 424 (신사빌딩) 6층';

export default function MapSection() {
  const [address, setAddress] = useState(DEFAULT_ADDRESS);

  useEffect(() => {
    fetch(`${API_BASE}/api/hospitals/1`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch hospital');
        return res.json();
      })
      .then((data: { address?: string }) => {
        if (data.address) {
          setAddress(data.address);
        }
      })
      .catch(() => {
        // Fall back to hardcoded address (already set as default)
      });
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      alert('주소가 복사되었습니다.');
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = address;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('주소가 복사되었습니다.');
    }
  };

  const mapLinks = [
    {
      label: '네이버지도',
      href: `https://map.naver.com/v5/search/${encodeURIComponent(address)}`,
    },
    {
      label: '카카오맵',
      href: `https://map.kakao.com/?q=${encodeURIComponent(address)}`,
    },
    {
      label: '구글맵',
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="section-narrow">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-hospital-dark">
            Location
          </h2>
          <p className="mt-2 text-sm text-hospital-gray">
            오시는 길을 안내해 드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Placeholder */}
          <div className="aspect-square lg:aspect-auto lg:min-h-[400px] bg-hospital-beige rounded-sm flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-hospital-gold-light mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="text-sm text-hospital-gray-light">지도 영역</p>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-8">
            {/* Address */}
            <div>
              <h3 className="text-sm font-medium text-hospital-dark mb-2">주소</h3>
              <div className="flex items-start gap-3">
                <p className="text-sm text-hospital-gray flex-1">{address}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 text-xs text-hospital-gold hover:text-hospital-gold-dark transition-colors underline underline-offset-2 cursor-pointer"
                >
                  복사
                </button>
              </div>
            </div>

            {/* Transit */}
            <div>
              <h3 className="text-sm font-medium text-hospital-dark mb-3">대중교통</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-14 h-6 rounded-sm bg-green-600 text-white text-[10px] flex items-center justify-center font-medium">
                    지하철
                  </span>
                  <p className="text-sm text-hospital-gray">
                    신논현역 5번 출구 도보 3분
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-14 h-6 rounded-sm bg-blue-600 text-white text-[10px] flex items-center justify-center font-medium">
                    버스
                  </span>
                  <p className="text-sm text-hospital-gray">
                    신논현역 정류장 하차 (140, 144, 145, 471)
                  </p>
                </div>
              </div>
            </div>

            {/* Map Links */}
            <div>
              <h3 className="text-sm font-medium text-hospital-dark mb-3">지도 앱으로 열기</h3>
              <div className="flex flex-wrap gap-2">
                {mapLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200 ease-out cursor-pointer bg-transparent border border-hospital-gold text-hospital-gold hover:bg-hospital-gold hover:text-white min-h-[36px] px-4 py-2 text-sm"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
