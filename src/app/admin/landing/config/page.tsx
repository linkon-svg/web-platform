'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard, AdminButton, AdminInput, ImageUploader } from '@/components/admin';

interface ConfigForm {
  site_name: string;
  logo: string;
  promo_bar_text: string;
  promo_bar_link: string;
  promo_bar_active: boolean;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_background: string;
  footer_company_name: string;
  footer_ceo: string;
  footer_address: string;
  footer_phone: string;
  footer_email: string;
  footer_business_number: string;
  sns_blog: string;
  sns_linkedin: string;
  sns_facebook: string;
}

const initialForm: ConfigForm = {
  site_name: '',
  logo: '',
  promo_bar_text: '',
  promo_bar_link: '',
  promo_bar_active: false,
  hero_title: '',
  hero_subtitle: '',
  hero_cta_text: '',
  hero_cta_link: '',
  hero_background: '',
  footer_company_name: '',
  footer_ceo: '',
  footer_address: '',
  footer_phone: '',
  footer_email: '',
  footer_business_number: '',
  sns_blog: '',
  sns_linkedin: '',
  sns_facebook: '',
};

export default function LandingConfigPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<ConfigForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const fetchConfig = useCallback(async () => {
    try {
      const data = await apiClient('/api/landing/config');
      if (data) {
        const snsLinks = data.sns_links || {};
        setForm({
          site_name: data.site_name || '',
          logo: data.logo || '',
          promo_bar_text: data.promo_bar_text || '',
          promo_bar_link: data.promo_bar_link || '',
          promo_bar_active: data.promo_bar_active || false,
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          hero_cta_text: data.hero_cta_text || '',
          hero_cta_link: data.hero_cta_link || '',
          hero_background: data.hero_background || '',
          footer_company_name: data.footer_company_name || '',
          footer_ceo: data.footer_ceo || '',
          footer_address: data.footer_address || '',
          footer_phone: data.footer_phone || '',
          footer_email: data.footer_email || '',
          footer_business_number: data.footer_business_number || '',
          sns_blog: snsLinks.blog || '',
          sns_linkedin: snsLinks.linkedin || '',
          sns_facebook: snsLinks.facebook || '',
        });
      }
    } catch {
      setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        site_name: form.site_name,
        logo: form.logo,
        promo_bar_text: form.promo_bar_text,
        promo_bar_link: form.promo_bar_link,
        promo_bar_active: form.promo_bar_active,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        hero_cta_text: form.hero_cta_text,
        hero_cta_link: form.hero_cta_link,
        hero_background: form.hero_background,
        footer_company_name: form.footer_company_name,
        footer_ceo: form.footer_ceo,
        footer_address: form.footer_address,
        footer_phone: form.footer_phone,
        footer_email: form.footer_email,
        footer_business_number: form.footer_business_number,
        sns_links: {
          blog: form.sns_blog,
          linkedin: form.sns_linkedin,
          facebook: form.sns_facebook,
        },
      };
      await apiClient('/api/landing/config', {
        method: 'PUT',
        body: JSON.stringify(body),
        token: token!,
      });
      setMessage({ type: 'success', text: '설정이 저장되었습니다.' });
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-admin-text">랜딩 페이지 설정</h2>
        <AdminButton onClick={handleSave} loading={saving}>
          저장
        </AdminButton>
      </div>

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

      {/* Section 1: 기본 정보 */}
      <AdminCard title="기본 정보">
        <div className="space-y-4">
          <AdminInput
            label="사이트명"
            name="site_name"
            value={form.site_name}
            onChange={handleChange}
          />
          <ImageUploader
            label="로고"
            category="landing"
            value={form.logo}
            onChange={(url) => setForm((prev) => ({ ...prev, logo: url }))}
          />
        </div>
      </AdminCard>

      {/* Section 2: 프로모 배너 */}
      <AdminCard title="프로모 배너">
        <div className="space-y-4">
          <AdminInput
            label="프로모 텍스트"
            name="promo_bar_text"
            value={form.promo_bar_text}
            onChange={handleChange}
          />
          <AdminInput
            label="프로모 링크"
            name="promo_bar_link"
            value={form.promo_bar_link}
            onChange={handleChange}
            placeholder="https://..."
          />
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="checkbox"
              checked={form.promo_bar_active}
              onChange={(e) => setForm((prev) => ({ ...prev, promo_bar_active: e.target.checked }))}
              className="rounded border-admin-border"
            />
            프로모 배너 활성화
          </label>
        </div>
      </AdminCard>

      {/* Section 3: 히어로 */}
      <AdminCard title="히어로">
        <div className="space-y-4">
          <AdminInput
            label="히어로 타이틀"
            name="hero_title"
            value={form.hero_title}
            onChange={handleChange}
          />
          <AdminInput
            label="히어로 서브타이틀"
            name="hero_subtitle"
            value={form.hero_subtitle}
            onChange={handleChange}
          />
          <AdminInput
            label="CTA 텍스트"
            name="hero_cta_text"
            value={form.hero_cta_text}
            onChange={handleChange}
          />
          <AdminInput
            label="CTA 링크"
            name="hero_cta_link"
            value={form.hero_cta_link}
            onChange={handleChange}
            placeholder="https://..."
          />
          <ImageUploader
            label="히어로 배경 이미지"
            category="landing"
            value={form.hero_background}
            onChange={(url) => setForm((prev) => ({ ...prev, hero_background: url }))}
          />
        </div>
      </AdminCard>

      {/* Section 4: 푸터 */}
      <AdminCard title="푸터">
        <div className="space-y-4">
          <AdminInput
            label="회사명"
            name="footer_company_name"
            value={form.footer_company_name}
            onChange={handleChange}
          />
          <AdminInput
            label="대표자"
            name="footer_ceo"
            value={form.footer_ceo}
            onChange={handleChange}
          />
          <AdminInput
            label="주소"
            name="footer_address"
            value={form.footer_address}
            onChange={handleChange}
          />
          <AdminInput
            label="전화번호"
            name="footer_phone"
            value={form.footer_phone}
            onChange={handleChange}
          />
          <AdminInput
            label="이메일"
            name="footer_email"
            value={form.footer_email}
            onChange={handleChange}
          />
          <AdminInput
            label="사업자등록번호"
            name="footer_business_number"
            value={form.footer_business_number}
            onChange={handleChange}
          />
        </div>
      </AdminCard>

      {/* Section 5: SNS */}
      <AdminCard title="SNS">
        <div className="space-y-4">
          <AdminInput
            label="Blog"
            name="sns_blog"
            value={form.sns_blog}
            onChange={handleChange}
            placeholder="https://blog.example.com"
          />
          <AdminInput
            label="LinkedIn"
            name="sns_linkedin"
            value={form.sns_linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/..."
          />
          <AdminInput
            label="Facebook"
            name="sns_facebook"
            value={form.sns_facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
        </div>
      </AdminCard>
    </div>
  );
}
