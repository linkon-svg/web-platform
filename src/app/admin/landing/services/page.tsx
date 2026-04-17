'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminModal,
  AdminTable,
} from '@/components/admin';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceForm {
  title: string;
  description: string;
  icon: string;
  link: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: ServiceForm = {
  title: '',
  description: '',
  icon: '',
  link: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminLandingServicesPage() {
  const { token } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/landing/services', { token });
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '서비스 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const service = services[idx];
    setEditingId(service.id);
    setForm({
      title: service.title || '',
      description: service.description || '',
      icon: service.icon || '',
      link: service.link || '',
      sort_order: service.sort_order,
      is_active: service.is_active,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: '제목은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon.trim(),
      link: form.link.trim(),
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/landing/services/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '서비스가 수정되었습니다.' });
      } else {
        await apiClient('/api/landing/services', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '서비스가 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchServices();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/landing/services/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '서비스가 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchServices();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'title', label: '제목' },
    { key: 'description', label: '설명' },
    { key: 'icon', label: '아이콘' },
    { key: 'link', label: '링크' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
    { key: 'is_active', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = services.map((item) => ({
    title: <span className="font-medium">{item.title}</span>,
    description: (
      <span className="text-admin-text-secondary">
        {item.description ? (item.description.length > 30 ? item.description.slice(0, 30) + '...' : item.description) : '-'}
      </span>
    ),
    icon: <span className="text-admin-text-secondary">{item.icon || '-'}</span>,
    link: (
      <span className="text-admin-text-secondary">
        {item.link ? (item.link.length > 30 ? item.link.slice(0, 30) + '...' : item.link) : '-'}
      </span>
    ),
    sort_order: <span className="text-admin-text-secondary">{item.sort_order}</span>,
    is_active: item.is_active ? (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">활성</span>
    ) : (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">비활성</span>
    ),
  }));

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

      {/* Services Table */}
      <AdminCard
        title={`서비스 카드 목록 (${services.length}개)`}
        actions={
          <AdminButton onClick={openCreate} size="sm">
            + 추가
          </AdminButton>
        }
      >
        <AdminTable
          columns={columns}
          data={tableData}
          onEdit={openEdit}
          onDelete={(idx) => setDeleteTarget(services[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '서비스 수정' : '서비스 추가'}
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>
              취소
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              {editingId ? '수정' : '추가'}
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          {/* Title */}
          <AdminInput
            label="제목"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="서비스 제목"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="서비스 설명"
          />

          {/* Icon */}
          <AdminInput
            label="아이콘"
            name="icon"
            value={form.icon}
            onChange={handleFormChange}
            placeholder="아이콘"
          />

          {/* Link */}
          <AdminInput
            label="링크"
            name="link"
            value={form.link}
            onChange={handleFormChange}
            placeholder="https://"
          />

          {/* Sort Order */}
          <AdminInput
            label="표시 순서"
            name="sort_order"
            value={String(form.sort_order)}
            onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />

          {/* is_active checkbox */}
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-admin-border"
            />
            활성화
          </label>
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="서비스 삭제"
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => setDeleteTarget(null)}>
              취소
            </AdminButton>
            <AdminButton variant="danger" onClick={handleDelete}>
              삭제
            </AdminButton>
          </>
        }
      >
        <p className="text-sm text-admin-text">
          <strong>{deleteTarget?.title}</strong> 서비스를 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
