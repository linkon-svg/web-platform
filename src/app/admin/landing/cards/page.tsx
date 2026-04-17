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
}

interface Card {
  id: number;
  section_id: number;
  title: string;
  description: string;
  image: string | null;
  link: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CardForm {
  section_id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: CardForm = {
  section_id: 0,
  title: '',
  description: '',
  image: '',
  link: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminLandingCardsPage() {
  const { token } = useAuth();
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<number | 0>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CardForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Card | null>(null);

  const fetchSections = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/landing/sections', { token });
      const list = Array.isArray(data) ? data : [];
      setSections(list);
      if (list.length > 0 && selectedSectionId === 0) {
        setSelectedSectionId(list[0].id);
      }
    } catch {
      setMessage({ type: 'error', text: '섹션 목록을 불러오지 못했습니다.' });
    }
  }, [token]);

  const fetchCards = useCallback(async () => {
    if (!token || !selectedSectionId) {
      setLoading(false);
      return;
    }
    try {
      const data = await apiClient(`/api/landing/sections/${selectedSectionId}/cards`, { token });
      setCards(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '카드 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token, selectedSectionId]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  useEffect(() => {
    if (selectedSectionId) {
      setLoading(true);
      fetchCards();
    }
  }, [selectedSectionId, fetchCards]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const sectionNameMap = new Map(sections.map((s) => [s.id, s.title]));

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, section_id: selectedSectionId || (sections[0]?.id ?? 0) });
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const card = cards[idx];
    setEditingId(card.id);
    setForm({
      section_id: card.section_id,
      title: card.title || '',
      description: card.description || '',
      image: card.image || '',
      link: card.link || '',
      sort_order: card.sort_order,
      is_active: card.is_active,
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
    if (!form.section_id) {
      setMessage({ type: 'error', text: '섹션을 선택해주세요.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      section_id: Number(form.section_id),
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image || null,
      link: form.link.trim(),
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/landing/cards/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '카드가 수정되었습니다.' });
      } else {
        await apiClient(`/api/landing/sections/${form.section_id}/cards`, {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '카드가 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchCards();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/landing/cards/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '카드가 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchCards();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'title', label: '제목' },
    { key: 'description', label: '설명' },
    { key: 'section', label: '섹션' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
    { key: 'is_active', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = cards.map((item) => ({
    title: <span className="font-medium">{item.title}</span>,
    description: (
      <span className="text-admin-text-secondary">
        {item.description ? (item.description.length > 30 ? item.description.slice(0, 30) + '...' : item.description) : '-'}
      </span>
    ),
    section: <span className="text-admin-text-secondary">{sectionNameMap.get(item.section_id) || '-'}</span>,
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

      {/* Section Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-admin-text">섹션 필터:</label>
        <select
          value={selectedSectionId}
          onChange={(e) => setSelectedSectionId(Number(e.target.value))}
          className="px-3 py-2 border border-admin-border rounded-lg text-sm bg-white text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      {/* Cards Table */}
      <AdminCard
        title={`캐러셀 카드 목록 (${cards.length}개)`}
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
          onDelete={(idx) => setDeleteTarget(cards[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '카드 수정' : '카드 추가'}
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
          {/* Section Select */}
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1">섹션</label>
            <select
              name="section_id"
              value={form.section_id}
              onChange={(e) => setForm((prev) => ({ ...prev, section_id: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-admin-border rounded-lg text-sm bg-white text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary/20 focus:border-admin-primary"
            >
              <option value={0} disabled>섹션 선택</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <AdminInput
            label="제목"
            name="title"
            value={form.title}
            onChange={handleFormChange}
            placeholder="카드 제목"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="카드 설명"
          />

          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            category="landing"
            label="이미지"
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
        title="카드 삭제"
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
          <strong>{deleteTarget?.title}</strong> 카드를 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
