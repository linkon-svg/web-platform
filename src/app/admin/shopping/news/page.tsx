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

interface ShopNews {
  id: number;
  title: string;
  content: string;
  image: string | null;
  category: '소식' | '캠페인';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NewsForm {
  title: string;
  content: string;
  image: string;
  category: '소식' | '캠페인';
  is_active: boolean;
}

const EMPTY_FORM: NewsForm = {
  title: '',
  content: '',
  image: '',
  category: '소식',
  is_active: true,
};

const CATEGORY_OPTIONS = [
  { label: '소식', value: '소식' },
  { label: '캠페인', value: '캠페인' },
];

export default function AdminShoppingNewsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ShopNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NewsForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ShopNews | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/shopping/news', { token });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '뉴스 목록을 불러오지 못했습니다.' });
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
      title: item.title,
      content: item.content,
      image: item.image || '',
      category: item.category,
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
      title: form.title.trim(),
      content: form.content.trim(),
      image: form.image || null,
      category: form.category,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/shopping/news/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '뉴스가 수정되었습니다.' });
      } else {
        await apiClient('/api/shopping/news', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '뉴스가 추가되었습니다.' });
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
      await apiClient(`/api/shopping/news/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '뉴스가 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchItems();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'image', label: '이미지', className: 'w-16' },
    { key: 'title', label: '제목' },
    { key: 'category', label: '카테고리', className: 'w-24' },
    { key: 'is_active', label: '상태', className: 'w-20' },
    { key: 'created_at', label: '등록일', className: 'w-28' },
  ];

  const tableData: Record<string, ReactNode>[] = items.map((item) => ({
    image: item.image ? (
      <img
        src={item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`}
        alt={item.title}
        className="w-10 h-10 rounded object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
        -
      </div>
    ),
    title: <span className="font-medium">{item.title}</span>,
    category: (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          item.category === '소식'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-purple-100 text-purple-700'
        }`}
      >
        {item.category}
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
    created_at: (
      <span className="text-sm text-admin-text-secondary">
        {new Date(item.created_at).toLocaleDateString('ko-KR')}
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

      {/* News Table */}
      <AdminCard
        title={`뉴스/캠페인 목록 (${items.length}건)`}
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
        title={editingId ? '뉴스 수정' : '뉴스 추가'}
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
            placeholder="뉴스 제목"
          />

          {/* Category */}
          <AdminInput
            label="카테고리"
            name="category"
            type="select"
            value={form.category}
            onChange={handleFormChange}
            options={CATEGORY_OPTIONS}
          />

          {/* Content */}
          <AdminInput
            label="내용"
            name="content"
            type="textarea"
            value={form.content}
            onChange={handleFormChange}
            placeholder="뉴스 내용을 입력하세요"
          />

          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            category="news"
            label="대표 이미지"
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
        title="뉴스 삭제"
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
          <strong>{deleteTarget?.title}</strong> 뉴스를 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
