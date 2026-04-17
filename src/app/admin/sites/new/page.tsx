'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { AdminCard, AdminButton, AdminInput } from '@/components/admin';

const TEMPLATES = [
  {
    id: 'hospital',
    name: '병원 템플릿',
    description: '의료기관에 최적화된 전문 템플릿. 의료진, 시술, 예약 기능 포함.',
    icon: '🏥',
  },
  {
    id: 'landing',
    name: '랜딩 템플릿',
    description: '마케팅 캠페인, 이벤트용 원페이지 랜딩 페이지.',
    icon: '🚀',
  },
  {
    id: 'shopping',
    name: '쇼핑몰 템플릿',
    description: '제품 판매에 최적화된 이커머스 템플릿.',
    icon: '🛒',
  },
  {
    id: 'corporate',
    name: '기업 템플릿',
    description: '기업 소개, 서비스 안내에 적합한 비즈니스 템플릿.',
    icon: '🏢',
  },
];

const COLOR_PRESETS = [
  { label: '블루', value: '#3B82F6' },
  { label: '그린', value: '#10B981' },
  { label: '퍼플', value: '#8B5CF6' },
  { label: '레드', value: '#EF4444' },
  { label: '오렌지', value: '#F97316' },
  { label: '핑크', value: '#EC4899' },
  { label: '틸', value: '#14B8A6' },
  { label: '인디고', value: '#6366F1' },
];

export default function SiteNewPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  const handleNext = () => {
    if (!selectedTemplate) return;
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async () => {
    setNameError(null);
    setError(null);

    if (!name.trim()) {
      setNameError('사이트 이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await apiClient('/api/sites', {
        method: 'POST',
        body: JSON.stringify({
          template_id: selectedTemplate,
          name: name.trim(),
          description: description.trim(),
          domain: domain.trim() || undefined,
          config: { primary_color: primaryColor },
        }),
        token: token ?? undefined,
      });
      router.push('/admin/sites');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '사이트 생성 중 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            step >= 1
              ? 'bg-admin-primary text-white'
              : 'bg-gray-200 text-admin-text-secondary'
          }`}
        >
          1
        </div>
        <div
          className={`h-0.5 w-12 ${
            step >= 2 ? 'bg-admin-primary' : 'bg-gray-200'
          }`}
        />
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
            step >= 2
              ? 'bg-admin-primary text-white'
              : 'bg-gray-200 text-admin-text-secondary'
          }`}
        >
          2
        </div>
        <span className="text-sm text-admin-text-secondary ml-2">
          {step === 1 ? '템플릿 선택' : '기본 정보 입력'}
        </span>
      </div>

      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-admin-text">
              템플릿 선택
            </h2>
            <p className="text-sm text-admin-text-secondary mt-1">
              사이트에 사용할 템플릿을 선택해주세요.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl.id)}
                className="text-left w-full"
              >
                <AdminCard
                  className={`h-full transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'ring-2 ring-admin-primary border-admin-primary/40'
                      : 'hover:shadow-md hover:border-admin-primary/30'
                  }`}
                >
                  {/* Thumbnail placeholder */}
                  <div className="flex items-center justify-center h-24 bg-gray-50 rounded-lg mb-3 text-3xl">
                    {tmpl.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-admin-text">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-admin-text-secondary mt-1 leading-relaxed">
                    {tmpl.description}
                  </p>
                  {selectedTemplate === tmpl.id && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-primary text-white mt-2">
                      선택됨
                    </span>
                  )}
                </AdminCard>
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <AdminButton
              onClick={handleNext}
              disabled={!selectedTemplate}
              size="lg"
            >
              다음
            </AdminButton>
          </div>
        </div>
      )}

      {/* Step 2: Site Basic Info */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-admin-text">
              사이트 기본 정보
            </h2>
            <p className="text-sm text-admin-text-secondary mt-1">
              생성할 사이트의 기본 정보를 입력해주세요.
            </p>
          </div>

          <AdminCard>
            <div className="space-y-5">
              <AdminInput
                label="사이트 이름 *"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="예: 우리 병원 홈페이지"
                error={nameError ?? undefined}
              />

              <AdminInput
                label="사이트 설명"
                name="description"
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="사이트에 대한 간단한 설명을 입력해주세요."
              />

              <AdminInput
                label="도메인 / 서브도메인 (선택)"
                name="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="예: my-hospital.example.com"
              />

              {/* Color Picker */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-admin-text">
                  메인 컬러
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      title={color.label}
                      onClick={() => setPrimaryColor(color.value)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        primaryColor === color.value
                          ? 'border-admin-text ring-2 ring-offset-2 ring-admin-primary/40 scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.value }}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-admin-border"
                    />
                    <span className="text-xs text-admin-text-secondary">
                      {primaryColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          {error && (
            <div className="rounded-lg bg-red-50 border border-admin-danger/30 p-4">
              <p className="text-sm text-admin-danger">{error}</p>
            </div>
          )}

          <div className="flex justify-between">
            <AdminButton variant="secondary" onClick={handleBack} size="lg">
              이전
            </AdminButton>
            <AdminButton
              onClick={handleSubmit}
              loading={loading}
              size="lg"
            >
              생성하기
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}
