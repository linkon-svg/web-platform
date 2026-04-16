'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard, AdminInput, AdminButton, ImageUploader } from '@/components/admin';

interface HospitalData {
  id: number;
  name: string;
  name_en: string;
  phone: string;
  address: string;
  business_number: string;
  ceo: string;
  logo_url: string;
}

const FIELDS = [
  { name: 'name', label: '병원명 (한국어)', placeholder: '병원명을 입력하세요' },
  { name: 'name_en', label: '병원명 (영어)', placeholder: 'Hospital name in English' },
  { name: 'phone', label: '전화번호', placeholder: '02-xxx-xxxx' },
  { name: 'address', label: '주소', placeholder: '서울특별시...' },
  { name: 'business_number', label: '사업자등록번호', placeholder: '000-00-00000' },
  { name: 'ceo', label: '대표자명', placeholder: '대표자 이름' },
] as const;

export default function AdminHospitalPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<HospitalData>({
    id: 1, name: '', name_en: '', phone: '', address: '', business_number: '', ceo: '', logo_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const data = await apiClient('/api/hospitals/1', { token });
        setForm({
          id: data.id,
          name: data.name || '',
          name_en: data.name_en || '',
          phone: data.phone || '',
          address: data.address || '',
          business_number: data.business_number || '',
          ceo: data.ceo || '',
          logo_url: data.logo_url || '',
        });
      } catch {
        setMessage({ type: 'error', text: '병원 정보를 불러오지 못했습니다.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const { id, ...body } = form;
      await apiClient('/api/hospitals/1', {
        method: 'PUT',
        body: JSON.stringify(body),
        token: token!,
      });
      setMessage({ type: 'success', text: '저장되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-admin-text-secondary">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminCard title="로고 이미지">
        <ImageUploader
          value={form.logo_url}
          onChange={(url) => setForm((prev) => ({ ...prev, logo_url: url }))}
          category="logo"
          label="병원 로고"
        />
        <p className="text-xs text-admin-text-secondary mt-2">
          권장 크기: 400x400 이상. 배경 투명 PNG 권장.
        </p>
      </AdminCard>

      <AdminCard title="병원 기본 정보">
        <div className="space-y-4">
          {FIELDS.map((field) => (
            <AdminInput
              key={field.name}
              label={field.label}
              name={field.name}
              value={form[field.name as keyof Omit<HospitalData, 'id' | 'logo_url'>] as string}
              onChange={handleChange}
              placeholder={field.placeholder}
            />
          ))}
        </div>
      </AdminCard>

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

      <div className="flex justify-end">
        <AdminButton onClick={handleSave} loading={saving} size="lg">
          저장
        </AdminButton>
      </div>
    </div>
  );
}
