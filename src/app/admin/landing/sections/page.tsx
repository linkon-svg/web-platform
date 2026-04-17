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

interface Section {
  id: number;
  title: string;
  title_image: string;
  heading: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image: string;
  background_color: string;
  layout: string;
  has_carousel: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SectionForm {
  title: string;
  title_image: string;
  heading: string;
  description: string;
  cta_text: string;
  cta_link: string;
  background_image: string;
  background_color: string;
  layout: string;
  has_carousel: boolean;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: SectionForm = {
  title: '',
  title_image: '',
  heading: '',
  description: '',
  cta_text: '',
  cta_link: '',
  background_image: '',
  background_color: '',
  layout: 'left-text',
  has_carousel: false,
  sort_order: 0,
  is_active: true,
};

export default function LandingSectionsPage() {
  const { token } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SectionForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const fetchSections = useCallback(async () => {
    try {
      const data = await apiClient('/api/landing/sections');
      setSections(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '섹션 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

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
    const section = sections[idx];
    setEditingId(section.id);
    setForm({
      title: section.title || '',
      title_image: section.title_image || '',
      heading: section.heading || '',
      description: section.description || '',
      cta_text: section.cta_text || '',
      cta_link: section.cta_link || '',
      background_image: section.background_image || '',
      background_color: section.background_color || '',
      layout: section.layout || 'left-text',
      has_carousel: section.has_carousel,
      sort_order: section.sort_order,
      is_active: section.is_active,
    });
    setModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      setMessage({ type: 'error', text: '섹션 타이틀은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      title: form.title.trim(),
      title_image: form.title_image || null,
      heading: form.heading.trim(),
      description: form.description.trim(),
      cta_text: form.cta_text.trim(),
      cta_link: form.cta_link.trim(),
      background_image: form.background_image || null,
      background_color: form.background_color.trim(),
      layout: form.layout,
      has_carousel: form.has_carousel,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/landing/sections/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '섹션이 수정되었습니다.' });
      } else {
        await apiClient('/api/landing/sections', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '섹션이 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchSections();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/landing/sections/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '섹션이 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchSections();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  const layoutOptions = [
    { label: 'Left Text', value: 'left-text' },
    { label: 'Right Text', value: 'right-text' },
    { label: 'Center', value: 'center' },
  ];

  // Table columns & data
  const columns = [
    { key: 'title', label: '타이틀' },
    { key: 'heading', label: '헤딩' },
    { key: 'layout', label: '레이아웃', className: 'w-28' },
    { key: 'has_carousel', label: '캐러셀', className: 'w-20' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
    { key: 'is_active', label: '활성', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = sections.map((item) => ({
    title: <span className="font-medium">{item.title}</span>,
    heading: (
      <span className="text-admin-text-secondary">
        {item.heading && item.heading.length > 30
          ? item.heading.slice(0, 30) + '...'
          : item.heading || '-'}
      </span>
    ),
    layout: (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
        {item.layout}
      </span>
    ),
    has_carousel: item.has_carousel ? (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">ON</span>
    ) : (
      <span className="text-gray-400">-</span>
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

      {/* Sections Table */}
      <AdminCard
        title={`섹션 목록 (${sections.length}개)`}
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
          onDelete={(idx) => setDeleteTarget(sections[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '섹션 수정' : '섹션 추가'}
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
            label="타이틀"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="섹션 타이틀"
          />

          {/* Heading */}
          <AdminInput
            label="헤딩"
            name="heading"
            value={form.heading}
            onChange={handleFormChange}
            placeholder="섹션 헤딩"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="섹션 설명"
          />

          {/* CTA Text */}
          <AdminInput
            label="CTA 텍스트"
            name="cta_text"
            value={form.cta_text}
            onChange={handleFormChange}
            placeholder="버튼 텍스트"
          />

          {/* CTA Link */}
          <AdminInput
            label="CTA 링크"
            name="cta_link"
            value={form.cta_link}
            onChange={handleFormChange}
            placeholder="https://..."
          />

          {/* Background Image */}
          <ImageUploader
            label="배경 이미지"
            category="landing"
            value={form.background_image}
            onChange={(url) => setForm((prev) => ({ ...prev, background_image: url }))}
          />

          {/* Background Color */}
          <AdminInput
            label="배경 색상"
            name="background_color"
            value={form.background_color}
            onChange={handleFormChange}
            placeholder="#ffffff"
          />

          {/* Layout */}
          <AdminInput
            label="레이아웃"
            name="layout"
            type="select"
            value={form.layout}
            onChange={handleFormChange}
            options={layoutOptions}
          />

          {/* has_carousel checkbox */}
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="checkbox"
              checked={form.has_carousel}
              onChange={(e) => setForm((prev) => ({ ...prev, has_carousel: e.target.checked }))}
              className="rounded border-admin-border"
            />
            캐러셀 사용
          </label>

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
        title="섹션 삭제"
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
          <strong>{deleteTarget?.title}</strong> 섹션을 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
