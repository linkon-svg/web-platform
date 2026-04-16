'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard, AdminButton, AdminInput, ImageUploader } from '@/components/admin';

interface ConfigForm {
  shop_name: string;
  shop_name_en: string;
  logo: string;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  season_banner_image: string;
  season_banner_title: string;
  season_banner_subtitle: string;
  promo_text: string;
  about_content: string;
  footer_company: string;
  footer_ceo: string;
  footer_business_number: string;
  footer_address: string;
  footer_phone: string;
  footer_email: string;
  sns_instagram: string;
  sns_youtube: string;
}

const initialForm: ConfigForm = {
  shop_name: '',
  shop_name_en: '',
  logo: '',
  hero_image: '',
  hero_title: '',
  hero_subtitle: '',
  season_banner_image: '',
  season_banner_title: '',
  season_banner_subtitle: '',
  promo_text: '',
  about_content: '',
  footer_company: '',
  footer_ceo: '',
  footer_business_number: '',
  footer_address: '',
  footer_phone: '',
  footer_email: '',
  sns_instagram: '',
  sns_youtube: '',
};

export default function ShopConfigPage() {
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
      const data = await apiClient('/api/shopping/config');
      if (data) {
        const footerInfo = data.footer_info || {};
        const snsLinks = data.sns_links || {};
        setForm({
          shop_name: data.shop_name || '',
          shop_name_en: data.shop_name_en || '',
          logo: data.logo || '',
          hero_image: data.hero_image || '',
          hero_title: data.hero_title || '',
          hero_subtitle: data.hero_subtitle || '',
          season_banner_image: data.season_banner_image || '',
          season_banner_title: data.season_banner_title || '',
          season_banner_subtitle: data.season_banner_subtitle || '',
          promo_text: data.promo_text || '',
          about_content: data.about_content || '',
          footer_company: footerInfo.company || '',
          footer_ceo: footerInfo.ceo || '',
          footer_business_number: footerInfo.business_number || '',
          footer_address: footerInfo.address || '',
          footer_phone: footerInfo.phone || '',
          footer_email: footerInfo.email || '',
          sns_instagram: snsLinks.instagram || '',
          sns_youtube: snsLinks.youtube || '',
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
        shop_name: form.shop_name,
        shop_name_en: form.shop_name_en,
        logo: form.logo,
        hero_image: form.hero_image,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        season_banner_image: form.season_banner_image,
        season_banner_title: form.season_banner_title,
        season_banner_subtitle: form.season_banner_subtitle,
        promo_text: form.promo_text,
        about_content: form.about_content,
        footer_info: {
          company: form.footer_company,
          ceo: form.footer_ceo,
          business_number: form.footer_business_number,
          address: form.footer_address,
          phone: form.footer_phone,
          email: form.footer_email,
        },
        sns_links: {
          instagram: form.sns_instagram,
          youtube: form.sns_youtube,
        },
      };
      await apiClient('/api/shopping/config', {
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
        <h2 className="text-xl font-bold text-admin-text">쇼핑몰 설정</h2>
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
            label="쇼핑몰명"
            name="shop_name"
            value={form.shop_name}
            onChange={handleChange}
          />
          <AdminInput
            label="쇼핑몰명 (영문)"
            name="shop_name_en"
            value={form.shop_name_en}
            onChange={handleChange}
          />
          <ImageUploader
            label="로고"
            category="shop"
            value={form.logo}
            onChange={(url) => setForm((prev) => ({ ...prev, logo: url }))}
          />
          <AdminInput
            label="프로모션 텍스트"
            name="promo_text"
            value={form.promo_text}
            onChange={handleChange}
          />
        </div>
      </AdminCard>

      {/* Section 2: 히어로 */}
      <AdminCard title="히어로">
        <div className="space-y-4">
          <ImageUploader
            label="히어로 이미지"
            category="shop"
            value={form.hero_image}
            onChange={(url) => setForm((prev) => ({ ...prev, hero_image: url }))}
          />
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
        </div>
      </AdminCard>

      {/* Section 3: 시즌 배너 */}
      <AdminCard title="시즌 배너">
        <div className="space-y-4">
          <ImageUploader
            label="시즌 배너 이미지"
            category="shop"
            value={form.season_banner_image}
            onChange={(url) =>
              setForm((prev) => ({ ...prev, season_banner_image: url }))
            }
          />
          <AdminInput
            label="시즌 배너 타이틀"
            name="season_banner_title"
            value={form.season_banner_title}
            onChange={handleChange}
          />
          <AdminInput
            label="시즌 배너 서브타이틀"
            name="season_banner_subtitle"
            value={form.season_banner_subtitle}
            onChange={handleChange}
          />
        </div>
      </AdminCard>

      {/* Section 4: 소개 페이지 */}
      <AdminCard title="소개 페이지">
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
            label="회사명"
            name="footer_company"
            value={form.footer_company}
            onChange={handleChange}
          />
          <AdminInput
            label="대표자"
            name="footer_ceo"
            value={form.footer_ceo}
            onChange={handleChange}
          />
          <AdminInput
            label="사업자등록번호"
            name="footer_business_number"
            value={form.footer_business_number}
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
        </div>
      </AdminCard>

      {/* Section 6: SNS 링크 */}
      <AdminCard title="SNS 링크">
        <div className="space-y-4">
          <AdminInput
            label="Instagram"
            name="sns_instagram"
            value={form.sns_instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/..."
          />
          <AdminInput
            label="YouTube"
            name="sns_youtube"
            value={form.sns_youtube}
            onChange={handleChange}
            placeholder="https://youtube.com/..."
          />
        </div>
      </AdminCard>
    </div>
  );
}
