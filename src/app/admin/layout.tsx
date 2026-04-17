'use client';

import { useState, type ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AdminSidebar, AdminHeader } from '@/components/admin';

/* Map pathname → sidebar activeKey */
const PATH_KEY_MAP: Record<string, string> = {
  '/admin': 'dashboard',
  '/admin/hospital': 'info',
  '/admin/hero': 'hero',
  '/admin/doctors': 'doctors',
  '/admin/treatments': 'treatments',
  '/admin/promotions': 'promotions',
  '/admin/spaces': 'gallery',
  '/admin/schedule': 'schedule',
  '/admin/shopping/config': 'shop-config',
  '/admin/shopping/products': 'shop-products',
  '/admin/shopping/categories': 'shop-categories',
  '/admin/shopping/news': 'shop-news',
  '/admin/shopping/stores': 'shop-stores',
  '/admin/corporate/config': 'corp-config',
  '/admin/corporate/services': 'corp-services',
  '/admin/corporate/news': 'corp-news',
  '/admin/corporate/teams': 'corp-teams',
  '/admin/corporate/careers': 'corp-careers',
  '/admin/corporate/milestones': 'corp-milestones',
  '/admin/landing/config': 'land-config',
  '/admin/landing/sections': 'land-sections',
  '/admin/landing/cards': 'land-cards',
  '/admin/landing/services': 'land-services',
};

/* Map pathname → header title */
const PATH_TITLE_MAP: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/hospital': '병원 정보',
  '/admin/hero': '히어로 이미지',
  '/admin/doctors': '의료진 관리',
  '/admin/treatments': '시술 관리',
  '/admin/promotions': '프로모션 관리',
  '/admin/spaces': '공간 사진',
  '/admin/schedule': '진료시간',
  '/admin/shopping/config': '쇼핑몰 설정',
  '/admin/shopping/products': '상품 관리',
  '/admin/shopping/categories': '카테고리 관리',
  '/admin/shopping/news': '뉴스/캠페인',
  '/admin/shopping/stores': '매장 관리',
  '/admin/corporate/config': '기업 설정',
  '/admin/corporate/services': '서비스 관리',
  '/admin/corporate/news': '뉴스 관리',
  '/admin/corporate/teams': '팀/스튜디오',
  '/admin/corporate/careers': '채용 관리',
  '/admin/corporate/milestones': '연혁 관리',
  '/admin/landing/config': '랜딩 설정',
  '/admin/landing/sections': '섹션 관리',
  '/admin/landing/cards': '캐러셀 카드',
  '/admin/landing/services': '서비스 카드',
};

function AdminGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-bg">
        <div className="text-admin-text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const activeKey = PATH_KEY_MAP[pathname] || 'dashboard';
  const headerTitle = PATH_TITLE_MAP[pathname] || '관리자';

  return (
    <div className="min-h-screen flex bg-admin-bg">
      <AdminSidebar
        activeKey={activeKey}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          title={headerTitle}
          adminName="관리자"
          adminEmail={user?.email}
          siteUrl="/"
          onMenuToggle={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
