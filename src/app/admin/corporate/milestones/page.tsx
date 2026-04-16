'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient, API_BASE } from '@/lib/api';
import {
  AdminCard,
  AdminButton,
  AdminInput,
  AdminModal,
  AdminTable,
  ImageUploader,
} from '@/components/admin';

interface Milestone {
  id: number;
  year: number;
  month: number | null;
  title: string;
  description: string;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

interface MilestoneForm {
  year: number;
  month: number | null;
  title: string;
  description: string;
  image: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: MilestoneForm = {
  year: 2026,
  month: null,
  title: '',
  description: '',
  image: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminCorporateMilestonesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<MilestoneForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Milestone | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/corporate/milestones', { token });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '연혁 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
    const item = items[idx];
    setEditingId(item.id);
    setForm({
      year: item.year,
      month: item.month,
      title: item.title,
      description: item.description,
      image: item.image || '',
      sort_order: item.sort_order,
      is_active: item.is_active,
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
      year: form.year,
      month: form.month,
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/corporate/milestones/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '연혁이 수정되었습니다.' });
      } else {
        await apiClient('/api/corporate/milestones', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '연혁이 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchItems();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/corporate/milestones/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '연혁이 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchItems();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'year', label: '연도', className: 'w-20' },
    { key: 'month', label: '월', className: 'w-16' },
    { key: 'title', label: '제목' },
    { key: 'description', label: '설명' },
    { key: 'is_active', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = items.map((item) => ({
    year: <span className="font-medium">{item.year}</span>,
    month: <span className="text-admin-text-secondary">{item.month ?? '-'}</span>,
    title: <span className="font-medium">{item.title}</span>,
    description: (
      <span className="text-sm text-admin-text-secondary">
        {item.description.length > 30 ? `${item.description.slice(0, 30)}...` : item.description}
      </span>
    ),
    is_active: (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          item.is_active
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-500'
        }`}
      >
        {item.is_active ? '활성' : '비활성'}
      </span>
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

      {/* Milestones Table */}
      <AdminCard
        title={`연혁 목록 (${items.length}건)`}
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
          onDelete={(idx) => setDeleteTarget(items[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '연혁 수정' : '연혁 추가'}
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
          {/* Year */}
          <AdminInput
            label="연도"
            name="year"
            value={String(form.year)}
            onChange={(e) => setForm(prev => ({...prev, year: parseInt(e.target.value) || 2026}))}
            placeholder="2026"
          />

          {/* Month */}
          <AdminInput
            label="월 (선택)"
            name="month"
            value={form.month !== null ? String(form.month) : ''}
            onChange={(e) => setForm((prev) => ({ ...prev, month: e.target.value ? parseInt(e.target.value) || null : null }))}
            placeholder="1~12 (비워두면 연도만 표시)"
          />

          {/* Title */}
          <AdminInput
            label="제목"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="연혁 제목"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="연혁 설명을 입력하세요"
          />

          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            category="corporate"
            label="이미지"
          />

          {/* Sort Order */}
          <AdminInput
            label="표시 순서"
            name="sort_order"
            value={String(form.sort_order)}
            onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />

          {/* Active */}
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
        title="연혁 삭제"
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
          <strong>{deleteTarget?.year}년 {deleteTarget?.title}</strong> 연혁을 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
