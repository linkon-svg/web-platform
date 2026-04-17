'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard } from '@/components/admin';

interface Stats {
  doctors: number;
  treatments: number;
  promotions: number;
  spaces: number;
}

const TEMPLATES = [
  {
    id: 'hospital',
    name: '병원 템플릿',
    description: '의료기관에 최적화된 전문 템플릿. 의료진, 시술, 예약 기능 포함.',
    href: '/',
    active: true,
  },
  {
    id: 'landing',
    name: '랜딩 템플릿',
    description: '마케팅 캠페인, 이벤트용 원페이지 랜딩 페이지.',
    href: '/templates/landing',
    active: false,
  },
  {
    id: 'shopping',
    name: '쇼핑몰 템플릿',
    description: '제품 판매에 최적화된 이커머스 템플릿.',
    href: '/templates/shopping',
    active: false,
  },
  {
    id: 'corporate',
    name: '기업 템플릿',
    description: '기업 소개, 서비스 안내에 적합한 비즈니스 템플릿.',
    href: '/templates/corporate-light',
    active: false,
  },
];

const MENU_CARDS = [
  {
    title: '사이트 관리',
    description: '사이트 생성, 편집, 삭제',
    href: '/admin/sites',
    statKey: null,
  },
  {
    title: '병원 정보',
    description: '병원명, 주소, 전화번호 관리',
    href: '/admin/hospital',
    statKey: null,
  },
  {
    title: '히어로 이미지',
    description: '메인 배너 이미지 관리',
    href: '/admin/hero',
    statKey: null,
  },
  {
    title: '의료진',
    description: '의료진 프로필, 이력, 사진 관리',
    href: '/admin/doctors',
    statKey: 'doctors' as const,
    unit: '명',
  },
  {
    title: '시술 관리',
    description: '시술 종류, 설명 관리',
    href: '/admin/treatments',
    statKey: 'treatments' as const,
    unit: '개',
  },
  {
    title: '프로모션',
    description: '할인, 이벤트 관리',
    href: '/admin/promotions',
    statKey: 'promotions' as const,
    unit: '개',
  },
  {
    title: '공간 사진',
    description: '병원 내부/외부 사진 관리',
    href: '/admin/spaces',
    statKey: 'spaces' as const,
    unit: '장',
  },
  {
    title: '진료시간',
    description: '요일별 진료시간 관리',
    href: '/admin/schedule',
    statKey: null,
  },
];

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({ doctors: 0, treatments: 0, promotions: 0, spaces: 0 });

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const [doctors, treatments, promotions, spaces] = await Promise.all([
          apiClient('/api/hospitals/1/doctors', { token }).catch(() => []),
          apiClient('/api/hospitals/1/treatments', { token }).catch(() => []),
          apiClient('/api/hospitals/1/promotions', { token }).catch(() => []),
          apiClient('/api/hospitals/1/spaces', { token }).catch(() => []),
        ]);
        setStats({
          doctors: Array.isArray(doctors) ? doctors.length : 0,
          treatments: Array.isArray(treatments) ? treatments.length : 0,
          promotions: Array.isArray(promotions) ? promotions.length : 0,
          spaces: Array.isArray(spaces) ? spaces.length : 0,
        });
      } catch {
        // fallback to zeros
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Template Selection Section */}
      <div>
        <h2 className="text-lg font-semibold text-admin-text mb-4">
          사용 중인 템플릿
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl) => (
            <a
              key={tmpl.id}
              href={tmpl.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <AdminCard
                className={`h-full transition-all ${
                  tmpl.active
                    ? 'ring-2 ring-admin-primary border-admin-primary/40'
                    : 'hover:shadow-md hover:border-admin-primary/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-admin-text group-hover:text-admin-primary transition-colors">
                    {tmpl.name}
                  </h3>
                  {tmpl.active && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-primary text-white flex-shrink-0">
                      사용 중
                    </span>
                  )}
                </div>
                <p className="text-xs text-admin-text-secondary mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
                <p className="text-xs text-admin-primary mt-3 group-hover:underline">
                  미리보기 &rarr;
                </p>
              </AdminCard>
            </a>
          ))}
        </div>
      </div>

      {/* Management Menu Cards */}
      <div>
        <h2 className="text-lg font-semibold text-admin-text mb-4">
          콘텐츠 관리
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MENU_CARDS.map((card) => (
            <Link key={card.href} href={card.href} className="block group">
              <AdminCard className="h-full hover:shadow-md hover:border-admin-primary/30 transition-all">
                <h2 className="text-base font-semibold text-admin-text group-hover:text-admin-primary transition-colors">
                  {card.title}
                </h2>
                <p className="text-sm text-admin-text-secondary mt-1">
                  {card.description}
                </p>
                {card.statKey && (
                  <p className="text-2xl font-bold text-admin-primary mt-3">
                    {stats[card.statKey]}
                    <span className="text-sm font-normal text-admin-text-secondary ml-1">
                      {card.unit}
                    </span>
                  </p>
                )}
              </AdminCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
