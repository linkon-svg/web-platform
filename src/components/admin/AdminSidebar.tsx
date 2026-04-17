'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  activeKey?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

/* ─── SVG Icons ─── */
const icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="8" rx="1" />
      <rect x="11" y="2" width="7" height="5" rx="1" />
      <rect x="2" y="12" width="7" height="6" rx="1" />
      <rect x="11" y="9" width="7" height="9" rx="1" />
    </svg>
  ),
  building: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="14" height="16" rx="1" />
      <path d="M7 6h2M11 6h2M7 10h2M11 10h2M8 18v-4h4v4" />
    </svg>
  ),
  image: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="14" rx="2" />
      <circle cx="7" cy="8" r="1.5" />
      <path d="M18 13l-4-4-8 8" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="6" r="3" />
      <path d="M2 17c0-3 2.5-5 5-5s5 2 5 5" />
      <circle cx="14" cy="7" r="2" />
      <path d="M14 11c2 0 4 1.5 4 4" />
    </svg>
  ),
  list: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M6 5h10M6 10h10M6 15h10M3 5h0M3 10h0M3 15h0" />
    </svg>
  ),
  tag: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h7l8 8-7 7-8-8V3z" />
      <circle cx="6.5" cy="6.5" r="1" />
    </svg>
  ),
  camera: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7a2 2 0 012-2h2l1-2h6l1 2h2a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V7z" />
      <circle cx="10" cy="11" r="3" />
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 5v5l3 3" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17H4a1 1 0 01-1-1V4a1 1 0 011-1h3M13 14l4-4-4-4M17 10H7" />
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6h12l-1.5 7H7.5L6 6zM6 6L5 2H2" />
      <circle cx="9" cy="17" r="1.5" />
      <circle cx="15" cy="17" r="1.5" />
    </svg>
  ),
  box: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l8-4 8 4-8 4-8-4z" />
      <path d="M2 6v8l8 4V10" />
      <path d="M18 6v8l-8 4V10" />
    </svg>
  ),
  grid: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  ),
  newspaper: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="14" rx="2" />
      <path d="M6 7h8M6 10h5M6 13h8" />
    </svg>
  ),
  store: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7l1-4h12l1 4" />
      <path d="M3 7c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2c0 1.1.9 2 2 2s2-.9 2-2" />
      <path d="M4 9v8h12V9" />
      <path d="M8 17v-5h4v5" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42" />
    </svg>
  ),
};

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: '',
    items: [
      { key: 'dashboard', label: '대시보드', href: '/admin', icon: icons.dashboard },
    ],
  },
  {
    title: '병원 (Hospital)',
    items: [
      { key: 'info', label: '병원 정보', href: '/admin/hospital', icon: icons.building },
      { key: 'hero', label: '히어로 이미지', href: '/admin/hero', icon: icons.image },
      { key: 'doctors', label: '의료진 관리', href: '/admin/doctors', icon: icons.users },
      { key: 'treatments', label: '시술 관리', href: '/admin/treatments', icon: icons.list },
      { key: 'promotions', label: '프로모션 관리', href: '/admin/promotions', icon: icons.tag },
      { key: 'gallery', label: '공간 사진', href: '/admin/spaces', icon: icons.camera },
      { key: 'schedule', label: '진료시간', href: '/admin/schedule', icon: icons.clock },
    ],
  },
  {
    title: '쇼핑몰 (Shopping)',
    items: [
      { key: 'shop-config', label: '쇼핑몰 설정', href: '/admin/shopping/config', icon: icons.settings },
      { key: 'shop-products', label: '상품 관리', href: '/admin/shopping/products', icon: icons.box },
      { key: 'shop-categories', label: '카테고리 관리', href: '/admin/shopping/categories', icon: icons.grid },
      { key: 'shop-news', label: '뉴스/캠페인', href: '/admin/shopping/news', icon: icons.newspaper },
      { key: 'shop-stores', label: '매장 관리', href: '/admin/shopping/stores', icon: icons.store },
    ],
  },
  {
    title: '기업 (Corporate)',
    items: [
      { key: 'corp-config', label: '기업 설정', href: '/admin/corporate/config', icon: icons.settings },
      { key: 'corp-services', label: '서비스 관리', href: '/admin/corporate/services', icon: icons.list },
      { key: 'corp-news', label: '뉴스 관리', href: '/admin/corporate/news', icon: icons.newspaper },
      { key: 'corp-teams', label: '팀/스튜디오', href: '/admin/corporate/teams', icon: icons.users },
      { key: 'corp-careers', label: '채용 관리', href: '/admin/corporate/careers', icon: icons.tag },
      { key: 'corp-milestones', label: '연혁 관리', href: '/admin/corporate/milestones', icon: icons.clock },
    ],
  },
  {
    title: '랜딩 (Landing)',
    items: [
      { key: 'land-config', label: '랜딩 설정', href: '/admin/landing/config', icon: icons.settings },
      { key: 'land-sections', label: '섹션 관리', href: '/admin/landing/sections', icon: icons.list },
      { key: 'land-cards', label: '캐러셀 카드', href: '/admin/landing/cards', icon: icons.grid },
      { key: 'land-services', label: '서비스 카드', href: '/admin/landing/services', icon: icons.box },
    ],
  },
];

export default function AdminSidebar({
  activeKey = 'dashboard',
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-admin-sidebar flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <span className="text-white font-bold text-lg tracking-wide">
            ADMIN
          </span>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-white/60 hover:text-white transition-colors"
            aria-label="사이드바 닫기"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-4">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx}>
                {section.title && (
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                    {section.title}
                  </div>
                )}
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = item.key === activeKey;
                    return (
                      <li key={item.key}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                            transition-colors
                            ${
                              isActive
                                ? 'bg-admin-sidebar-active text-white'
                                : 'text-white/70 hover:bg-admin-sidebar-hover hover:text-white'
                            }
                          `}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-admin-sidebar-hover hover:text-white transition-colors"
          >
            {icons.logout}
            로그아웃
          </button>
        </div>
      </aside>
    </>
  );
}
