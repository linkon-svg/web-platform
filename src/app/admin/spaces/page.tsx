'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient, API_BASE } from '@/lib/api';
import { AdminCard, AdminButton, AdminInput, AdminModal, ImageUploader } from '@/components/admin';

interface SpaceImage {
  id: number;
  hospital_id: number;
  image_url: string;
  caption: string | null;
  sort_order: number;
}

export default function AdminSpacesPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<SpaceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ image_url: '', caption: '', sort_order: '0' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchItems = async () => {
    try {
      const data = await apiClient('/api/hospitals/1/spaces', { token: token! });
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '공간 사진을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchItems();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!confirm('이 사진을 삭제하시겠습니까?')) return;
    try {
      await apiClient(`/api/spaces/${id}`, { method: 'DELETE', token: token! });
      setMessage({ type: 'success', text: '삭제되었습니다.' });
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async () => {
    if (!form.image_url) {
      setMessage({ type: 'error', text: '이미지를 먼저 업로드하세요.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await apiClient('/api/hospitals/1/spaces', {
        method: 'POST',
        body: JSON.stringify({
          image_url: form.image_url,
          caption: form.caption || null,
          sort_order: parseInt(form.sort_order) || 0,
        }),
        token: token!,
      });
      setModalOpen(false);
      setForm({ image_url: '', caption: '', sort_order: '0' });
      setMessage({ type: 'success', text: '추가되었습니다.' });
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: '추가에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-admin-text-secondary">로딩 중...</div>;
  }

  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order);

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
        title={`공간 사진 (${items.length}장)`}
        actions={
          <AdminButton size="sm" onClick={() => { setForm({ image_url: '', caption: '', sort_order: '0' }); setModalOpen(true); }}>
            + 추가
          </AdminButton>
        }
      >
        {sorted.length === 0 ? (
          <p className="text-center text-admin-text-secondary py-8">
            아직 등록된 사진이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sorted.map((item) => {
              const imgSrc = item.image_url.startsWith('http')
                ? item.image_url
                : `${API_BASE}${item.image_url}`;
              return (
                <div key={item.id} className="relative group rounded-lg overflow-hidden border border-admin-border">
                  <img
                    src={imgSrc}
                    alt={item.caption || '공간 사진'}
                    className="w-full h-40 object-cover"
                  />
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="삭제"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M2 2l10 10M12 2L2 12" />
                    </svg>
                  </button>
                  {/* Caption */}
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1">
                      <p className="text-xs text-white truncate">{item.caption}</p>
                    </div>
                  )}
                  {/* Sort order badge */}
                  <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                    #{item.sort_order}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="공간 사진 추가"
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => setModalOpen(false)}>
              취소
            </AdminButton>
            <AdminButton onClick={handleAdd} loading={saving}>
              추가
            </AdminButton>
          </>
        }
      >
        <div className="space-y-4">
          <ImageUploader
            value={form.image_url}
            onChange={(url) => setForm((prev) => ({ ...prev, image_url: url }))}
            category="spaces"
            label="사진"
          />
          <AdminInput label="설명 (선택)" name="caption" value={form.caption} onChange={handleChange} placeholder="로비, 상담실 등" />
          <AdminInput label="표시 순서" name="sort_order" value={form.sort_order} onChange={handleChange} placeholder="0" />
        </div>
      </AdminModal>
    </div>
  );
}
