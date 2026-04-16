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
}

interface Product {
  id: number;
  name: string;
  name_en: string;
  description: string;
  price: number;
  sale_price: number | null;
  category_id: number | null;
  images: string[];
  thumbnail: string | null;
  is_new: boolean;
  is_recommended: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ProductForm {
  name: string;
  name_en: string;
  description: string;
  price: string;
  sale_price: string;
  category_id: string;
  thumbnail: string;
  is_new: boolean;
  is_recommended: boolean;
  sort_order: number;
}

const EMPTY_FORM: ProductForm = {
  name: '',
  name_en: '',
  description: '',
  price: '',
  sale_price: '',
  category_id: '',
  thumbnail: '',
  is_new: false,
  is_recommended: false,
  sort_order: 0,
};

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/shopping/products', { token });
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '상품 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/shopping/categories', { token });
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      // silent fail for categories
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return '-';
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '-';
  };

  const categoryOptions = categories.map((c) => ({
    label: c.name,
    value: String(c.id),
  }));

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const product = products[idx];
    setEditingId(product.id);
    setForm({
      name: product.name,
      name_en: product.name_en || '',
      description: product.description || '',
      price: String(product.price || ''),
      sale_price: product.sale_price ? String(product.sale_price) : '',
      category_id: product.category_id ? String(product.category_id) : '',
      thumbnail: product.thumbnail || '',
      is_new: product.is_new,
      is_recommended: product.is_recommended,
      sort_order: product.sort_order,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setMessage({ type: 'error', text: '상품명은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      thumbnail: form.thumbnail || null,
      is_new: form.is_new,
      is_recommended: form.is_recommended,
      sort_order: form.sort_order,
    };

    try {
      if (editingId) {
        await apiClient(`/api/shopping/products/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '상품이 수정되었습니다.' });
      } else {
        await apiClient('/api/shopping/products', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '상품이 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchProducts();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/shopping/products/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '상품이 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchProducts();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'thumbnail', label: '이미지', className: 'w-16' },
    { key: 'name', label: '상품명' },
    { key: 'category', label: '카테고리' },
    { key: 'price', label: '가격' },
    { key: 'sale_price', label: '할인가' },
    { key: 'is_new', label: '신상품', className: 'w-20' },
    { key: 'is_recommended', label: '추천', className: 'w-20' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
  ];

  const tableData: Record<string, ReactNode>[] = products.map((item) => ({
    thumbnail: item.thumbnail ? (
      <img
        src={item.thumbnail.startsWith('http') ? item.thumbnail : `${API_BASE}${item.thumbnail}`}
        alt={item.name}
        className="w-10 h-10 rounded object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
        -
      </div>
    ),
    name: <span className="font-medium">{item.name}</span>,
    category: <span className="text-admin-text-secondary">{getCategoryName(item.category_id)}</span>,
    price: <span>{item.price.toLocaleString()}원</span>,
    sale_price: item.sale_price ? (
      <span className="text-red-600">{item.sale_price.toLocaleString()}원</span>
    ) : (
      <span className="text-gray-400">-</span>
    ),
    is_new: item.is_new ? (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">NEW</span>
    ) : (
      <span className="text-gray-400">-</span>
    ),
    is_recommended: item.is_recommended ? (
      <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">추천</span>
    ) : (
      <span className="text-gray-400">-</span>
    ),
    sort_order: <span className="text-admin-text-secondary">{item.sort_order}</span>,
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

      {/* Products Table */}
      <AdminCard
        title={`상품 목록 (${products.length}개)`}
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
          onDelete={(idx) => setDeleteTarget(products[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '상품 수정' : '상품 추가'}
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
          {/* Thumbnail */}
          <ImageUploader
            value={form.thumbnail}
            onChange={(url) => setForm((prev) => ({ ...prev, thumbnail: url }))}
            category="products"
            label="대표 이미지"
          />

          {/* Name */}
          <AdminInput
            label="상품명"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="상품명"
          />

          {/* Name EN */}
          <AdminInput
            label="영문명"
            name="name_en"
            value={form.name_en}
            onChange={handleFormChange}
            placeholder="Product name"
          />

          {/* Description */}
          <AdminInput
            label="설명"
            name="description"
            type="textarea"
            value={form.description}
            onChange={handleFormChange}
            placeholder="상품 설명"
          />

          {/* Price */}
          <AdminInput
            label="가격"
            name="price"
            value={form.price}
            onChange={handleFormChange}
            placeholder="0"
          />

          {/* Sale Price */}
          <AdminInput
            label="할인가"
            name="sale_price"
            value={form.sale_price}
            onChange={handleFormChange}
            placeholder="0"
          />

          {/* Category */}
          <AdminInput
            label="카테고리"
            name="category_id"
            type="select"
            value={form.category_id}
            onChange={handleFormChange}
            placeholder="카테고리 선택"
            options={categoryOptions}
          />

          {/* is_new checkbox */}
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="checkbox"
              checked={form.is_new}
              onChange={(e) => setForm((prev) => ({ ...prev, is_new: e.target.checked }))}
              className="rounded border-admin-border"
            />
            신상품
          </label>

          {/* is_recommended checkbox */}
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="checkbox"
              checked={form.is_recommended}
              onChange={(e) => setForm((prev) => ({ ...prev, is_recommended: e.target.checked }))}
              className="rounded border-admin-border"
            />
            추천 상품
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
        title="상품 삭제"
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
          <strong>{deleteTarget?.name}</strong> 상품을 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
