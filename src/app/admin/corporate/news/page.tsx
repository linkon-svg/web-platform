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

interface NewsItem {
  id: number;
  title: string;
  content: string;
  summary: string;
  image: string | null;
  category: string;
  is_featured: boolean;
  published_at: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface NewsForm {
  title: string;
  content: string;
  summary: string;
  image: string;
  category: string;
  is_featured: boolean;
  is_active: boolean;
}

const EMPTY_FORM: NewsForm = {
  title: '',
  content: '',
  summary: '',
  image: '',
  category: '뉴스',
  is_featured: false,
  is_active: true,
};

const CATEGORY_OPTIONS = [
  { label: '뉴스', value: '뉴스' },
  { label: '보도자료', value: '보도자료' },
  { label: '공지', value: '공지' },
];

const CATEGORY_BADGE: Record<string, string> = {
  '뉴스': 'bg-blue-100 text-blue-700',
  '보도자료': 'bg-purple-100 text-purple-700',
  '공지': 'bg-amber-100 text-amber-700',
};

export default function AdminCorporateNewsPage() {
  const { token } = useAuth();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<NewsForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<NewsItem | null>(null);

  const fetchNews = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/corporate/news', { token });
      setNewsList(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '뉴스 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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
    const item = newsList[idx];
    setEditingId(item.id);
    setForm({
      title: item.title,
      content: item.content || '',
      summary: item.summary || '',
      image: item.image || '',
      category: item.category || '뉴스',
      is_featured: item.is_featured,
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
      summary: form.summary.trim(),
      image: form.image || null,
      category: form.category,
      is_featured: form.is_featured,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/corporate/news/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '뉴스가 수정되었습니다.' });
      } else {
        await apiClient('/api/corporate/news', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '뉴스가 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchNews();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/corporate/news/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '뉴스가 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchNews();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Table columns & data
  const columns = [
    { key: 'image', label: '이미지', className: 'w-16' },
    { key: 'title', label: '제목' },
    { key: 'category', label: '카테고리', className: 'w-24' },
    { key: 'is_featured', label: '주요', className: 'w-20' },
    { key: 'is_active', label: '상태', className: 'w-20' },
    { key: 'created_at', label: '등록일', className: 'w-28' },
  ];

  const tableData: Record<string, ReactNode>[] = newsList.map((item) => ({
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
      <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${CATEGORY_BADGE[item.category] || 'bg-gray-100 text-gray-700'}`}>
        {item.category}
      </span>
    ),
    is_featured: item.is_featured ? (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">★</span>
    ) : (
      <span className="text-gray-400">-</span>
    ),
    is_active: item.is_active ? (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">활성</span>
    ) : (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-500">비활성</span>
    ),
    created_at: <span className="text-admin-text-secondary">{formatDate(item.created_at)}</span>,
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
        title={`뉴스 목록 (${newsList.length}개)`}
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
          onDelete={(idx) => setDeleteTarget(newsList[idx])}
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
          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            category="corporate"
            label="이미지"
          />

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

          {/* Summary */}
          <AdminInput
            label="요약"
            name="summary"
            value={form.summary}
            onChange={handleFormChange}
            placeholder="뉴스 요약"
          />

          {/* Content */}
          <AdminInput
            label="내용"
            name="content"
            type="textarea"
            value={form.content}
            onChange={handleFormChange}
            placeholder="뉴스 내용"
          />

          {/* is_featured checkbox */}
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
              className="rounded border-admin-border"
            />
            주요 뉴스
          </label>

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
