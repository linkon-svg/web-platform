'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminButton, AdminCard, AdminInput } from '@/components/admin';

interface SiteData {
  id: number;
  name: string;
  description?: string;
  domain?: string;
  template_type?: string;
  status?: string;
  primary_color?: string;
}

interface SiteForm {
  name: string;
  description: string;
  domain: string;
  status: string;
  primary_color: string;
}

export default function AdminSiteEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();

  const [site, setSite] = useState<SiteData | null>(null);
  const [form, setForm] = useState<SiteForm>({
    name: '',
    description: '',
    domain: '',
    status: 'active',
    primary_color: '#6366f1',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const fetchSite = useCallback(async () => {
    if (!token || !id) return;
    try {
      const data = await apiClient(`/api/sites/${id}`, { token });
      setSite(data);
      setForm({
        name: data.name || '',
        description: data.description || '',
        domain: data.domain || '',
        status: data.status || 'active',
        primary_color: data.primary_color || '#6366f1',
      });
    } catch {
      setMessage({
        type: 'error',
        text: '사이트 정보를 불러오지 못했습니다.',
      });
    } finally {
      setLoading(false);
    }
  }, [token, id]);

  useEffect(() => {
    fetchSite();
  }, [fetchSite]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '사이트 이름은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      domain: form.domain.trim() || null,
      status: form.status,
      primary_color: form.primary_color,
    };

    try {
      await apiClient(`/api/sites/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
        token: token!,
      });
      setMessage({ type: 'success', text: '사이트 정보가 저장되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-admin-text-secondary">로딩 중...</div>
      </div>
    );
  }

  if (!site && !loading) {
    return (
      <div className="space-y-6">
        <div className="px-4 py-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">
          사이트 정보를 불러오지 못했습니다.
        </div>
        <AdminButton
          variant="secondary"
          onClick={() => router.push('/admin/sites')}
        >
          목록으로 돌아가기
        </AdminButton>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
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
        <h1 className="text-2xl font-bold text-admin-text">사이트 편집</h1>
        {site?.template_type && (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
            템플릿: {site.template_type}
          </span>
        )}
      </div>

      {/* Form */}
      <AdminCard title="기본 정보">
        <div className="space-y-4">
          <AdminInput
            label="사이트 이름"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="사이트 이름을 입력하세요"
          />

          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="사이트에 대한 설명을 입력하세요"
          />

          <AdminInput
            label="도메인"
            name="domain"
            value={form.domain}
            onChange={handleFormChange}
            placeholder="예: example.com"
          />

          {/* Status toggle */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-admin-text">
              상태
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    status:
                      prev.status === 'active' ? 'inactive' : 'active',
                  }))
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.status === 'active' ? 'bg-admin-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.status === 'active'
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm text-admin-text">
                {form.status === 'active' ? '활성' : '비활성'}
              </span>
            </div>
          </div>

          {/* Primary color */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-admin-text">
              기본 색상
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primary_color"
                value={form.primary_color}
                onChange={handleFormChange}
                className="h-10 w-14 rounded-lg border border-admin-border cursor-pointer"
              />
              <input
                type="text"
                name="primary_color"
                value={form.primary_color}
                onChange={handleFormChange}
                className="w-28 rounded-lg border border-admin-border px-3 py-2 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary transition-colors"
                placeholder="#6366f1"
              />
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <AdminButton onClick={handleSave} loading={saving}>
          저장
        </AdminButton>
        <AdminButton
          variant="secondary"
          onClick={() => router.push('/admin/sites')}
        >
          취소
        </AdminButton>
      </div>
    </div>
  );
}
