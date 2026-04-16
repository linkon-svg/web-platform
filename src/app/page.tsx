import HeroSection from '@/components/templates/hospital/HeroSection';
import PhilosophySection from '@/components/templates/hospital/PhilosophySection';
import TreatmentSlider from '@/components/templates/hospital/TreatmentSlider';
import CTASection from '@/components/templates/hospital/CTASection';
import SpaceCarousel from '@/components/templates/hospital/SpaceCarousel';
import MapSection from '@/components/templates/hospital/MapSection';
import Button from '@/components/common/Button';

const FEATURED_TREATMENTS = [
  {
    name: 'Juvelook',
    category: '스킨부스터',
    description:
      'PDLLA 기반의 차세대 스킨부스터로, 콜라겐 재생을 촉진하여 피부 탄력과 볼륨을 자연스럽게 개선합니다.',
  },
  {
    name: 'Exosome',
    category: '재생 치료',
    description:
      '엑소좀을 활용한 첨단 재생 시술로, 피부 세포 간 신호 전달을 최적화하여 근본적인 피부 개선을 돕습니다.',
  },
  {
    name: 'Rejuran',
    category: '스킨부스터',
    description:
      '연어 유래 PN(폴리뉴클레오타이드) 성분이 피부 재생을 촉진하여 피부결과 탄력을 회복시킵니다.',
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />

      <PhilosophySection />

      <TreatmentSlider />

      <CTASection />

      {/* Featured Treatment Cards */}
      <section className="section-padding bg-hospital-cream">
        <div className="section-narrow">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-hospital-dark">
              Popular Treatment
            </h2>
            <p className="mt-2 text-sm text-hospital-gray">
              예피다의 인기 시술을 소개합니다
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_TREATMENTS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-sm overflow-hidden group hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] bg-gradient-to-br from-hospital-beige via-hospital-gold-light/30 to-hospital-cream flex items-center justify-center">
                  <span className="font-serif text-2xl text-hospital-gold/40 italic">
                    {item.name}
                  </span>
                </div>
                <div className="p-6">
                  <span className="text-xs text-hospital-gold tracking-wide uppercase">
                    {item.category}
                  </span>
                  <h3 className="mt-1 text-lg font-medium text-hospital-dark">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-hospital-gray leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm">
                      자세히 보기
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpaceCarousel />

      <MapSection />
    </>
  );
}
