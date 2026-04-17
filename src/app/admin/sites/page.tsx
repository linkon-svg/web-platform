'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminButton, AdminCard, AdminModal } from '@/components/admin';

interface Site {
  id: number;
  name: string;
  description?: string;
  domain?: string;
  template_type?: string;
  status?: string;
  primary_color?: string;
  created_at?: string;
}

export default function AdminSitesPage() {
  const { token } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSites = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/sites', { token });
      setSites(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '사이트 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleDelete = async () => {
    if (!deleteTarget || !token) return;
    setDeleting(true);
    try {
      await apiClient(`/api/sites/${deleteTarget.id}`, {
        method: 'DELETE',
        token,
      });
      setMessage({ type: 'success', text: '사이트가 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchSites();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-admin-text-secondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-admin-text">사이트 관리</h1>
        <Link href="/admin/sites/new">
          <AdminButton>+ 새 사이트 만들기</AdminButton>
        </Link>
      </div>

      {/* Empty state */}
      {sites.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
              />
            </svg>
            <p className="text-admin-text-secondary mb-4">
              등록된 사이트가 없습니다
            </p>
            <Link href="/admin/sites/new">
              <AdminButton>+ 새 사이트 만들기</AdminButton>
            </Link>
          </div>
        </AdminCard>
      ) : (
        /* Site card grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-admin-card rounded-xl border border-admin-border shadow-sm overflow-hidden"
            >
              {/* Color bar */}
              <div
                className="h-2"
                style={{
                  backgroundColor: site.primary_color || '#6366f1',
                }}
              />

              <div className="p-5 space-y-3">
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-admin-text truncate">
                    {site.name}
                  </h3>
                  <span
                    className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      site.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {site.status === 'active' ? '활성' : '비활성'}
                  </span>
                </div>

                {/* Template badge */}
                {site.template_type && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                    {site.template_type}
                  </span>
                )}

                {/* Domain */}
                {site.domain && (
                  <p className="text-sm text-admin-text-secondary truncate">
                    {site.domain}
                  </p>
                )}

                {/* Created date */}
                <p className="text-xs text-admin-text-secondary">
                  생성일: {formatDate(site.created_at)}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-admin-border">
                  <Link
                    href={`/admin/sites/${site.id}/edit`}
                    className="flex-1"
                  >
                    <AdminButton variant="secondary" size="sm" className="w-full">
                      편집
                    </AdminButton>
                  </Link>
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteTarget(site)}
                  >
                    삭제
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="사이트 삭제"
        actions={
          <>
            <AdminButton
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </AdminButton>
            <AdminButton
              variant="danger"
              onClick={handleDelete}
              loading={deleting}
            >
              삭제
            </AdminButton>
          </>
        }
      >
        <p className="text-sm text-admin-text">
          <strong>{deleteTarget?.name}</strong> 사이트를 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">
            이 작업은 되돌릴 수 없습니다.
          </span>
        </p>
      </AdminModal>
    </div>
  );
}
