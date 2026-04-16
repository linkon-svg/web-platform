import HeroSection from '@/components/templates/hospital/HeroSection';
import PhilosophySection from '@/components/templates/hospital/PhilosophySection';
import CTASection from '@/components/templates/hospital/CTASection';
import MapSection from '@/components/templates/hospital/MapSection';

export default function IntroducePage() {
  return (
    <>
      <HeroSection
        title="YEPIDA CLINIC"
        subtitle="건강한 아름다움을 추구하는 예피다의원"
      />

      {/* Hospital Introduction */}
      <section className="section-padding bg-white">
        <div className="section-narrow">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-hospital-dark italic mb-8">
              YEPIDA
            </h2>
            <p className="text-base md:text-lg text-hospital-gray leading-relaxed">
              예피다의원은 &ldquo;아름다움이 피어나다&rdquo;라는 뜻을 담고 있습니다.
              <br className="hidden md:block" />
              자연스러운 아름다움을 추구하며, 안전하고 검증된 시술만을 제공합니다.
            </p>
            <p className="mt-6 text-base md:text-lg text-hospital-gray leading-relaxed">
              최신 의료 장비와 풍부한 경험을 갖춘 의료진이
              <br className="hidden md:block" />
              환자 한 분 한 분에게 맞춤형 진료를 제공하여
              <br className="hidden md:block" />
              최상의 결과를 이끌어냅니다.
            </p>
          </div>
        </div>
      </section>

      <PhilosophySection />

      <CTASection />

      <MapSection />
    </>
  );
}
