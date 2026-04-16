'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard, AdminButton, AdminInput, ImageUploader } from '@/components/admin';

interface ConfigForm {
  company_name: string;
  company_name_en: string;
  logo: string;
  logo_dark: string;
  hero_type: string;
  hero_media: string;
  vision_title: string;
  vision_description: string;
  mission_title: string;
  mission_description: string;
  about_content: string;
  footer_ceo: string;
  footer_address: string;
  footer_phone: string;
  footer_fax: string;
  footer_email: string;
  footer_business_number: string;
  sns_blog: string;
  sns_youtube: string;
  sns_instagram: string;
  sns_facebook: string;
  sns_linkedin: string;
  dark_mode_default: boolean;
}

const initialForm: ConfigForm = {
  company_name: '',
  company_name_en: '',
  logo: '',
  logo_dark: '',
  hero_type: 'image',
  hero_media: '',
  vision_title: '',
  vision_description: '',
  mission_title: '',
  mission_description: '',
  about_content: '',
  footer_ceo: '',
  footer_address: '',
  footer_phone: '',
  footer_fax: '',
  footer_email: '',
  footer_business_number: '',
  sns_blog: '',
  sns_youtube: '',
  sns_instagram: '',
  sns_facebook: '',
  sns_linkedin: '',
  dark_mode_default: false,
};

export default function CorporateConfigPage() {
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
      const data = await apiClient('/api/corporate/config');
      if (data) {
        const footerInfo = data.footer_info || {};
        const snsLinks = data.sns_links || {};
        setForm({
          company_name: data.company_name || '',
          company_name_en: data.company_name_en || '',
          logo: data.logo || '',
          logo_dark: data.logo_dark || '',
          hero_type: data.hero_type || 'image',
          hero_media: data.hero_media || '',
          vision_title: data.vision_title || '',
          vision_description: data.vision_description || '',
          mission_title: data.mission_title || '',
          mission_description: data.mission_description || '',
          about_content: data.about_content || '',
          footer_ceo: footerInfo.ceo || '',
          footer_address: footerInfo.address || '',
          footer_phone: footerInfo.phone || '',
          footer_fax: footerInfo.fax || '',
          footer_email: footerInfo.email || '',
          footer_business_number: footerInfo.business_number || '',
          sns_blog: snsLinks.blog || '',
          sns_youtube: snsLinks.youtube || '',
          sns_instagram: snsLinks.instagram || '',
          sns_facebook: snsLinks.facebook || '',
          sns_linkedin: snsLinks.linkedin || '',
          dark_mode_default: data.dark_mode_default || false,
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        company_name: form.company_name,
        company_name_en: form.company_name_en,
        logo: form.logo,
        logo_dark: form.logo_dark,
        hero_type: form.hero_type,
        hero_media: form.hero_media,
        vision_title: form.vision_title,
        vision_description: form.vision_description,
        mission_title: form.mission_title,
        mission_description: form.mission_description,
        about_content: form.about_content,
        footer_info: {
          ceo: form.footer_ceo,
          address: form.footer_address,
          phone: form.footer_phone,
          fax: form.footer_fax,
          email: form.footer_email,
          business_number: form.footer_business_number,
        },
        sns_links: {
          blog: form.sns_blog,
          youtube: form.sns_youtube,
          instagram: form.sns_instagram,
          facebook: form.sns_facebook,
          linkedin: form.sns_linkedin,
        },
        dark_mode_default: form.dark_mode_default,
      };
      await apiClient('/api/corporate/config', {
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
        <h2 className="text-xl font-bold text-admin-text">기업 설정</h2>
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
            label="회사명"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
          />
          <AdminInput
            label="회사명 (영문)"
            name="company_name_en"
            value={form.company_name_en}
            onChange={handleChange}
          />
          <ImageUploader
            label="로고"
            category="corporate"
            value={form.logo}
            onChange={(url) => setForm((prev) => ({ ...prev, logo: url }))}
          />
          <ImageUploader
            label="로고 (다크)"
            category="corporate"
            value={form.logo_dark}
            onChange={(url) => setForm((prev) => ({ ...prev, logo_dark: url }))}
          />
        </div>
      </AdminCard>

      {/* Section 2: 히어로 */}
      <AdminCard title="히어로">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1">히어로 타입</label>
            <select
              name="hero_type"
              value={form.hero_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-admin-border rounded-lg bg-white text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
            >
              <option value="video">비디오</option>
              <option value="image">이미지</option>
              <option value="slider">슬라이더</option>
            </select>
          </div>
          <ImageUploader
            label="히어로 미디어"
            category="corporate"
            value={form.hero_media}
            onChange={(url) => setForm((prev) => ({ ...prev, hero_media: url }))}
          />
        </div>
      </AdminCard>

      {/* Section 3: 비전/미션 */}
      <AdminCard title="비전/미션">
        <div className="space-y-4">
          <AdminInput
            label="비전 제목"
            name="vision_title"
            value={form.vision_title}
            onChange={handleChange}
          />
          <AdminInput
            label="비전 설명"
            name="vision_description"
            type="textarea"
            value={form.vision_description}
            onChange={handleChange}
          />
          <AdminInput
            label="미션 제목"
            name="mission_title"
            value={form.mission_title}
            onChange={handleChange}
          />
          <AdminInput
            label="미션 설명"
            name="mission_description"
            type="textarea"
            value={form.mission_description}
            onChange={handleChange}
          />
        </div>
      </AdminCard>

      {/* Section 4: 회사 소개 */}
      <AdminCard title="회사 소개">
        <div className="space-y-4">
          <AdminInput
            label="소개 내용"
            name="about_content"
            type="textarea"
            value={form.about_content}
            onChange={handleChange}
          />
        </div>
      </AdminCard>

      {/* Section 5: 푸터 정보 */}
      <AdminCard title="푸터 정보">
        <div className="space-y-4">
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
            label="팩스"
            name="footer_fax"
            value={form.footer_fax}
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

      {/* Section 6: SNS 링크 */}
      <AdminCard title="SNS 링크">
        <div className="space-y-4">
          <AdminInput
            label="블로그"
            name="sns_blog"
            value={form.sns_blog}
            onChange={handleChange}
            placeholder="https://blog.example.com/..."
          />
          <AdminInput
            label="YouTube"
            name="sns_youtube"
            value={form.sns_youtube}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          />
          <AdminInput
            label="Instagram"
            name="sns_instagram"
            value={form.sns_instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
          <AdminInput
            label="Facebook"
            name="sns_facebook"
            value={form.sns_facebook}
            onChange={handleChange}
            placeholder="https://facebook.com/..."
          />
          <AdminInput
            label="LinkedIn"
            name="sns_linkedin"
            value={form.sns_linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/..."
          />
        </div>
      </AdminCard>

      {/* Section 7: 설정 */}
      <AdminCard title="설정">
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="dark_mode_default"
              checked={form.dark_mode_default}
              onChange={handleChange}
              className="w-4 h-4 rounded border-admin-border text-admin-primary focus:ring-admin-primary"
            />
            <span className="text-sm text-admin-text">다크 모드 기본 사용</span>
          </label>
        </div>
      </AdminCard>
    </div>
  );
}
