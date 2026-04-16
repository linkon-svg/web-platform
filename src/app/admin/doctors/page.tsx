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

interface Doctor {
  id: number;
  hospital_id: number;
  name: string;
  title: string;
  photo_url: string | null;
  education: string[] | null;
  career: string[] | null;
  sort_order: number;
}

interface DoctorForm {
  name: string;
  title: string;
  photo_url: string;
  education: string[];
  career: string[];
  sort_order: number;
}

const EMPTY_FORM: DoctorForm = {
  name: '',
  title: '',
  photo_url: '',
  education: [''],
  career: [''],
  sort_order: 0,
};

const TITLE_OPTIONS = [
  { label: '대표원장', value: '대표원장' },
  { label: '부원장', value: '부원장' },
  { label: '원장', value: '원장' },
  { label: '전문의', value: '전문의' },
];

export default function AdminDoctorsPage() {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DoctorForm>({ ...EMPTY_FORM });

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Doctor | null>(null);

  const fetchDoctors = useCallback(async () => {
    if (!token) return;
    try {
      const data = await apiClient('/api/hospitals/1/doctors', { token });
      setDoctors(Array.isArray(data) ? data : []);
    } catch {
      setMessage({ type: 'error', text: '의료진 목록을 불러오지 못했습니다.' });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Clear message after 3 seconds
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, education: [''], career: [''] });
    setModalOpen(true);
  };

  const openEdit = (idx: number) => {
    const doctor = doctors[idx];
    setEditingId(doctor.id);
    setForm({
      name: doctor.name,
      title: doctor.title,
      photo_url: doctor.photo_url || '',
      education: doctor.education && doctor.education.length > 0 ? [...doctor.education] : [''],
      career: doctor.career && doctor.career.length > 0 ? [...doctor.career] : [''],
      sort_order: doctor.sort_order,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Dynamic list field handlers
  const handleListChange = (field: 'education' | 'career', index: number, value: string) => {
    setForm((prev) => {
      const list = [...prev[field]];
      list[index] = value;
      return { ...prev, [field]: list };
    });
  };

  const addListItem = (field: 'education' | 'career') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeListItem = (field: 'education' | 'career', index: number) => {
    setForm((prev) => {
      const list = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: list.length === 0 ? [''] : list };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.title.trim()) {
      setMessage({ type: 'error', text: '이름과 직책은 필수입니다.' });
      return;
    }

    setSaving(true);
    setMessage(null);

    const body = {
      name: form.name.trim(),
      title: form.title.trim(),
      photo_url: form.photo_url || null,
      education: form.education.filter((s) => s.trim() !== ''),
      career: form.career.filter((s) => s.trim() !== ''),
      sort_order: form.sort_order,
    };

    try {
      if (editingId) {
        await apiClient(`/api/doctors/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '의료진 정보가 수정되었습니다.' });
      } else {
        await apiClient('/api/hospitals/1/doctors', {
          method: 'POST',
          body: JSON.stringify(body),
          token: token!,
        });
        setMessage({ type: 'success', text: '의료진이 추가되었습니다.' });
      }
      setModalOpen(false);
      await fetchDoctors();
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await apiClient(`/api/doctors/${deleteTarget.id}`, {
        method: 'DELETE',
        token: token!,
      });
      setMessage({ type: 'success', text: '의료진이 삭제되었습니다.' });
      setDeleteTarget(null);
      await fetchDoctors();
    } catch {
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  // Table columns & data
  const columns = [
    { key: 'photo', label: '사진', className: 'w-16' },
    { key: 'name', label: '이름' },
    { key: 'title', label: '직책' },
    { key: 'education', label: '학력' },
    { key: 'career', label: '경력' },
    { key: 'sort_order', label: '순서', className: 'w-16' },
  ];

  const tableData: Record<string, ReactNode>[] = doctors.map((doc) => ({
    photo: doc.photo_url ? (
      <img
        src={doc.photo_url.startsWith('http') ? doc.photo_url : `${API_BASE}${doc.photo_url}`}
        alt={doc.name}
        className="w-10 h-10 rounded-full object-cover"
      />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
        {doc.name.charAt(0)}
      </div>
    ),
    name: <span className="font-medium">{doc.name}</span>,
    title: doc.title,
    education: (
      <div className="text-xs text-admin-text-secondary space-y-0.5">
        {doc.education?.slice(0, 2).map((e, i) => <div key={i}>{e}</div>)}
        {doc.education && doc.education.length > 2 && (
          <div className="text-admin-primary">+{doc.education.length - 2}개</div>
        )}
        {(!doc.education || doc.education.length === 0) && <span className="text-gray-400">-</span>}
      </div>
    ),
    career: (
      <div className="text-xs text-admin-text-secondary space-y-0.5">
        {doc.career?.slice(0, 2).map((c, i) => <div key={i}>{c}</div>)}
        {doc.career && doc.career.length > 2 && (
          <div className="text-admin-primary">+{doc.career.length - 2}개</div>
        )}
        {(!doc.career || doc.career.length === 0) && <span className="text-gray-400">-</span>}
      </div>
    ),
    sort_order: <span className="text-admin-text-secondary">{doc.sort_order}</span>,
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

      {/* Doctors Table */}
      <AdminCard
        title={`의료진 목록 (${doctors.length}명)`}
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
          onDelete={(idx) => setDeleteTarget(doctors[idx])}
        />
      </AdminCard>

      {/* Create/Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? '의료진 수정' : '의료진 추가'}
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
          {/* Photo */}
          <ImageUploader
            value={form.photo_url}
            onChange={(url) => setForm((prev) => ({ ...prev, photo_url: url }))}
            category="doctors"
            label="프로필 사진"
          />

          {/* Name */}
          <AdminInput
            label="이름"
            name="name"
            value={form.name}
            onChange={handleFormChange}
            placeholder="의료진 이름"
          />

          {/* Title */}
          <AdminInput
            label="직책"
            name="title"
            type="select"
            value={form.title}
            onChange={handleFormChange}
            placeholder="직책 선택"
            options={TITLE_OPTIONS}
          />

          {/* Education - dynamic list */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-admin-text">학력</label>
            {form.education.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('education', idx, e.target.value)}
                  placeholder="예: 서울대학교 의과대학 졸업"
                  className="flex-1 rounded-lg border border-admin-border px-3 py-2 text-sm text-admin-text placeholder:text-admin-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('education', idx)}
                  className="p-1.5 rounded-md text-admin-danger hover:bg-red-50 transition-colors flex-shrink-0"
                  aria-label="삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4L4 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('education')}
              className="text-xs text-admin-primary hover:underline mt-1"
            >
              + 학력 추가
            </button>
          </div>

          {/* Career - dynamic list */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-admin-text">경력</label>
            {form.career.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListChange('career', idx, e.target.value)}
                  placeholder="예: 서울대병원 피부과 전문의"
                  className="flex-1 rounded-lg border border-admin-border px-3 py-2 text-sm text-admin-text placeholder:text-admin-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeListItem('career', idx)}
                  className="p-1.5 rounded-md text-admin-danger hover:bg-red-50 transition-colors flex-shrink-0"
                  aria-label="삭제"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 4l8 8M12 4L4 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem('career')}
              className="text-xs text-admin-primary hover:underline mt-1"
            >
              + 경력 추가
            </button>
          </div>

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
        title="의료진 삭제"
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
          <strong>{deleteTarget?.name}</strong> ({deleteTarget?.title}) 의료진을 삭제하시겠습니까?
          <br />
          <span className="text-admin-text-secondary mt-1 block">이 작업은 되돌릴 수 없습니다.</span>
        </p>
      </AdminModal>
    </div>
  );
}
