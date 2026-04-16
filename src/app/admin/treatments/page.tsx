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

interface Treatment {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
}

const EMPTY_FORM = {
  name: '',
  category: '',
  description: '',
  image_url: '',
  sort_order: '0',
};

export default function AdminTreatmentsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchItems = async () => {
    try {
      const data = await apiClient('/api/hospitals/1/treatments', { token: token! });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '시술 목록을 불러오지 못했습니다.' });
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
    const t = items[idx];
    setForm({
      name: t.name,
      category: t.category || '',
      description: t.description || '',
      image_url: t.image_url || '',
      sort_order: String(t.sort_order),
    });
    setEditingId(t.id);
    setModalOpen(true);
  };

  const handleDelete = async (idx: number) => {
    const t = items[idx];
    if (!confirm(`"${t.name}" 시술을 삭제하시겠습니까?`)) return;
    try {
      await apiClient(`/api/treatments/${t.id}`, { method: 'DELETE', token: token! });
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
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '시술명은 필수입니다.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    const body = {
      name: form.name,
      category: form.category || null,
      description: form.description || null,
      image_url: form.image_url || null,
      sort_order: parseInt(form.sort_order) || 0,
    };
    try {
      if (editingId) {
        await apiClient(`/api/treatments/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
      } else {
        await apiClient('/api/hospitals/1/treatments', {
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
    { key: 'name', label: '시술명' },
    { key: 'category', label: '카테고리' },
    { key: 'sort_order', label: '순서', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = items.map((t) => ({
    image: t.image_url ? (
      <img src={t.image_url.startsWith('http') ? t.image_url : `${API_BASE}${t.image_url}`} alt={t.name} className="w-10 h-10 rounded object-cover" />
    ) : (
      <div className="w-10 h-10 rounded bg-gray-200" />
    ),
    name: t.name,
    category: t.category || '-',
    sort_order: t.sort_order,
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
        title="시술 목록"
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
        title={editingId ? '시술 수정' : '시술 추가'}
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
          <AdminInput label="시술명" name="name" value={form.name} onChange={handleChange} placeholder="보톡스" />
          <AdminInput label="카테고리" name="category" value={form.category} onChange={handleChange} placeholder="주사, 레이저 등" />
          <AdminInput label="설명" name="description" type="textarea" value={form.description} onChange={handleChange} placeholder="시술에 대한 상세 설명" />
          <ImageUploader
            value={form.image_url}
            onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
            category="treatments"
            label="시술 이미지"
          />
          <AdminInput label="표시 순서" name="sort_order" value={form.sort_order} onChange={handleChange} placeholder="0" />
        </div>
      </AdminModal>
    </div>
  );
}
