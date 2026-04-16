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

interface Category {
  id: number;
  name: string;
  name_en: string;
  description: string;
  image: string | null;
  sort_order: number;
  is_active: boolean;
}

interface CategoryForm {
  name: string;
  name_en: string;
  description: string;
  image: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: CategoryForm = {
  name: '',
  name_en: '',
  description: '',
  image: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/shopping/categories', { token });
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '카테고리 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
    const category = categories[idx];
    setEditingId(category.id);
    setForm({
      name: category.name,
      name_en: category.name_en || '',
      description: category.description || '',
      image: category.image || '',
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '카테고리명은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      description: form.description.trim(),
      image: form.image || null,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/shopping/categories/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '카테고리가 수정되었습니다.' });
      } else {
        await apiClient('/api/shopping/categories', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '카테고리가 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchCategories();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/shopping/categories/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '카테고리가 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchCategories();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'image', label: '이미지', className: 'w-16' },
    { key: 'name', label: '이름' },
    { key: 'name_en', label: '영문명' },
    { key: 'description', label: '설명' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
    { key: 'is_active', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = categories.map((item) => ({
    image: item.image ? (
      <img
        src={item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`}
        alt={item.name}
        className="w-10 h-10 rounded object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
        -
      </div>
    ),
    name: <span className="font-medium">{item.name}</span>,
    name_en: <span className="text-admin-text-secondary">{item.name_en || '-'}</span>,
    description: (
      <span className="text-admin-text-secondary text-xs">
        {item.description ? (item.description.length > 30 ? item.description.slice(0, 30) + '...' : item.description) : '-'}
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

      {/* Categories Table */}
      <AdminCard
        title={`카테고리 목록 (${categories.length}개)`}
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
          onDelete={(idx) => setDeleteTarget(categories[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '카테고리 수정' : '카테고리 추가'}
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
          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            category="categories"
            label="카테고리 이미지"
          />

          {/* Name */}
          <AdminInput
            label="이름"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="카테고리 이름"
          />

          {/* Name EN */}
          <AdminInput
            label="영문명"
            name="name_en"
            value={form.name_en}
            onChange={handleFormChange}
            placeholder="Category name"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="카테고리 설명"
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

          {/* Sort Order */}
          <AdminInput
            label="표시 순서"
            name="sort_order"
            value={String(form.sort_order)}
            onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            placeholder="0"
          />
        </div>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="카테고리 삭제"
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
          <strong>{deleteTarget?.name}</strong> 카테고리를 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
