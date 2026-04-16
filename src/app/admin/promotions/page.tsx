'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient, API_BASE } from '@/lib/api';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTable,
  AdminModal,
  ImageUploader,
} from '@/components/admin';

interface Promotion {
  id: number;
  title: string;
  image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

const EMPTY_FORM = {
  title: '',
  image_url: '',
  start_date: '',
  end_date: '',
  is_active: 'true',
};

export default function AdminPromotionsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchItems = async () => {
    try {
      const data = await apiClient('/api/hospitals/1/promotions', { token: token! });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '프로모션 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const p = items[idx];
    setForm({
      title: p.title,
      image_url: p.image_url || '',
      start_date: p.start_date || '',
      end_date: p.end_date || '',
      is_active: p.is_active ? 'true' : 'false',
    });
    setEditingId(p.id);
    setModalOpen(true);
  };

  const handleDelete = async (idx: number) => {
    const p = items[idx];
    if (!confirm(`"${p.title}" 프로모션을 삭제하시겠습니까?`)) return;
    try {
      await apiClient(`/api/promotions/${p.id}`, { method: 'DELETE', token: token! });
      setMessage({ type: 'success', text: '삭제되었습니다.' });
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: '프로모션 제목은 필수입니다.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const body = {
      title: form.title,
      image_url: form.image_url || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      is_active: form.is_active === 'true',
    };
    try {
      if (editingId) {
        await apiClient(`/api/promotions/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
      } else {
        await apiClient('/api/hospitals/1/promotions', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
      }
      setModalOpen(false);
      setMessage({ type: 'success', text: editingId ? '수정되었습니다.' : '추가되었습니다.' });
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'image', label: '이미지', className: 'w-16' },
    { key: 'title', label: '제목' },
    { key: 'period', label: '기간' },
    { key: 'status', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = items.map((p) => ({
    image: p.image_url ? (
      <img src={p.image_url.startsWith('http') ? p.image_url : `${API_BASE}${p.image_url}`} alt={p.title} className="w-10 h-10 rounded object-cover" />
    ) : (
      <div className="w-10 h-10 rounded bg-gray-200" />
    ),
    title: p.title,
    period: p.start_date && p.end_date ? `${p.start_date} ~ ${p.end_date}` : '-',
    status: (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          p.is_active
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {p.is_active ? '진행중' : '종료'}
      </span>
    ),
  }));

  if (loading) {
    return <div className="text-admin-text-secondary">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
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

      <AdminCard
        title="프로모션 목록"
        actions={
          <AdminButton size="sm" onClick={openCreate}>
            + 추가
          </AdminButton>
        }
      >
        <AdminTable
          columns={columns}
          data={tableData}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      </AdminCard>

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '프로모션 수정' : '프로모션 추가'}
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>
              취소
            </AdminButton>
            <AdminButton onClick={handleSave} loading={saving}>
              저장
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <AdminInput label="제목" name="title" value={form.title} onChange={handleChange} placeholder="여름 특가 프로모션" />
          <ImageUploader
            value={form.image_url}
            onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
            category="promotions"
            label="프로모션 이미지"
          />
          <AdminInput label="시작일" name="start_date" value={form.start_date} onChange={handleChange} placeholder="2025-01-01" />
          <AdminInput label="종료일" name="end_date" value={form.end_date} onChange={handleChange} placeholder="2025-12-31" />
          <AdminInput
            label="활성 상태"
            name="is_active"
            type="select"
            value={form.is_active}
            onChange={handleChange}
            options={[
              { label: '진행중', value: 'true' },
              { label: '종료', value: 'false' },
            ]}
          />
        </div>
      </AdminModal>
    </div>
  );
}
