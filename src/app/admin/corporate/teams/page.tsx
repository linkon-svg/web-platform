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

interface Team {
  id: number;
  name: string;
  name_en: string;
  description: string;
  image: string | null;
  link: string;
  sort_order: number;
  is_active: boolean;
}

interface TeamForm {
  name: string;
  name_en: string;
  description: string;
  image: string;
  link: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: TeamForm = {
  name: '',
  name_en: '',
  description: '',
  image: '',
  link: '',
  sort_order: 0,
  is_active: true,
};

export default function AdminCorporateTeamsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<TeamForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Team | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/corporate/teams', { token });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '팀 목록을 불러오지 못했습니다.' });
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
      name: item.name,
      name_en: item.name_en,
      description: item.description,
      image: item.image || '',
      link: item.link,
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
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '팀명은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      description: form.description.trim(),
      image: form.image || null,
      link: form.link.trim(),
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/corporate/teams/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '팀 정보가 수정되었습니다.' });
      } else {
        await apiClient('/api/corporate/teams', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '팀이 추가되었습니다.' });
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
      await apiClient(`/api/corporate/teams/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '팀이 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchItems();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'image', label: '이미지', className: 'w-16' },
    { key: 'name', label: '팀명' },
    { key: 'name_en', label: '영문명' },
    { key: 'description', label: '설명' },
    { key: 'link', label: '링크' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
    { key: 'is_active', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = items.map((item) => ({
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
    name_en: <span className="text-sm text-admin-text-secondary">{item.name_en}</span>,
    description: (
      <span className="text-sm text-admin-text-secondary">
        {item.description.length > 30 ? `${item.description.slice(0, 30)}...` : item.description}
      </span>
    ),
    link: <span className="text-sm text-admin-text-secondary">{item.link}</span>,
    sort_order: <span className="text-admin-text-secondary">{item.sort_order}</span>,
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

      {/* Teams Table */}
      <AdminCard
        title={`팀 목록 (${items.length}개)`}
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
        title={editingId ? '팀 수정' : '팀 추가'}
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
          {/* Name */}
          <AdminInput
            label="팀명"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="팀 이름"
          />

          {/* Name EN */}
          <AdminInput
            label="영문명"
            name="name_en"
            value={form.name_en}
            onChange={handleFormChange}
            placeholder="Team Name"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="팀 설명을 입력하세요"
          />

          {/* Image */}
          <ImageUploader
            value={form.image}
            onChange={(url) => setForm((prev) => ({ ...prev, image: url }))}
            category="corporate"
            label="이미지"
          />

          {/* Link */}
          <AdminInput
            label="링크"
            name="link"
            value={form.link}
            onChange={handleFormChange}
            placeholder="https://example.com"
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
        title="팀 삭제"
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
          <strong>{deleteTarget?.name}</strong> 팀을 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
