import PromotionCard from '@/components/templates/hospital/PromotionCard';

const PROMOTIONS = [
  {
    title: '써마지FLX 400샷 특별가',
    gradient: 'from-hospital-beige to-hospital-cream',
  },
  {
    title: '울쎄라피 프라임 리프팅 패키지',
    gradient: 'from-hospital-cream to-hospital-beige',
  },
  {
    title: '스킨부스터 3회 프로그램 할인',
    gradient: 'from-hospital-gold-light/20 to-hospital-cream',
  },
  {
    title: '보톡스 + 필러 동시 시술 혜택',
    gradient: 'from-hospital-beige to-hospital-gold-light/20',
  },
  {
    title: '엑소좀 재생 관리 신규 론칭 이벤트',
    gradient: 'from-hospital-cream to-hospital-beige',
  },
  {
    title: '주벨룩 볼륨 3회 패키지 특가',
    gradient: 'from-hospital-beige to-hospital-cream',
  },
  {
    title: '써펙트 모공 집중 관리 프로그램',
    gradient: 'from-hospital-gold-light/20 to-hospital-beige',
  },
  {
    title: '리쥬란 힐러 첫 시술 할인 이벤트',
    gradient: 'from-hospital-cream to-hospital-gold-light/20',
  },
];

export default function ExhibitionsPage() {
  return (
    <>
      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />

      <section className="section-padding bg-white">
        <div className="section-narrow">
          {/* Heading */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic">
              Promotion
            </h1>
            <p className="mt-4 text-base md:text-lg text-hospital-gray leading-relaxed max-w-lg mx-auto">
              예피다의원의 특별한 프로모션을 확인하세요
            </p>
          </div>

          {/* Promotion Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PROMOTIONS.map((promo, idx) => (
              <PromotionCard
                key={idx}
                title={promo.title}
                gradient={promo.gradient}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
