'use client';

import { useState } from 'react';
import Button from '@/components/common/Button';

interface Treatment {
  name: string;
  category: string;
  description: string;
}

const TREATMENTS: Treatment[] = [
  {
    name: '울쎄라피 프라임',
    category: '디자인 리프팅',
    description: '초음파 에너지를 활용한 리프팅 시술로, 피부 깊은 층의 SMAS까지 도달하여 자연스러운 리프팅 효과를 제공합니다.',
  },
  {
    name: '쿨소닉',
    category: '디자인 리프팅',
    description: '냉각 기술과 초음파를 결합한 차세대 리프팅으로, 통증은 줄이고 효과는 극대화한 시술입니다.',
  },
  {
    name: '써펙트',
    category: '디자인 리프팅',
    description: '고주파와 마이크로 니들을 결합하여 피부 탄력을 개선하고 모공을 축소하는 복합 시술입니다.',
  },
  {
    name: '스킨부스터',
    category: '모공·탄력',
    description: '히알루론산을 피부 진피층에 직접 주입하여 수분감과 탄력을 회복시키는 보습 전문 시술입니다.',
  },
  {
    name: '보톡스',
    category: '쁘띠',
    description: '주름 개선과 윤곽 교정에 효과적인 보톡스 시술로, 자연스러운 표정 유지가 가능합니다.',
  },
];

export default function TreatmentSlider() {
  const categories = [...new Set(TREATMENTS.map((t) => t.category))];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const filtered = TREATMENTS.filter((t) => t.category === activeCategory);

  return (
    <section className="section-padding bg-white">
      <div className="section-narrow">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-hospital-dark">
            Treatment
          </h2>
          <p className="mt-2 text-sm text-hospital-gray">
            예피다만의 전문 시술을 만나보세요
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-sm rounded-sm transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-hospital-gold text-white'
                  : 'bg-hospital-cream text-hospital-gray hover:bg-hospital-beige'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Treatment Cards - horizontal scroll */}
        <div className="snap-x-container gap-5 pb-4">
          {filtered.map((treatment, idx) => (
            <div
              key={idx}
              className="w-[300px] md:w-[360px] bg-hospital-cream rounded-sm overflow-hidden group"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-hospital-beige via-hospital-gold-light/30 to-hospital-cream flex items-center justify-center">
                <span className="font-serif text-2xl text-hospital-gold/50 italic">
                  {treatment.name}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="text-xs text-hospital-gold tracking-wide uppercase">
                  {treatment.category}
                </span>
                <h3 className="mt-1 text-lg font-medium text-hospital-dark">
                  {treatment.name}
                </h3>
                <p className="mt-2 text-sm text-hospital-gray leading-relaxed line-clamp-3">
                  {treatment.description}
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    예약하기
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
