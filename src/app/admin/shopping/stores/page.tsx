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

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  region: '국내' | '해외';
  sort_order: number;
  is_active: boolean;
}

interface StoreForm {
  name: string;
  address: string;
  phone: string;
  region: '국내' | '해외';
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: StoreForm = {
  name: '',
  address: '',
  phone: '',
  region: '국내',
  sort_order: 0,
  is_active: true,
};

const REGION_OPTIONS = [
  { label: '국내', value: '국내' },
  { label: '해외', value: '해외' },
];

export default function AdminShoppingStoresPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<StoreForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/shopping/stores', { token });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '매장 목록을 불러오지 못했습니다.' });
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
      address: item.address,
      phone: item.phone,
      region: item.region,
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
      setMessage({ type: 'error', text: '매장명은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name.trim(),
      address: form.address.trim(),
      phone: form.phone.trim(),
      region: form.region,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    try {
      if (editingId) {
        await apiClient(`/api/shopping/stores/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '매장 정보가 수정되었습니다.' });
      } else {
        await apiClient('/api/shopping/stores', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '매장이 추가되었습니다.' });
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
      await apiClient(`/api/shopping/stores/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '매장이 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchItems();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'name', label: '매장명' },
    { key: 'region', label: '지역', className: 'w-20' },
    { key: 'address', label: '주소' },
    { key: 'phone', label: '전화번호', className: 'w-36' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
    { key: 'is_active', label: '상태', className: 'w-20' },
  ];

  const tableData: Record<string, ReactNode>[] = items.map((item) => ({
    name: <span className="font-medium">{item.name}</span>,
    region: (
      <span
        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
          item.region === '국내'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-green-100 text-green-700'
        }`}
      >
        {item.region}
      </span>
    ),
    address: <span className="text-sm text-admin-text-secondary">{item.address}</span>,
    phone: <span className="text-sm text-admin-text-secondary">{item.phone}</span>,
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

      {/* Stores Table */}
      <AdminCard
        title={`매장 목록 (${items.length}개)`}
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
        title={editingId ? '매장 수정' : '매장 추가'}
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
            label="매장명"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="매장 이름"
          />

          {/* Region */}
          <AdminInput
            label="지역"
            name="region"
            type="select"
            value={form.region}
            onChange={handleFormChange}
            options={REGION_OPTIONS}
          />

          {/* Address */}
          <AdminInput
            label="주소"
            name="address"
            value={form.address}
            onChange={handleFormChange}
            placeholder="매장 주소"
          />

          {/* Phone */}
          <AdminInput
            label="전화번호"
            name="phone"
            value={form.phone}
            onChange={handleFormChange}
            placeholder="02-1234-5678"
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
        title="매장 삭제"
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
          <strong>{deleteTarget?.name}</strong> 매장을 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
