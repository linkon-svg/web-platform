'use client';

import { useState, type ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth';
import { AdminSidebar, AdminHeader } from '@/components/admin';

/* Map pathname → sidebar activeKey */
const PATH_KEY_MAP: Record<string, string> = {
  '/admin': 'dashboard',
  '/admin/sites': 'sites',
  '/admin/sites/new': 'sites',
  '/admin/hospital': 'info',
  '/admin/hero': 'hero',
  '/admin/doctors': 'doctors',
  '/admin/treatments': 'treatments',
  '/admin/promotions': 'promotions',
  '/admin/spaces': 'gallery',
  '/admin/schedule': 'schedule',
};

/* Map pathname → header title */
const PATH_TITLE_MAP: Record<string, string> = {
  '/admin': '대시보드',
  '/admin/sites': '사이트 관리',
  '/admin/sites/new': '새 사이트 만들기',
  '/admin/hospital': '병원 정보',
  '/admin/hero': '히어로 이미지',
  '/admin/doctors': '의료진 관리',
  '/admin/treatments': '시술 관리',
  '/admin/promotions': '프로모션 관리',
  '/admin/spaces': '공간 사진',
  '/admin/schedule': '진료시간',
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

  /* Exact match first, then prefix match for dynamic routes like /admin/sites/[id]/edit */
  const activeKey = PATH_KEY_MAP[pathname]
    || (pathname.startsWith('/admin/sites') ? 'sites' : 'dashboard');
  const headerTitle = PATH_TITLE_MAP[pathname]
    || (pathname.includes('/edit') && pathname.startsWith('/admin/sites') ? '사이트 편집' : '관리자');

  return (
    <div className="min-h-screen flex bg-admin-bg">
      <AdminSidebar
        activeKey={activeKey}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={() => {
          logout();
          router.replace('/admin/login');
        }}
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
