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
  products: number;
  categories: number;
  shopNews: number;
  stores: number;
  corpServices: number;
  corpNews: number;
  corpTeams: number;
  corpCareers: number;
  corpMilestones: number;
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
    active: true,
    adminHref: '/admin/shopping/config',
  },
  {
    id: 'corporate',
    name: '기업 템플릿',
    description: '기업 소개, 서비스 안내에 적합한 비즈니스 템플릿.',
    href: '/templates/corporate-dark',
    active: true,
    adminHref: '/admin/corporate/config',
  },
];

interface MenuCard {
  title: string;
  description: string;
  href: string;
  statKey: keyof Stats | null;
  unit?: string;
}

interface MenuSection {
  title: string;
  icon: string;
  cards: MenuCard[];
}

const MENU_SECTIONS: MenuSection[] = [
  {
    title: '병원 (Hospital)',
    icon: '🏥',
    cards: [
      { title: '병원 정보', description: '병원명, 주소, 전화번호 관리', href: '/admin/hospital', statKey: null },
      { title: '히어로 이미지', description: '메인 배너 이미지 관리', href: '/admin/hero', statKey: null },
      { title: '의료진', description: '의료진 프로필, 이력, 사진 관리', href: '/admin/doctors', statKey: 'doctors', unit: '명' },
      { title: '시술 관리', description: '시술 종류, 설명 관리', href: '/admin/treatments', statKey: 'treatments', unit: '개' },
      { title: '프로모션', description: '할인, 이벤트 관리', href: '/admin/promotions', statKey: 'promotions', unit: '개' },
      { title: '공간 사진', description: '병원 내부/외부 사진 관리', href: '/admin/spaces', statKey: 'spaces', unit: '장' },
      { title: '진료시간', description: '요일별 진료시간 관리', href: '/admin/schedule', statKey: null },
    ],
  },
  {
    title: '쇼핑몰 (Shopping)',
    icon: '🛒',
    cards: [
      { title: '쇼핑몰 설정', description: '쇼핑몰명, 배너, 푸터 관리', href: '/admin/shopping/config', statKey: null },
      { title: '상품 관리', description: '상품 등록, 수정, 삭제', href: '/admin/shopping/products', statKey: 'products', unit: '개' },
      { title: '카테고리', description: '상품 카테고리 관리', href: '/admin/shopping/categories', statKey: 'categories', unit: '개' },
      { title: '뉴스/캠페인', description: '소식, 캠페인 관리', href: '/admin/shopping/news', statKey: 'shopNews', unit: '개' },
      { title: '매장 관리', description: '오프라인 매장 정보 관리', href: '/admin/shopping/stores', statKey: 'stores', unit: '개' },
    ],
  },
  {
    title: '기업 (Corporate)',
    icon: '🏢',
    cards: [
      { title: '기업 설정', description: '회사명, 히어로, 비전/미션 관리', href: '/admin/corporate/config', statKey: null },
      { title: '서비스 관리', description: '서비스/사업 소개 관리', href: '/admin/corporate/services', statKey: 'corpServices', unit: '개' },
      { title: '뉴스 관리', description: '뉴스, 보도자료, 공지 관리', href: '/admin/corporate/news', statKey: 'corpNews', unit: '개' },
      { title: '팀/스튜디오', description: '팀, 스튜디오, 계열사 관리', href: '/admin/corporate/teams', statKey: 'corpTeams', unit: '개' },
      { title: '채용 관리', description: '채용 공고 관리', href: '/admin/corporate/careers', statKey: 'corpCareers', unit: '개' },
      { title: '연혁 관리', description: '회사 연혁 타임라인 관리', href: '/admin/corporate/milestones', statKey: 'corpMilestones', unit: '개' },
    ],
  },
];

export default function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({
    doctors: 0, treatments: 0, promotions: 0, spaces: 0,
    products: 0, categories: 0, shopNews: 0, stores: 0,
    corpServices: 0, corpNews: 0, corpTeams: 0, corpCareers: 0, corpMilestones: 0,
  });

  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      try {
        const [doctors, treatments, promotions, spaces, products, categories, shopNews, stores, corpServices, corpNews, corpTeams, corpCareers, corpMilestones] = await Promise.all([
          apiClient('/api/hospitals/1/doctors', { token }).catch(() => []),
          apiClient('/api/hospitals/1/treatments', { token }).catch(() => []),
          apiClient('/api/hospitals/1/promotions', { token }).catch(() => []),
          apiClient('/api/hospitals/1/spaces', { token }).catch(() => []),
          apiClient('/api/shopping/products', { token }).catch(() => []),
          apiClient('/api/shopping/categories', { token }).catch(() => []),
          apiClient('/api/shopping/news', { token }).catch(() => []),
          apiClient('/api/shopping/stores', { token }).catch(() => []),
          apiClient('/api/corporate/services', { token }).catch(() => []),
          apiClient('/api/corporate/news', { token }).catch(() => []),
          apiClient('/api/corporate/teams', { token }).catch(() => []),
          apiClient('/api/corporate/careers', { token }).catch(() => []),
          apiClient('/api/corporate/milestones', { token }).catch(() => []),
        ]);
        setStats({
          doctors: Array.isArray(doctors) ? doctors.length : 0,
          treatments: Array.isArray(treatments) ? treatments.length : 0,
          promotions: Array.isArray(promotions) ? promotions.length : 0,
          spaces: Array.isArray(spaces) ? spaces.length : 0,
          products: Array.isArray(products) ? products.length : 0,
          categories: Array.isArray(categories) ? categories.length : 0,
          shopNews: Array.isArray(shopNews) ? shopNews.length : 0,
          stores: Array.isArray(stores) ? stores.length : 0,
          corpServices: Array.isArray(corpServices) ? corpServices.length : 0,
          corpNews: Array.isArray(corpNews) ? corpNews.length : 0,
          corpTeams: Array.isArray(corpTeams) ? corpTeams.length : 0,
          corpCareers: Array.isArray(corpCareers) ? corpCareers.length : 0,
          corpMilestones: Array.isArray(corpMilestones) ? corpMilestones.length : 0,
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
          템플릿 관리
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="block">
              <AdminCard
                className={`h-full transition-all ${
                  tmpl.active
                    ? 'ring-2 ring-admin-primary border-admin-primary/40'
                    : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-admin-text">
                    {tmpl.name}
                  </h3>
                  {tmpl.active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-primary text-white flex-shrink-0">
                      활성
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500 flex-shrink-0">
                      준비 중
                    </span>
                  )}
                </div>
                <p className="text-xs text-admin-text-secondary mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <a
                    href={tmpl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-admin-primary hover:underline"
                  >
                    미리보기 &rarr;
                  </a>
                  {'adminHref' in tmpl && (tmpl as any).adminHref && (
                    <Link
                      href={(tmpl as any).adminHref}
                      className="text-xs text-admin-text-secondary hover:text-admin-primary hover:underline"
                    >
                      관리 &rarr;
                    </Link>
                  )}
                </div>
              </AdminCard>
            </div>
          ))}
        </div>
      </div>

      {/* Management Menu Cards — grouped by template */}
      {MENU_SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-semibold text-admin-text mb-4">
            {section.icon} {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.cards.map((card) => (
              <Link key={card.href} href={card.href} className="block group">
                <AdminCard className="h-full hover:shadow-md hover:border-admin-primary/30 transition-all">
                  <h3 className="text-base font-semibold text-admin-text group-hover:text-admin-primary transition-colors">
                    {card.title}
                  </h3>
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
      ))}
    </div>
  );
}
