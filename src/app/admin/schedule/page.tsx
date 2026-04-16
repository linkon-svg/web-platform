'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard, AdminInput, AdminButton } from '@/components/admin';

interface ScheduleData {
  weekday: string;
  saturday: string;
  sunday: string;
  holiday: string;
  lunch_time: string;
}

const FIELDS = [
  { name: 'weekday', label: '평일', placeholder: '09:00 - 18:00' },
  { name: 'saturday', label: '토요일', placeholder: '09:00 - 13:00' },
  { name: 'sunday', label: '일요일', placeholder: '휴진' },
  { name: 'holiday', label: '공휴일', placeholder: '휴진' },
  { name: 'lunch_time', label: '점심시간', placeholder: '13:00 - 14:00' },
] as const;

export default function AdminSchedulePage() {
  const { token } = useAuth();
  const [form, setForm] = useState<ScheduleData>({
    weekday: '', saturday: '', sunday: '', holiday: '', lunch_time: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const data = await apiClient('/api/hospitals/1/schedule', { token });
        setForm({
          weekday: data.weekday || '',
          saturday: data.saturday || '',
          sunday: data.sunday || '',
          holiday: data.holiday || '',
          lunch_time: data.lunch_time || '',
        });
      } catch {
        // Schedule might not exist yet — that's okay
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
      await apiClient('/api/hospitals/1/schedule', {
        method: 'PUT',
        body: JSON.stringify(form),
        token: token!,
      });
      setMessage({ type: 'success', text: '진료시간이 저장되었습니다.' });
    } catch {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-admin-text-secondary">로딩 중...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminCard title="진료시간 설정">
        <div className="space-y-4">
          {FIELDS.map((field) => (
            <AdminInput
              key={field.name}
              label={field.label}
              name={field.name}
              value={form[field.name as keyof ScheduleData]}
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
